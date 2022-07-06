<template>
  <div class="row items-center justify-between no-wrap">
    <div
      style="min-width: 150px"
      class="row justify-end items-center q-col-gutter-sm no-wrap"
    >
      <q-checkbox
        size="2rem"
        :model-value="enabled"
        label="Large File Mode"
        color="beige"
        @click="toggleLargeFileMode(!enabled)"
      />
      <q-icon name="help" color="beige">
        <q-tooltip>
          <p class="q-ma-none" style="max-width: 400px">
            This microservice contains more than one endpoint, and they are
            supposed to be called in a sequence. To test individual endpoint,
            please disable the <b>Large File Mode</b>.
          </p>
        </q-tooltip>
      </q-icon>
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
