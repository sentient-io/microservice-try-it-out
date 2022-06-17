<template>
  <div class="row no-wrap items-stretch">
    <div class="object_preview_area full-width" :style="displayStyle">
      <pre class="q-ma-none">{{ object }}</pre>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  object: {},
  displayStyle: {},
});
</script>

<style lang="scss" scoped>
.object_preview_area {
  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 4px;
  max-height: 50vh;
  padding: 0.7rem;
  overflow-y: auto;
}

.object_preview_area pre {
  white-space: pre-wrap;
  max-width: 1200px;
  line-break: anywhere;
  font-size: 0.8rem;
  border: 1px solid rgba(0, 0, 0, 0);
}
</style>
