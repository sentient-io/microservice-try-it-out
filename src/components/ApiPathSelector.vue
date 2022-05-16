<template>
  <div>
    <div v-if="pathsList?.[0]" class="row items-center">
      <b class="q-pr-xs">Endpoint:</b>
      {{ serverStr }}
      <q-select
        v-if="pathsList.length > 1"
        outlined
        dense
        options-dense
        class="apiPathSelector q-pl-xs"
        v-model="selectedPath"
        :options="pathsList"
        @update:model-value="emitSelectPath"
      />
      <span v-else>{{ selectedPath }}</span>
    </div>
  </div>
</template>

<script setup>
/**
 *
 * @prop pathsList: list of path for user to select
 * @prop serverStr: prefix of the path, to form an endpoint
 *
 * @emit selectPath: emit the selected path to parent
 */
import { onMounted, watch, ref } from "vue";
const props = defineProps({
  pathsList: { type: Array },
  serverStr: { type: String },
});

const emit = defineEmits(["selectPath"]);

const selectedPath = ref();

const init = () => {
  if (props?.pathsList?.[0]) {
    selectedPath.value = props.pathsList[0];
    emitSelectPath();
  }
};

const emitSelectPath = () => {
  emit("selectPath", selectedPath.value);
};

onMounted(() => init());

watch(
  () => props.pathsList,
  () => init()
);
</script>

<style lang="scss">
// Customied global variables, to make the height of list selector sorter
.apiPathSelector.q-field__control,
.apiPathSelector.q-field--auto-height.q-field--dense .q-field__native,
.apiPathSelector.q-field--auto-height.q-field--dense .q-field__control,
.apiPathSelector.q-field--dense .q-field__marginal {
  height: 26px;
  min-height: 26px;
  line-height: 0px;
}
</style>
