<template>
  <div>
    <div class="row q-my-sm items-center">
      <small class="q-mr-xs">Data Type: </small>
      <q-btn-dropdown
        outline
        dense
        no-caps
        auto-close
        class="q-px-xs"
        color="grey-7"
        size="sm"
        :label="dataType"
      >
        <div class="column q-gutter-sm q-pa-sm">
          <q-btn
            v-for="type in dataTypeList"
            :key="type"
            :label="type"
            dense
            outline
            no-caps
            size="sm"
            color="grey-7"
            @click="setDataType(type)"
          />
        </div>
      </q-btn-dropdown>
    </div>

    <!-- 
      arrayEditorKey is required to re-draw the array edit unit, while 
      deleting items in the arrayObj, the index will not change,  this
      will cause the list displaying wrong element. 
      re-draw the div will simply re-generate the items.
      -->
    <div
      v-if="arrayObj"
      style="overflow-y: auto; max-height: 50vh"
      :key="arrayEditorKey"
    >
      <div class="q-mb-sm" v-for="(obj, index) in arrayObj" :key="index">
        <ArrayEditUnit
          :array-item="arrayObj[index]"
          :index="index"
          :data-type="dataType"
          @update="(newVal) => updateArrByIndex(newVal, index)"
          @removeItem="removeItemByIndex(index - 1)"
        />
      </div>
    </div>

    <div class="row q-mb-md q-gutter-sm justify-center">
      <q-btn
        outline
        dense
        no-caps
        size="sm"
        label="Insert Array Item"
        class="q-px-xs"
        color="green-7"
        icon="playlist_add"
        @click="insertArrItem"
      />
    </div>

    <div class="row justify-around">
      <q-btn label="Cancel" flat no-caps @click="emitCancel" />
      <q-btn
        flat
        no-caps
        label="Save"
        color="white"
        class="bg-primary"
        @click="emitUpdate"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { isBase64 } from "src/services/utils";

import ArrayEditUnit from "./ArrayEditUnit.vue";

const props = defineProps({
  array: {},
});
const emit = defineEmits(["cancel", "update"]);

const arrayObj = ref([]);
const dataType = ref();
const arrayEditorKey = ref(0);
const dataTypeList = [
  "base64",
  "number",
  "string",
  "boolean",
  "object",
  "array",
  "any",
];

const emitCancel = () => {
  emit("cancel");
};

const emitUpdate = () => {
  // console.log("ArrayEditor emitUpdate\n", arrayObj.value);
  emit("update", arrayObj.value);
};

const insertArrItem = () => {
  // console.log("insertArrItem");
  switch (dataType.value) {
    case "object":
      arrayObj.value.push({});
      break;
    case "boolean":
      arrayObj.value.push(false);
      break;
    case "array":
      arrayObj.value.push([]);
      break;
    case "number":
      arrayObj.value.push(0);
      break;
    default:
      arrayObj.value.push("");
  }
};

const checkArrayDataType = () => {
  const arrItem = arrayObj.value[0];
  if (typeof arrItem == "string") {
    if (isBase64(arrItem)) {
      dataType.value = "base64";
      return;
    } else {
      dataType.value = "string";
    }
    return;
  } else if (Array.isArray(arrItem)) {
    dataType.value = "array";
  } else {
    dataType.value = typeof arrItem;
  }
};

const updateArrByIndex = (newVal, index) => {
  // console.log("updateArrByIndex\n", typeof newVal, index);
  arrayObj.value[index] = newVal;
};

const removeItemByIndex = (index) => {
  // console.log("temoveItemByIndex\n", index);
  arrayObj.value.splice(index, 1);
  arrayEditorKey.value++; // Trigger area re-draw
};

const setDataType = (type) => {
  dataType.value = type;
};

const init = () => {
  /**
   * Make a deep copy here so the arrayObj is not reactive
   * Only save the updated value when user  click save btn
   */
  console.log("ArrayEditor init", props.array);
  const invalidArrs = [null, undefined, ""];
  if (!invalidArrs.includes(props.array)) {
    arrayObj.value = JSON.parse(JSON.stringify(props.array));
    checkArrayDataType();
  } else {
    arrayObj.value = [];
  }
};

onMounted(() => init());

watch(
  () => props.array,
  () => init()
);
</script>

<style lang="scss" scoped></style>
