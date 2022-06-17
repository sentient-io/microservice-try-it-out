<template>
  <div>
    <div v-if="apiPaths?.[0]" class="row items-center">
      <b class="q-pr-xs">Endpoint:</b>
      {{ serverStr }}
      <q-select
        v-if="apiPaths.length > 1"
        outlined
        dense
        options-dense
        class="apiPathSelector q-pl-xs"
        v-model="userSelectedPath"
        :options="apiPaths"
        @update:model-value="emitUserSelectPath"
      />
      <span v-else>{{ userSelectedPath }}</span>
    </div>
    <div v-if="serverStrDescription" class="q-mt-xs">
      <b class="q-pr-xs" style="visibility: hidden">Endpoint:</b>
      <small class="text-grey-6"
        >(<b>URL Description:</b> {{ serverStrDescription }})
      </small>
    </div>
  </div>
</template>

<script setup>
/**
 *
 * @prop apiPaths: list of path for user to select
 * @prop serverStr: prefix of the path, to form an endpoint
 *
 * @emit selectPath: emit the selected path to parent
 */
import { onMounted, watch, ref } from "vue";
const props = defineProps({
  apiPaths: { type: Array },
  serverStr: { type: String },
  selectedPath: {},
  serverStrDescription: { type: String },
});

const emit = defineEmits(["selectPath"]);

const userSelectedPath = ref();

const init = () => {
  if (props.selectedPath) {
    userSelectedPath.value = props.selectedPath;
  } else if (props?.apiPaths?.[0]) {
    userSelectedPath.value = props.apiPaths[0];
  }
};

const emitUserSelectPath = () => {
  emit("selectPath", userSelectedPath.value);
};

onMounted(() => init());

watch(
  () => props.apiPaths,
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
