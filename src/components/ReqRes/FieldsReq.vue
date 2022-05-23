<template>
  <div v-if="method?.toLowerCase() == 'get' && !parameters">
    <h5>Parameters</h5>
    <p>No Parameters</p>
  </div>

  <div v-if="parameters">
    <h5>Parameters</h5>
    <div v-for="(param, idx) in parameters" :key="idx">
      <FieldInput
        :label="param['name']"
        :type="param['schema']['type'] ?? 'text'"
        :description="param['description'] ?? ''"
        :example="genExample(param?.['example'], param['schema']['type'])"
        :_in="param['in']"
        :format="param?.['format'] ?? ''"
        @input="(val) => emitUpdatedParams(param['name'], val)"
      />
    </div>
    <pre>{{ parameters }}</pre>
  </div>

  <div v-if="reqSchema">
    <h5>Request body</h5>
    <div v-for="(property, name, idx) in reqProperties" :key="idx">
      <FieldInput
        :label="name"
        :description="property['description'] ?? ''"
        :example="genExample(property?.['example'], property['type'])"
        :type="property['type'] ?? ''"
        :format="property?.['format'] ?? ''"
        @input="(val) => updatedReqProps(name, val)"
      />
    </div>
    <pre>{{ reqSchema }}</pre>
  </div>
</template>

<script setup>
const { ref, watch, onMounted } = require("vue");

import FieldInput from "src/components/Inputs/FieldInput.vue";
import { requestBody } from "src/services/apiService";

import { deepCopy } from "src/services/utils";

const props = defineProps({
  requestBody: {},
  contentType: {},
  parameters: {},
  method: {},
});

const emit = defineEmits(["updateParameters", "updateRequestBody"]);

const reqSchema = ref();
const reqProperties = ref();

const setReqSchema = () => {
  // console.log("setReqSchema");

  if (props.requestBody) {
    const content = props.requestBody["content"];
    reqSchema.value = content[props.contentType]["schema"];

    reqProperties.value = reqSchema.value["properties"];
  }
};

const emitUpdatedParams = (name, exampleVal) => {
  // Deep copy the existing parameter
  const newParams = deepCopy(props.parameters);

  newParams.forEach((param) => {
    if (param["name"] == name) {
      param["example"] = exampleVal;
    }
  });

  emit("updateParameters", newParams);
};

const updatedReqProps = (name, newVal) => {
  console.log("updatedReqBdy\n", name, newVal);

  // Deep copy request properties, pass in user input value
  const newReqProps = deepCopy(reqProperties.value);
  for (const [k, v] of Object.entries(newReqProps)) {
    if (k == name) {
      v["example"] = newVal;
    }
  }

  assignReqPropsToReqBdy(newReqProps);
};

const assignReqPropsToReqBdy = (newReqProps) => {
  // Assign properties to request body
  const newReqBdy = deepCopy(props.requestBody);
  const content = newReqBdy["content"];
  const schema = content[props.contentType]["schema"];
  schema["properties"] = newReqProps;

  emit("updateRequestBody", newReqBdy);
};

const init = () => {
  // console.log("init FieldReq.vue");
  reqSchema.value = null;
  reqProperties.value = null;
  setReqSchema();
  // setReqProperties();
};

const genExample = (example = null, type = "string") => {
  // Generate an example based on provided example val and type
  if (example !== null && example !== undefined) {
    return example;
  } else {
    return "";
  }
};

onMounted(() => {
  init();
});

watch(
  () => props.contentType,
  () => init()
);

watch(
  () => props.method,
  () => init()
);

watch(
  () => props.requestBody,
  () => setReqSchema()
);
</script>

<style lang="scss" scoped>
h5 {
  margin: 1rem 0px;
}

pre {
  // white-space: pre-line;
}
</style>
