<template>
  <div>
    <q-tabs
      dense
      v-model="tab"
      align="justify"
      narrow-indicator
      indicator-color="transparent"
      active-class="text-white bg-primary"
      class="bg-grey-2"
    >
      <q-tab name="request" label="Request" />
      <q-tab name="response" label="Response" :disable="!apiResponse" />
    </q-tabs>
    <div style="border: 1px solid #efefef">
      <q-tab-panels v-model="tab">
        <!-- 
          Set 90vw because sometimes base64 string 
          in JSON obj will over flow a lot. 
          -->
        <q-tab-panel name="request" style="max-width: 90vw" class="q-mx-auto">
          <RequestsComp />
        </q-tab-panel>

        <q-tab-panel name="response">
          <div class="row justify-between q-mb-sm">
            <div class="row items-center">
              <b>Pretty Response</b>
              <q-toggle
                size="2rem"
                color="green-7"
                class="state-toggle"
                v-model="isRawResponse"
                @click="handleInputMthdSwitch()"
              />
              <b>Raw Response</b>
            </div>

            <!-- Expand all nested pretty response -->
            <div v-if="!isRawResponse">
              <q-checkbox
                size="2rem"
                v-model="prettyResExpandAll"
                label="Expand All"
              />
            </div>
          </div>
          <RawRes v-if="isRawResponse" :response="apiResponse" />
          <PrettyRes v-else :response="apiResponse" />
          <ApiResReport />
        </q-tab-panel>
      </q-tab-panels>
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
  queryStr,
  queryParamObj,
  reqBdyExamples,
  setQueryParamObj,
  setReqBdyExamplesObj,
} from "src/services/tryItOutService";

import { apiResponse } from "src/services/apiCallService";

import { prettyResExpandAll } from "src/services/appService";

import RawReq from "src/components/ReqRes/RawReq.vue";
import RawRes from "src/components/ReqRes/RawRes.vue";
import FieldsReq from "src/components/ReqRes/FieldsReq.vue";
import PrettyRes from "src/components/ReqRes/PrettyRes.vue";
import RequestsComp from "src/components/ReqRes/RequestsComp.vue";
import ApiResReport from "src/components/Debug/ApiResReport.vue";

const tab = ref();
const isJsonInput = ref(false);
const isRawResponse = ref(false);

const init = () => {
  // Set default active tab
  tab.value = "request";
};

const useSetParamExample = (paramName, paramExam) => {
  setParamExample(paramName, paramExam);
};

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

// const handleResetInput = () => {
//   resetUserInputs();
// };

onMounted(() => {
  init();
});

watch(apiResponse, () => {
  if (apiResponse.value) {
    tab.value = "response";
  }
});
</script>

<style lang="scss">
.state-toggle[aria-checked="false"] .q-toggle__thumb::after {
  background-color: $primary;
}
.state-toggle[aria-checked="false"] .q-toggle__track {
  background-color: $primary;
}
</style>
