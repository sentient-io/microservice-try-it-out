<template>
  <div>
    <div class="row no-wrap items-stretch">
      <div class="object_preview_area full-width" @click="showEditPopup = true">
        <pre class="q-ma-none">{{ object }}</pre>
      </div>
      <!-- TODOS: Going to add in edit as JSON and edit as Fields feature, as well as take object from url -->
      <!-- <div class="q-px-xs column justify-center q-gutter-md">
        <q-btn
          icon="upload"
          flat
          dense
          color="primary"
          @click="showUploader = true"
        >
          <q-tooltip> Upload Binary File </q-tooltip>
        </q-btn>
      </div> -->
    </div>

    <q-dialog v-model="showEditPopup" persistent>
      <q-card class="q-pa-md" style="width: clamp(280px, 100%, 450px)">
        <div v-if="objectType == 'array'">
          <h6 class="q-ma-none">Edit Array</h6>
          <ArrayEditor
            :array="object"
            @cancel="showEditPopup = false"
            @update="
              (newArrObj) => {
                showEditPopup = false;
                emitUpdate(newArrObj);
              }
            "
          />
        </div>
        <div v-else>
          <h6 class="q-ma-none">Edit Object</h6>
          <ObjectEditor
            :object="object"
            @cancel="showEditPopup = false"
            @update="
              (newJsonObj) => {
                showEditPopup = false;
                emitUpdate(newJsonObj);
              }
            "
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

import ObjectEditor from "./ObjectEditor.vue";
import ArrayEditor from "./ArrayEditor.vue";

const props = defineProps({
  object: {},
  objectType: {},
});
const emit = defineEmits(["update"]);

const showEditPopup = ref();
const objectType = ref();

const emitUpdate = (newJsonObj) => {
  emit("update", newJsonObj);
};

const checkObjectType = () => {
  if (props.objectType) {
    objectType.value = props.objectType;
  } else if (Array.isArray(props.object)) {
    objectType.value = "array";
  } else {
    objectType.value = "object";
  }
};

const init = () => {
  checkObjectType();
};

onMounted(() => init());

watch(
  () => props.object,
  () => init()
);
</script>

<style lang="scss" scoped>
.object_preview_area {
  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 4px;
  max-height: 140px;
  padding: 0.7rem;
  overflow-y: scroll;
  cursor: pointer;
}
.object_preview_area:hover {
  border-color: $primary;
  border-width: 2px;
  box-shadow: 0px;
}
.object_preview_area pre {
  white-space: pre-wrap;
  line-break: anywhere;
  font-size: 0.8rem;
  border: 1px solid rgba(0, 0, 0, 0);
}
.object_preview_area:hover pre {
  border-width: 0px;
}
</style>
