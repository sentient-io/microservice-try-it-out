<template>
  <div>
    <div v-if="dataType == 'base64'">
      <!-- Handle base64 input -->
      <ByteInput
        :base64str="item"
        :label="label"
        @update="(newBase64Str) => handleUpdate(newBase64Str)"
      >
        <template #operations>
          <q-btn
            flat
            dense
            color="red"
            icon="delete_forever"
            @click="emitRemoveItem"
          />
        </template>
      </ByteInput>
    </div>

    <!-- Handle all other type of value input -->
    <div v-else class="row justify-between no-wrap">
      <!-- Handle array and object input -->
      <div v-if="['array', 'object'].includes(dataType)" class="full-width">
        <ObjectInput
          :object-type="dataType"
          :object="item"
          @update="(newVal) => handleUpdate(newVal)"
        />
      </div>

      <!-- Handle any input -->
      <div v-else-if="['any', 'unknown'].includes(dataType)" class="full-width">
        <pre
          ref="anyTypeEditArea"
          contenteditable="true"
          class="any_type_edit_area"
          @input="handleAnyTypeUpdate()"
          >{{ item }}</pre
        >
      </div>

      <!-- Handle bollean input -->
      <q-checkbox
        v-else-if="dataType == 'boolean'"
        v-model="item"
        :label="item?.toString() || ''"
        @update:model-value="(newVal) => handleUpdate(newVal)"
      />

      <!-- Hanlde number input -->
      <q-input
        v-else-if="dataType == 'number'"
        outlined
        dense
        type="number"
        v-model="item"
        class="full-width"
        @update:model-value="(newVal) => handleUpdate(newVal)"
      />
      <!-- Handle string -->
      <q-input
        v-else
        outlined
        dense
        type="text"
        v-model="item"
        class="full-width"
        @update:model-value="(newVal) => handleUpdate(newVal)"
      />

      <q-btn
        icon="delete_forever"
        flat
        dense
        color="red"
        @click="emitRemoveItem"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

import ByteInput from "./ByteInput.vue";
import ObjectInput from "./ObjectInput.vue";

const props = defineProps({
  arrayItem: {},
  dataType: {},
  index: {},
  label: {},
});
const emit = defineEmits(["update", "removeItem"]);

const item = ref();
const anyTypeEditArea = ref();

const forceValueCorrection = (originalVal, type) => {
  let correctedVal;
  switch (type) {
    case "number":
      correctedVal = +originalVal;
      break;
    case "boolean":
      if (+originalVal <= 0 || originalVal == "false") {
        correctedVal = false;
      } else {
        correctedVal = Boolean(originalVal);
      }
      break;
    case "string":
      correctedVal = String(originalVal);
      break;
    default:
      correctedVal = originalVal;
  }

  if (type == "object") {
    // console.log("forceValueCorrection", originalVal);
    try {
      correctedVal = JSON.parse(originalVal);
    } catch (err) {
      correctedVal = originalVal;
    }
  }

  return correctedVal;
};

const emitUpdate = () => {
  // console.log("ArrayEditUnit emitUpdate\n", typeof item.value, props.dataType);
  let valueToEmit = forceValueCorrection(item.value, props.dataType);
  // console.log(typeof valueToEmit, valueToEmit);
  emit("update", valueToEmit);
};

const emitRemoveItem = () => {
  emit("removeItem");
};

const handleUpdate = (newVal) => {
  item.value = newVal;
  emitUpdate();
};

const handleAnyTypeUpdate = () => {
  // console.log("handleNyTypeUpdate");
  const newVal = anyTypeEditArea.value.innerText;
  item.value = newVal;
  emitUpdate();
};

const init = () => {
  if (props.arrayItem !== null && props.arrayItem !== undefined) {
    item.value = props.arrayItem;
  }
};

watch(
  () => props.arrayItem,
  () => init()
);

/**
 * !! Critical !!
 * Watch props change and emit an event is not always a good idea
 * But for this case we need this feature to  immediately  update
 * data type when user change the props.dataType.
 */
watch(
  () => props.dataType,
  () => emitUpdate()
);

onMounted(() => init());
</script>

<style lang="scss" scoped>
.any_type_edit_area {
  overflow-y: auto;

  white-space: pre-wrap;
  line-break: anywhere;

  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 4px;

  max-width: 100%;
  width: clac(300px, 100%, 600px);
  padding: 0.7rem;

  font-size: 0.8rem;
  cursor: pointer;
}
</style>
