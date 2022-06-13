<template>
  <div>
    <div class="row no-wrap items-stretch">
      <div
        class="object_preview_area full-width"
        :style="displayStyle"
        @click="showEditPopup = true"
      >
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
          <h6 class="q-ma-none">Edit JSON</h6>
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
/**
 * @author                                                        zq
 * @lastUpdate                                           2022-Jun-12
 * -----------------------------------------------------------------
 * ObjectInput.vue
 * This conponent creates a preview of a formatted json object. User
 * can click the display area and launch a popup widnow - - the JSON
 * Editor.
 *
 * Inside the JSON Editor user can input raw strings, and format, or
 * indent the string as JSON, as long as the provided string follows
 * JSON syntax.
 * -----------------------------------------------------------------
 * @dependency ObjectEditor.vue - Providing UI and Editing functions
 * of the JSON data.  Will also validate if user's input follows the
 * JSON styntax.
 *
 * @dependency ArrayEditor.vue -  Providing UI and editing functions
 * for an array of data. For now,it only takes an array of SAME data
 * type. Multiple data type in single array is NOT SUPPORTED.
 * -----------------------------------------------------------------
 * @props object - The JSON object to display.Must be valid JSON Obj
 *
 * @props objectType - Optional 'object' or'array', it will identify
 * if an array is provided and launch the Array Editor.
 *
 * @props displayStyle -Provide some basic style override from props
 * -----------------------------------------------------------------
 * @slot No slot
 * -----------------------------------------------------------------
 * @emit update - Pass the updated value from ObjectEditor and Array
 * editor to the partent element.
 */
import { onMounted, ref, watch } from "vue";

import ObjectEditor from "./ObjectEditor.vue";
import ArrayEditor from "./ArrayEditor.vue";

const props = defineProps({
  object: {},
  objectType: {},
  displayStyle: {},
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
  overflow-y: auto;
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
