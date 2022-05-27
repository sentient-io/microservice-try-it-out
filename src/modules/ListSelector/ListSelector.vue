<template>
  <div>
    <div v-if="options?.[0]" class="row items-center">
      <b class="q-pr-xs">{{ label }}:</b>
      <q-select
        v-if="options.length > 1"
        outlined
        dense
        options-dense
        class="listSelector"
        v-model="selected"
        :options="options"
        @update:model-value="emitSelect"
      />
      <span v-else>{{ selected }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

/**
 * This component takes an list of things, and emit
 * the user selected element out.
 * If there is only one element in the list, it will
 * display text only, no options will be provided.
 *
 */
const props = defineProps({
  label: {},
  options: { type: Array },
  defaultValue: {},
});

const emit = defineEmits(["select"]);

const selected = ref();

const init = () => {
  const options = props.options;
  const defaultVal = props.defaultValue;
  if (!options) {
    selected.value = "";
    return;
  }

  if (!defaultVal) {
    selected.value = options[0];
  }

  if (defaultVal && options.includes(defaultVal)) {
    selected.value = defaultVal;
  } else {
    throw new Error("Default Value is not part of options");
  }
};

const emitSelect = () => {
  emit("select", selected.value);
};

onMounted(() => {
  //   console.log("ListSelector.vue mounted");
  init();
});

watch(
  () => props.options,
  () => {
    if (props.options) {
      init();
    }
  }
);
</script>

<style lang="scss">
// Customied global variables, to make the height of list selector sorter
.listSelector.q-field__control,
.listSelector.q-field--auto-height.q-field--dense .q-field__native,
.listSelector.q-field--auto-height.q-field--dense .q-field__control,
.listSelector.q-field--dense .q-field__marginal {
  height: 26px;
  min-height: 26px;
  line-height: 0px;
}
</style>
