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
    <div class="row justify-between">
      <ApiPathSelector
        :paths-list="pathsList"
        :server-str="serverStr"
        @selectPath="(selectedPath) => setCurrentApiPath(selectedPath)"
      />
      <MethodSelector />
    </div>
  </div>

  <InlineError :error-message="docErr" v-if="docErr" />

  Current API Path{{ currentApiPath }}
  <!-- <pre
    >{{ doc }}
  </pre> -->
</template>

<script setup>
import { onMounted, watch, ref } from "vue";
import { useRoute } from "vue-router";
import { apiKey, setApiKey } from "src/services/apiKeyService";
import {
  loadDoc,
  doc,
  docErr,
  getPathsList,
  getServerStr,
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

const extractDocDetails = () => {
  /**
   * After doc successfully loaded, extract detail from doc
   *  */
  pathsList.value = getPathsList();
  serverStr.value = getServerStr();
};

const init = () => {
  pathsList.value = null;
  serverStr.value = null;
  currentApiPath.value = null;
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
</script>

<style lang="scss" scoped></style>
