<template>
  <div
    class="row items-center justify-center text-grey no-wrap"
    style="min-height: 200px"
  >
    <q-icon name="error_outline" class="q-mx-sm" size="1.25rem" />
    <p class="q-ma-none">
      <b style="line-break: anywhere">{{ errorMessage }}</b>
    </p>
  </div>
</template>

<script setup>
/**
 * @props errorMessage - string of error message to display
 */
const props = defineProps({
  errorMessage: String,
});
</script>

<style lang="scss" scoped></style>
