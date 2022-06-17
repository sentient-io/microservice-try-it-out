<template>
  <div class="column">
    <b>{{ label }}</b>

    <small class="text-orange-6" v-if="required">
      <i>* Required</i>
    </small>

    <small class="text-grey-6">
      <b>{{ type }}{{ format ? " - " + format : "" }} </b>
    </small>

    <small v-if="_in">(in {{ _in }})</small>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {},
  required: { default: false },
  type: {},
  format: {},
  _in: {},
});
</script>

<style lang="scss" scoped>
b {
  white-space: pre-wrap;
  line-break: anywhere;
}
</style>
