<template>
  <div class="q-px-md bg-white">
    <!-- <q-btn label="View Documentation" no-caps dense />

    <q-dialog v-model="showDocObj">
      <PrettyObjViewer />
    </q-dialog> -->
  </div>
</template>

<script setup>
import { ref } from "vue";

import PrettyObjViewer from "src/components/Viewers/PrettyObjViewer.vue";

const showDocObj = ref(false);
</script>

<style lang="scss" scoped></style>
