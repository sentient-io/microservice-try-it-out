<template>
  <div
    v-if="versionHistObj"
    class="row justify-center q-gutter-md text-grey-5 q-my-xs"
  >
    <small> Version {{ versionHistObj.version }} </small>
    <small> Last Updated On {{ versionHistObj.lastUpdate }}</small>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const versionHistObj = ref({});
const version = "1.0.4 Beta";
const lastUpdate = "12 Jul 2022";

const setVersionHistObj = (version, lastUpdate) => {
  versionHistObj.value["version"] = version;
  versionHistObj.value["lastUpdate"] = lastUpdate;
};

const init = () => {
  setVersionHistObj(version, lastUpdate);
};

onMounted(() => {
  init();
});
</script>

<style lang="scss" scoped></style>
