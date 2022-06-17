<template>
  <div class="row items-center justify-between no-wrap q-gutter-row-md q-py-sm">
    <div
      class="bg-grey-2 q-pa-sm full-width"
      style="
        border-left: 6px solid;
        border-right: 6px solid;
        border-color: rgba(128, 128, 128, 0.5);
        border-radius: 6px;
      "
    >
      <p class="q-ma-none" style="font-size: 0.8rem">
        This microservice contains more than one endpoint, and they are supposed
        to be called in a sequence. To test individual endpoint, please disable
        the <b>Large File Mode</b>.
      </p>
    </div>
    <div style="min-width: 150px" class="row justify-end">
      <q-checkbox
        size="2rem"
        :model-value="enabled"
        label="Large File Mode"
        color="beige"
        @click="toggleLargeFileMode(!enabled)"
      />
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["toggle"]);
const props = defineProps({
  enabled: {},
});

const toggleLargeFileMode = (mode) => {
  emit("toggle", mode);
};
</script>

<style scoped></style>
