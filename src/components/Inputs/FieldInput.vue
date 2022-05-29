<template>
  <div class="row items-center no-wrap">
    <div class="column col-4 col-sm-3 col-lg-2">
      <b>{{ label }}</b>

      <small class="text-grey-6">
        <b>{{ type }}{{ format ? " - " + format : "" }} </b>
      </small>

      <small v-if="_in">(in {{ _in }})</small>
    </div>

    <div class="col-8 col-sm-9 col-lg-10">
      <q-checkbox
        v-if="type == 'boolean'"
        v-model="userInput"
        :label="userInput?.toString() || ''"
      />
      <q-input
        v-else-if="numTypes.includes(type)"
        outlined
        dense
        type="number"
        v-model="userInput"
        @update:model-value="useEmitInput()"
      />
      <ByteInput
        v-else-if="format === 'byte' || label.includes('base64')"
        :base64str="userInput"
        :name="label"
        @update="(newVal) => updateInput(newVal)"
      />

      <ObjectInput
        v-else-if="objectTypes.includes(type)"
        :object="userInput"
        @update="(newVal) => updateInput(newVal)"
      />

      <!-- Fall Back -->
      <q-input
        v-else
        outlined
        dense
        type="text"
        v-model="userInput"
        @update:model-value="useEmitInput()"
      />

      <div class="full-width q-px-sm">
        <small>{{ description }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

import ByteInput from "./ByteInput.vue";
import ObjectInput from "./ObjectInput.vue";

const props = defineProps({
  // Label of the input field
  label: { type: String },
  /**
   * Example will be used as the container for all
   * user inputs.  Data will be taken from example
   * when making the final try it out API call.
   */
  example: { default: "" },
  description: { default: "" },
  required: { type: Boolean, default: false },

  type: { type: String, default: "text" },
  format: { type: String, default: "" },
  // Refer to: https://swagger.io/specification/#parameter-object
  _in: {},
});

const emit = defineEmits(["input"]);

const userInput = ref();

const textTypes = ["string"];

// Todo: console log warning text if the numType is not part of open api specification
const numTypes = ["number", "float", "integer"];

const objectTypes = ["object", "array"];

const init = () => {
  // calculateDataType();
  userInput.value = props.example;
};

const useEmitInput = () => {
  // console.log("emit input\n", userInput.value);

  emit("input", userInput.value);
};

const updateInput = (newInputVal) => {
  userInput.value = newInputVal;
  useEmitInput();
};

onMounted(() => {
  init();
});

watch(
  () => props.example,
  () => {
    if (!props.example) {
      init();
    }
    if (props.example && props.example !== userInput.value) {
      init();
    }
  }
);
</script>

<style lang="scss" scoped></style>
