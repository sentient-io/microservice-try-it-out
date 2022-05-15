<template>
  <q-form @submit="pushDocUrlToRoute">
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
        type="submit"
        style="min-width: 180px"
      />
    </div>
  </q-form>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
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

const getDocUrlFromRoute = () => {
  if (route.query.docUrl) {
    docUrl.value = decodeURI(route.query.docUrl);
  }
};

onMounted(() => getDocUrlFromRoute());

watch(
  () => route.query.docUrl,
  () => getDocUrlFromRoute()
);
</script>

<style lang="scss" scoped></style>
