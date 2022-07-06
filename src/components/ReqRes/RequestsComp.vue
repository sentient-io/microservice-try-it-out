<template>
  <div>
    <div>
      <div class="row items-center justify-between">
        <div>
          <b>Input With Fields</b>
          <q-toggle
            size="2rem"
            color="green-7"
            class="state-toggle"
            v-model="isJsonInput"
            @click="handleInputMthdSwitch()"
          />
          <b>Input With Raw Data</b>
        </div>

        <div>
          <q-btn
            dense
            no-caps
            outline
            size="0.7rem"
            color="brown-4"
            class="q-px-sm"
            icon="restart_alt"
            label="Reset All Inputs"
            @click="handleResetInput()"
          />
        </div>
      </div>

      <div
        class="row justify-between q-mt-xs q-gutter-sm"
        v-if="showEndpointAndMethod"
      >
        <div><b>Endpoint:</b> {{ endpoint }}</div>
        <div><b>Method:</b> {{ method }}</div>
      </div>

      <slot name="requests-helper">
        <!-- 
          Insert an element between requests detail and 
          requests fields, suggested use -file uploader
          json file uploader, url input etc.
          -->
      </slot>

      <div v-if="isJsonInput" style="max-width: 85vw:">
        <RawReq
          :req-bdy-examples="reqBdyExamples"
          :query-params="queryParamObj"
          :method="method"
          :query-string="queryStr"
          :content-type="contentType"
          @update-request-body="
            (rawReqBdyObj) => useSetReqBdyEgObj(rawReqBdyObj)
          "
          @update-query-params="
            (newQueryParam) => {
              useSetQueryParamObj(newQueryParam);
            }
          "
        />
      </div>

      <FieldsReq
        v-else
        :request-body="requestBody"
        :content-type="contentType"
        :parameters="parameters"
        :method="method"
        @update-parameters="(k, v) => useSetParamExample(k, v)"
        @update-request-body="(k, v) => useSetReqBdyExample(k, v)"
      >
      </FieldsReq>
    </div>

    <div class="row justify-center q-py-sm">
      <TryItOutBtn :label="tryItOutBtnLabel" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

import {
  api,
  method,
  initApi,
  parameters,
  requestBody,
  contentType,
  setApiByMethod,
  setParamExample,
  resetUserInputs,
  setReqBdyExample,
  reqBdyExamplesToNull,
  parametersExamplesToNull,
} from "src/services/apiService";

import {
  endpoint,
  queryStr,
  queryParamObj,
  reqBdyExamples,
  setQueryParamObj,
  setReqBdyExamplesObj,
} from "src/services/tryItOutService";

import FieldsReq from "src/components/ReqRes/FieldsReq.vue";
import RawReq from "src/components/ReqRes/RawReq.vue";
import TryItOutBtn from "src/components/TryItOutBtn.vue";

const props = defineProps({
  showEndpointAndMethod: { default: false },
  requestBodyExampleObj: {},
  tryItOutBtnLabel: { type: String, default: "Try It Out" },
});

const isJsonInput = ref(false);

const handleInputMthdSwitch = () => {
  if (!isJsonInput.value) {
    // Switched to fields input
    // console.log("Handle input method switch. switched to fields input");
    rawReqBdyObjToReqBdy();
    newQueryParamToParams();
  }
};

const rawReqBdyObjToReqBdy = () => {
  if (!reqBdyExamples.value) return;
  reqBdyExamplesToNull();
  for (let [k, v] of Object.entries(reqBdyExamples.value)) {
    setReqBdyExample(k, v);
  }
};

const newQueryParamToParams = () => {
  // console.log("neqQueryParamToParams", queryParamObj.value, parameters.value);
  if (!queryParamObj.value) return;
  parametersExamplesToNull();
  for (let [k, v] of Object.entries(queryParamObj.value)) {
    useSetParamExample(k, v);
  }
};

const handleResetInput = () => {
  resetUserInputs();
};

const useSetParamExample = (paramName, paramExam) => {
  setParamExample(paramName, paramExam);
};

const useSetReqBdyExample = (bdyName, bdyExam) => {
  setReqBdyExample(bdyName, bdyExam);
};

const useSetReqBdyEgObj = (rawReqBdyObj) => {
  setReqBdyExamplesObj(rawReqBdyObj);
};

const useSetQueryParamObj = (newQueryParam) => {
  // console.log("useSetQueryParamObj", newQueryParam);
  setQueryParamObj(newQueryParam);
};

const applyRequestBodyExampleObj = () => {
  const reqBdyExObj = props.requestBodyExampleObj;
  let reqBdyExampleIsResetted = false; // Define indicator
  for (const [k, v] of Object.entries(reqBdyExObj)) {
    // console.log(k, v);
    if (v && !reqBdyExampleIsResetted) {
      reqBdyExampleIsResetted = true;
      /**
       * Only reset request body examples when there is
       * at least one valid input.
       */
      reqBdyExamplesToNull();
    }

    if (v) {
      setReqBdyExample(k, v);
    }
  }
};

onMounted(() => {
  // console.log("RequestComp Mounted\n", props.requestBodyExampleObj);
  if (props.requestBodyExampleObj) {
    applyRequestBodyExampleObj();
  }
});
</script>

<style lang="scss" scoped></style>
