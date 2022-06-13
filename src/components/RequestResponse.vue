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
      <q-tab name="response" label="Response" />
    </q-tabs>
    <div style="border: 1px solid #efefef">
      <q-tab-panels v-model="tab">
        <q-tab-panel name="request" style="max-width: 90vw">
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
          <RawReq
            v-if="isJsonInput"
            :req-bdy-examples="reqBdyExamples"
            :query-params="queryParamObj"
            :method="method"
            :query-string="queryStr"
            @update-request-body="
              (rawReqBdyObj) => useSetReqBdyEgObj(rawReqBdyObj)
            "
            @update-query-params="
              (newQueryParam) => {
                useSetQueryParamObj(newQueryParam);
              }
            "
          />
          <FieldsReq
            v-else
            :request-body="requestBody"
            :content-type="contentType"
            :parameters="parameters"
            :method="method"
            @update-parameters="(k, v) => useSetParamExample(k, v)"
            @update-request-body="(k, v) => useSetReqBdyExample(k, v)"
          />

          <div class="row justify-center q-py-md">
            <TryItOutBtn />
          </div>
        </q-tab-panel>

        <q-tab-panel name="response">
          <div class="row justify-between">
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
              <q-checkbox v-model="prettyResExpandAll" label="Expand All" />
            </div>
          </div>
          <RawRes v-if="isRawResponse" :response="apiResponse" />
          <PrettyRes v-else :response="apiResponse" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

import FieldsReq from "src/components/ReqRes/FieldsReq.vue";
import RawReq from "src/components/ReqRes/RawReq.vue";
import PrettyRes from "src/components/ReqRes/PrettyRes.vue";
import RawRes from "src/components/ReqRes/RawRes.vue";
import TryItOutBtn from "src/components/TryItOutBtn.vue";

import {
  api,
  method,
  requestBody,
  contentType,
  parameters,
  setReqBdyExample,
  setParamExample,
  reqBdyExamplesToNull,
  parametersExamplesToNull,
} from "src/services/apiService";

import { apiResponse } from "src/services/apiCallService";

import {
  queryStr,
  queryParamObj,
  reqBdyExamples,
  setQueryParamObj,
  setReqBdyExamplesObj,
} from "src/services/tryItOutService";

import { prettyResExpandAll } from "src/services/appService";

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

const useSetReqBdyExample = (bdyName, bdyExam) => {
  setReqBdyExample(bdyName, bdyExam);
};

const useSetReqBdyEgObj = (rawReqBdyObj) => {
  setReqBdyExamplesObj(rawReqBdyObj);
};

const useSetQueryParamObj = (newQueryParam) => {
  console.log("useSetQueryParamObj", newQueryParam);
  setQueryParamObj(newQueryParam);
};

const handleInputMthdSwitch = () => {
  if (!isJsonInput.value) {
    // Switched to fields input
    console.log("Handle input method switch. switched to fields input");
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

onMounted(() => {
  init();
});

watch(apiResponse, () => {
  if (apiResponse.value) {
    tab.value = "response";
  }
});

watch(api, () => {
  console.log("Watchng api change\n", api);
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
