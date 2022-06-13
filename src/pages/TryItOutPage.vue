<template>
  <h5 style="margin: 0; font-size: 20px; font-weight: 700">Try It Out</h5>
  <p style="max-width: 800px">
    You can test the input / output of Sentient.io API with the tool we provided
    below. Simply input your subscribed API key, and you’ll be able to test the
    input with the fields and check the output below.
  </p>

  <div class="column q-gutter-md">
    <BeforeYouStart />

    <DocUrlField />
    <!-- TODO: To build a authorize component, which should be able to take multiple types of authentication -->
    <!-- {{ securitySchemes }} -->
    <ApiKeyField @setApiKey="(apiKey) => setApiKey(apiKey)" />
    <ApiPathSelector
      :api-paths="apiPaths"
      :server-str="serverStr"
      @selectPath="(path) => setApiPath(path)"
    />
    <ListSelector
      label="Method"
      :options="methods"
      :default-value="method"
      @select="(val) => useSetMethod(val)"
    />
    <ListSelector
      label="Content Type"
      :options="contentTypes"
      :default-value="contentType"
      @select="(contType) => useSetContentType(contType)"
    />

    <!-- !!Critical Component!! -->
    <RequestResponse v-if="doc" />
  </div>

  <InlineError :error-message="docErr" v-if="docErr" />
  <!-- TODO Use swagger style of warning box -->
  <InlineError :error-message="yamlErr" v-if="yamlErr" />

  <!-- <pre class="bg-grey-2">{{ api }}</pre> -->
</template>

<script setup>
import { onMounted, watch, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { apiKey, setApiKey } from "src/services/apiKeyService";

// All key functions to extract data from api docs
import {
  loadDoc,
  doc,
  docErr,
  yamlErr,
  securitySchemes,
  getApiPaths,
  getServerStr,
  getApiObjsByPath,
  getMethodListByPath,
} from "src/services/docService";

import {
  // apis,
  api,
  methods,
  method,
  contentTypes,
  contentType,
  requestBody,
  setApis,
  initApis,
  setMethod,
  setContentType,
} from "src/services/apiService";

import { setEndpoint } from "src/services/tryItOutService";

import DocUrlField from "src/components/DocUrlField.vue";
import BeforeYouStart from "src/components/BeforeYouStart.vue";
import ApiKeyField from "src/components/ApiKeyFiled.vue";
import ApiPathSelector from "src/components/ApiPathSelector.vue";
import InlineError from "src/components/InlineError.vue";
import RequestResponse from "src/components/RequestResponse.vue";

import ListSelector from "src/modules/ListSelector/ListSelector.vue";

const route = useRoute();

// The pre-fix server string
const serverStr = ref();

// A list of paths under the ['paths'] tag
const apiPaths = ref();

// The path for current selected API
const apiPath = ref();

const useLoadDoc = async () => {
  init();
  const docUrl = decodeURI(route.query.docUrl);
  await loadDoc(docUrl);
  if (doc.value) {
    extractDocDetails();
  }
};

const setApiPath = (path) => {
  apiPath.value = path;
};

const extractDocDetails = () => {
  /**
   * !!! Critical Function !!!
   * After doc successfully loaded, extract detail from doc
   */
  apiPaths.value = getApiPaths();
  serverStr.value = getServerStr();
  initApiPath();
};

const serverStrOverride = () => {
  // console.log("serverStrOverride\n", api.value);
  if (api.value?.["servers"]) {
    serverStr.value = api.value?.["servers"][0]["url"];
  } else {
    serverStr.value = getServerStr();
  }
};

const initApiPath = () => {
  /** Init current API path by take the first element in the list */
  if (apiPaths.value[0]) {
    apiPath.value = apiPaths.value[0];
  }
};

const useSetApis = (path) => {
  /** Set api object that belongs to current path */
  // console.log("useSetApis\n", path);

  const apiObjs = getApiObjsByPath(path);
  setApis(apiObjs);
};

const useSetMethod = (meth) => {
  setMethod(meth);
};

const useSetContentType = (contType) => {
  setContentType(contType);
};

const init = () => {
  serverStr.value = null;
  apiPaths.value = null;
  apiPath.value = null;
  initApis();
};

onMounted(() => {
  if (route.query.docUrl) {
    useLoadDoc();
  }
});

watch(
  () => route.query.docUrl,
  () => useLoadDoc()
);

watch(apiPath, () => {
  console.log("Watching apiPath change\n", apiPath.value);

  const path = apiPath.value;
  if (path) {
    useSetApis(path);
    serverStrOverride();
    setEndpoint(serverStr.value, path);
  } else {
    initApis();
  }
});
</script>

<style lang="scss" scoped></style>
