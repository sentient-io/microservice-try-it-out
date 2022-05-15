<template>
  <DocUrlField />
  <div>Try It Out Page</div>
  {{ doc }}
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { loadDoc, doc } from "src/services/docService";

import DocUrlField from "src/components/DocUrlField.vue";

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
