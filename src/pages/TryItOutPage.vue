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
    <ApiKeyField @setApiKey="(apiKey) => setApiKey(apiKey)" />
    <ApiPathSelector
      :paths-list="pathsList"
      :server-str="serverStr"
      @selectPath="(path) => setCurrentApiPath(path)"
    />
    <MethodSelector
      :method-list="currMethodList"
      @selectMethod="(method) => setCurrentApi(method)"
    />
  </div>

  <InlineError :error-message="docErr" v-if="docErr" />

  <pre
    >{{ doc }}
  </pre>
</template>

<script setup>
import { onMounted, watch, ref } from "vue";
import { useRoute } from "vue-router";
import { apiKey, setApiKey } from "src/services/apiKeyService";

// All key functions to extract data from api docs
import {
  loadDoc,
  doc,
  docErr,
  getPathsList,
  getServerStr,
  getApiObjsByPath,
  getMethodListByPath,
} from "src/services/docService";

import DocUrlField from "src/components/DocUrlField.vue";
import BeforeYouStart from "src/components/BeforeYouStart.vue";
import ApiKeyField from "src/components/ApiKeyFiled.vue";
import ApiPathSelector from "src/components/ApiPathSelector.vue";
import MethodSelector from "src/components/MethodSelector.vue";
import InlineError from "src/components/InlineError.vue";

const route = useRoute();

const pathsList = ref();
const serverStr = ref();
const currentApiPath = ref();

// Consider one endpoint may contain multiple methods
const currApiObjs = ref();
const currentApi = ref();

const currMethodList = ref();
const currentMethod = ref();

const useLoadDoc = async () => {
  init();
  const docUrl = decodeURI(route.query.docUrl);
  await loadDoc(docUrl);
  if (doc.value) {
    extractDocDetails();
  }
};

const setCurrentApiPath = (path) => {
  currentApiPath.value = path;
};

const setCurrentApi = (method) => {
  currentMethod.value = method;
  currentApi.value = currApiObjs.value[method];
};

/**
 * After doc successfully loaded, extract detail from doc
 */
const extractDocDetails = () => {
  pathsList.value = getPathsList();
  serverStr.value = getServerStr();
};

/**
 * Init currApiObjs, currMethodList, currentApi
 * and currentMethod.
 */
const initCurrentApis = (path) => {
  currApiObjs.value = getApiObjsByPath(path);
  currMethodList.value = getMethodListByPath(path);
};

const init = () => {
  pathsList.value = null;
  serverStr.value = null;
  currentApiPath.value = null;
  currApiObjs.value = null;
  currentApi.value = null;
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

watch(currentApiPath, () => {
  const path = currentApiPath.value;
  if (path) initCurrentApis(path);
});
</script>

<style lang="scss" scoped></style>
