<template>
  <div class="row items-center justify-between">
    <div class="row items-center">
      <b>Default Doc Urls</b>
      <q-select
        outlined
        dense
        options-dense
        class="apiPathSelector q-pl-xs"
        v-model="currDocUrl"
        :options="defaultDocUrls"
        @update:model-value="emitSelectDocUrl"
      />
    </div>

    <a href="https://swagger.io/specification/" target="_blank"
      >Swagger Specification</a
    >
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const emit = defineEmits(["selectDocUrl"]);

const defaultDocUrls = [
  // next : 0, this is the array index number, easier to select default ms
  {
    label: "Swagger Pet Store",
    value: "https://petstore3.swagger.io/api/v3/openapi.json",
  },
  {
    label: "Rule Engine - Test JSON input",
    value:
      "https://raw.githubusercontent.com/zqTheDesigner/airtoools/dev/ruleengine-old.yaml",
  },
  {
    label: "Text To Speech",
    value:
      "https://raw.githubusercontent.com/sentient-io/microservice-docs/master/voice/text-to-speech_eng.yaml",
  },
  // next : 3
  {
    label: "Recommendation Engine - Multiple Endpoints",
    value:
      "https://raw.githubusercontent.com/sentient-io/microservice-docs/dev/analytics/recommendation_engine.yaml",
  },
  {
    label: "HDB Demo graphics (Get Method)",
    value:
      "https://raw.githubusercontent.com/sentient-io/microservice-docs/master/data/demographics_hdb_sg.yaml",
  },
  {
    label: "ASR Eng",
    value:
      "https://raw.githubusercontent.com/sentient-io/microservice-docs/master/voice/automatic_speech_recognition_eng.yaml",
  },
  // next : 6
  {
    label: "Few Shots Object Detection",
    value:
      "https://raw.githubusercontent.com/sentient-io/microservice-docs/dev/computer_vision/few_shots_object_detection.yaml",
  },
  {
    label: "CSV-JSON convertor",
    value:
      "https://raw.githubusercontent.com/sentient-io/microservice-docs/master/utility/csv-json_convertor.yaml",
  },
];
const currDocUrl = ref({});

const emitSelectDocUrl = () => {
  emit("selectDocUrl", currDocUrl.value.value);
};

const setDefault = () => {
  currDocUrl.value = defaultDocUrls[2];
};

onMounted(() => {
  setDefault();
  emitSelectDocUrl();
});
</script>

<style lang="scss" scoped></style>
