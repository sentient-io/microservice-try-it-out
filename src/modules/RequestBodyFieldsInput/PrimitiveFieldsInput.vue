<template>
  <div>
    <!-- <pre>{{ property }}</pre> -->
    <div class="row items-center">
      <span>{{ field }}</span>
      <q-input dense />
    </div>
  </div>
</template>

<script>
/**
 * Takes any permitive request body schema propertie in open
 * API style allow user to modify the example value,and emit
 * out the updated request body schema propertie.
 */

import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    property: { required: true },
    field: { required: true },
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped></style>
