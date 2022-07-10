<template>
  <div class="row items-center justify-between">
    <div class="row items-center">
      <b>Testing Doc Urls</b>
      <q-select
        outlined
        dense
        options-dense
        class="apiPathSelector q-pl-xs"
        v-model="currDocUrl"
        :options="defaultDocUrls"
        @update:model-value="emitSelectDocUrl"
      />

      <doc-obj-viewer />
    </div>

    <div class="row q-gutter-md">
      <a
        href="https://docs.google.com/spreadsheets/d/1WK3USTdQ3SseZNgiVoNuW7ZBYyUY2W-ALB_YThk24O4/edit?usp=sharing"
        target="_blank"
        >Doc Configs</a
      >

      <a
        href="https://docs.google.com/spreadsheets/d/161ZTY_vnndHTEhFOMWOhK61kA45KcPqEfXFpbtcrl1w/edit?usp=sharing"
        target="_blank"
        >Testing Doc Source</a
      >

      <a :href="`https://editor.swagger.io/?url=${docUrl}`" target="_blank"
        >Open In Swagger Editor</a
      >
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

import { useRoute } from "vue-router";

import { api } from "boot/axios";

import DocObjViewer from "./DocsObjViewer.vue";

const route = useRoute();

const docUrl = computed(() => {
  return route.query?.docUrl || route.query?.docPath || "";
});

const docListSrc =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRQ8xbzHxNCmVlidFQ6O8CH6Twk5iHkBkK7uP5dV04VoZ7LQyz0nfxftDAw-oQrHPUxGD5NtqpyhpYo/pub?gid=0&single=true&output=csv";

const emit = defineEmits(["selectDocUrl"]);

const defaultDocUrls = ref([]);
const currDocUrl = ref({});

const emitSelectDocUrl = () => {
  // console.log("selectDocUrl", currDocUrl.value.value);
  emit("selectDocUrl", currDocUrl.value.value);
};

const setDefault = () => {
  // Set the default yaml to use
  currDocUrl.value = defaultDocUrls.value[8];
  api.get(docListSrc).then((res) => {
    res.data.split(/\n/).forEach((elem) => {
      const urlObj = {};
      urlObj.label = elem.split(",")[0];
      urlObj.value = elem.split(",")[1].replace(/\s/g, "");
      defaultDocUrls.value.push(urlObj);
    });
  });
};

onMounted(() => {
  setDefault();
});
</script>

<style lang="scss" scoped></style>
