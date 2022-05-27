<template>
  <div v-if="method?.toLowerCase() == 'get' && !parameters">
    <h5>Parameters</h5>
    <p>No Parameters</p>
  </div>

  <div v-if="parameters">
    <h5>Parameters</h5>
    <div class="row no-wrap">
      <div class="full-width">
        <div v-for="(param, idx) in parameters" :key="idx">
          <FieldInput
            :label="param['name']"
            :type="param['schema']['type'] ?? 'text'"
            :description="param['description'] ?? ''"
            :example="genExample(param?.['example'], param['schema']['type'])"
            :_in="param['in']"
            :format="param?.['format'] ?? ''"
            @input="(paramExam) => emitUpdatedParams(param['name'], paramExam)"
          />
        </div>
      </div>

      <div class="col-6">
        <pre
          >{{ parameters }}
      </pre
        >
      </div>
    </div>
  </div>

  <div v-if="reqSchema">
    <h5>Request body</h5>
    <div class="row no-wrap">
      <div class="full-width">
        <div v-for="(property, name, idx) in reqProperties" :key="idx">
          <FieldInput
            :label="name"
            :description="property['description'] ?? ''"
            :example="genExample(property?.['example'], property['type'])"
            :type="property['type'] ?? ''"
            :format="property?.['format'] ?? ''"
            @input="(bdyExam) => emitUpdatedReqBdy(name, bdyExam)"
          />
        </div>
      </div>

      <!-- <div class="col-6"> -->
      <!-- <pre>{{ reqSchema }}</pre> -->
      <!-- </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

import FieldInput from "src/components/Inputs/FieldInput.vue";

// import { deepCopy } from "src/services/utils";

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

  if (props.requestBody?.["content"]) {
    const content = props.requestBody["content"];
    reqSchema.value = content[props.contentType]["schema"];

    reqProperties.value = reqSchema.value["properties"];
  }
};

const emitUpdatedParams = (paramName, paramExam) => {
  // Deep copy the existing parameter
  // const newParams = deepCopy(props.parameters);

  // newParams.forEach((param) => {
  //   if (param["name"] == name) {
  //     param["example"] = exampleVal;
  //   }
  // });

  emit("updateParameters", paramName, paramExam);
};

const emitUpdatedReqBdy = (bdyName, bdyExam) => {
  // console.log("updatedReqBdy\n", bdyName, bdyExam);

  emit("updateRequestBody", bdyName, bdyExam);
};

const init = () => {
  // console.log("init FieldReq.vue");
  // console.log(props.requestBody);

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
  white-space: pre-wrap;
  line-break: anywhere;
}
</style>
