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
          <!-- !!CRITICAL!! -->
          <!-- This is for the elastic search "filterdata" fileds -->
          <FieldInput
            v-if="param['name'] == 'filterdata'"
            type="string-object"
            :label="param['name']"
            :description="param['description'] ?? ''"
            :example="getExample(param?.['example'], param['schema']['type'])"
            :_in="param['in']"
            :format="param?.['format'] ?? ''"
            :required="param?.['required'] ?? false"
            @input="
              (paramExam) =>
                emitUpdateParams(param['name'], JSON.stringify(paramExam))
            "
          />
          <!-- For all the other param fields -->
          <FieldInput
            v-else
            :label="param['name']"
            :type="param['schema']['type'] ?? 'text'"
            :description="param['description'] ?? ''"
            :example="
              getExample(
                param?.['example'],
                param['schema']['type'],
                param['name']
              )
            "
            :_in="param['in']"
            :format="param?.['format'] ?? ''"
            :required="param?.['required'] ?? false"
            @input="(paramExam) => emitUpdateParams(param['name'], paramExam)"
          />
        </div>
      </div>

      <!-- <div class="col-6">
        <pre>{{ parameters }}</pre>
      </div> -->
    </div>
  </div>

  <div v-if="reqSchema">
    <div class="row items-center justify-between">
      <h5>Request body</h5>
      <div v-if="contentType">
        Content Type: <b>{{ contentType }}</b>
      </div>
    </div>
    <div class="row no-wrap">
      <div class="full-width">
        <slot name="request-body-file-uploader"></slot>
        <div v-for="(property, name, idx) in reqProperties" :key="idx + name">
          <FieldInput
            :label="name"
            :description="property['description'] ?? ''"
            :example="getExample(property?.['example'], property['type'], name)"
            :type="property['type'] ?? ''"
            :format="property?.['format'] ?? ''"
            :required="reqRequired?.includes(name)"
            @input="(bdyExam) => emitUpdatedReqBdy(name, bdyExam)"
          />
        </div>
      </div>

      <!-- <div class="col-6">
        <pre>{{ reqSchema }}</pre>
      </div> -->
    </div>
  </div>
</template>

<script setup>
/**
 * @author                                                        zq
 * @lastUpdate                                           2022-Jun-16
 * -----------------------------------------------------------------
 * Field requests for both requests and parameters
 * -----------------------------------------------------------------
 * @dependency FieldInput.vue -Individual input field,takes multiple
 *             input content type.
 * -----------------------------------------------------------------
 * @slot request-body-file-uploader - For now, this only used in the
 *       large file microservices .  This will display an additional
 *       file uploader. Return the file name and file size.
 * -----------------------------------------------------------------
 * @props requestBody - the whole requestBody object, reqSchema will
 *        then be extracted from the requestBody. reqProperties will
 *        be used as the input element for the FieldInput component.
 * @props contentType - display of the request body content type
 * @props parameters - data required for get request,can be place as
 *        query string, path of headers.
 * @props method - RESTful api method.
 * -----------------------------------------------------------------
 * @emit updateParameters - emit the updated parameter to the parent
 * @emit updateRequestBody -in react to user input action.Update the
 *       user input value to parent component.
 */

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
const reqRequired = ref();

const setReqSchema = () => {
  // console.log("setReqSchema");

  if (props.requestBody?.["content"]) {
    const content = props.requestBody["content"];
    reqSchema.value = content[props.contentType]["schema"];

    reqProperties.value = reqSchema.value["properties"];
    setReqRequired();
  }
};

const setReqRequired = () => {
  reqRequired.value = null;
  if (reqSchema.value?.["required"]) {
    reqRequired.value = reqSchema.value["required"];
  }
};

const emitUpdateParams = (paramName, paramExam) => {
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

const getExample = (example = null, type = "string", _key = "") => {
  /**
   * Incase the example is not supported in the documentation
   * Generate examples based on provided example val and type
   */

  if (example !== null && example !== undefined) {
    return example;
  } else {
    console.warn(
      `Field ${_key} doesn't has an example field, please check the documentation.`
    );
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
  () => {
    // console.log("Watching props.requestBody change");
    setReqSchema();
  }
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
