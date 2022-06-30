<template>
  <div
    class="q-pa-sm q-mt-md bg-grey-2"
    style="border-radius: 8px"
    v-if="debugMode"
  >
    <b class="q-mx-sm text-beige-7">API Response Report</b>
    <PrettyObjViewer :object="apiReport" />
  </div>
</template>

<script setup>
import { debugMode } from "src/services/appService";
import { apiReport } from "src/services/apiCallService";
import PrettyObjViewer from "src/components/Viewers/PrettyObjViewer.vue";
</script>

<style lang="scss" scoped></style>
