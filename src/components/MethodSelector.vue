<template>
  <div>
    <div v-if="methodList?.[0]" class="row items-center">
      <b class="q-pr-xs">Method:</b>
      <q-select
        v-if="methodList.length > 1"
        outlined
        dense
        options-dense
        class="apiMethodSelector"
        v-model="selectedMethod"
        :options="methodList"
        @update:model-value="emitSelectMethod"
      />
      <span v-else>{{ selectedMethod }}</span>
    </div>
  </div>
</template>

<script setup>
/**
 * This component works very similarly with the ApiPathSelector.vue
 * component.
 *
 * TODO: To find a time to merge these 2 component together
 */
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  methodList: { type: Array },
});

const emit = defineEmits(["selectMethod"]);

const selectedMethod = ref();

const init = () => {
  if (props?.methodList?.[0]) {
    selectedMethod.value = props.methodList[0];
    emitSelectMethod();
  }
};

const emitSelectMethod = () => {
  emit("selectMethod", selectedMethod.value);
};

onMounted(() => init());

watch(
  () => props.methodList,
  () => init()
);
</script>

<style lang="scss">
// Customied global variables, to make the height of list selector sorter
.apiMethodSelector.q-field__control,
.apiMethodSelector.q-field--auto-height.q-field--dense .q-field__native,
.apiMethodSelector.q-field--auto-height.q-field--dense .q-field__control,
.apiMethodSelector.q-field--dense .q-field__marginal {
  height: 26px;
  min-height: 26px;
  line-height: 0px;
}
</style>
