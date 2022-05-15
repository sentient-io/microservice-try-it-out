<template>
  <div class="row full-width no-wrap items-center q-gutter-sm">
    <q-input
      outlined
      dense
      v-model="docUrl"
      label="Documentation Url"
      class="full-width"
    />
    <q-btn
      no-caps
      color="primary"
      label="Import Documentation"
      @click="pushDocUrlToRoute"
      style="min-width: 180px"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const docUrl = ref();

const router = useRouter();
const route = useRoute();

const pushDocUrlToRoute = () => {
  router.push({
    query: {
      docUrl: encodeURI(docUrl.value),
    },
  });
};

onMounted(() => {
  if (route.query.docUrl) {
    docUrl.value = decodeURI(route.query.docUrl);
  }
});
</script>

<style lang="scss" scoped></style>
