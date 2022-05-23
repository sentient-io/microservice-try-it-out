<template>
  <div class="row items-center no-wrap">
    <div class="column" style="width: clamp(160px, 100%, 200px)">
      <b>{{ label }}</b>

      <small class="text-grey-6">
        <b>{{ type }}{{ format ? " - " + format : "" }} </b>
      </small>

      <small v-if="_in">(in {{ _in }})</small>
    </div>

    <div class="full-width">
      <q-checkbox
        v-if="type == 'boolean'"
        v-model="userInput"
        :label="userInput?.toString() || ''"
      />
      <q-input
        v-else
        outlined
        dense
        :type="type"
        v-model="userInput"
        @update:model-value="useEmitInput()"
      />
    </div>
  </div>
  <div class="row q-mb-md no-wrap">
    <div class="column" style="width: clamp(160px, 100%, 200px)">
      <!-- This is a place holder for the alignment purpose -->
    </div>
    <div class="full-width">
      <small>{{ description }}</small>
    </div>
  </div>
</template>

<script setup>
const { ref, onMounted, watch } = require("vue");

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

// const dataType = ref("text");

const init = () => {
  // calculateDataType();
  userInput.value = props.example;
};

const useEmitInput = () => {
  console.log("emit input\n", userInput.value);

  emit("input", userInput.value);
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
    if (props.example && props.example !== userInput) {
      init();
    }
  }
);
</script>

<style lang="scss" scoped></style>
