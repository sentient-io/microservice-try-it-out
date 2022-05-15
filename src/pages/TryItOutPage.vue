<template>
  <h5 style="margin: 0; font-size: 20px; font-weight: 700">Try It Out</h5>
  <p style="max-width: 800px">
    You can test the input / output of Sentient.io API with the tool we provided
    below. Simply input your subscribed API key, and you’ll be able to test the
    input with the fields and check the output below.
  </p>

  <BeforeYouStart />
  <DocUrlField />
  <ApiKeyField @setApiKey="(apiKey) => setApiKey(apiKey)" />
  API Key: {{ apiKey }}
  {{ doc }}
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { loadDoc, doc } from "src/services/docService";
import { apiKey, setApiKey } from "src/services/apiKeyService";

import DocUrlField from "src/components/DocUrlField.vue";
import BeforeYouStart from "src/components/BeforeYouStart.vue";
import ApiKeyField from "src/components/ApiKeyFiled.vue";

const route = useRoute();

const useLoadDoc = () => {
  const docUrl = decodeURI(route.query.docUrl);
  loadDoc(docUrl);
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
