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
          {{ parameters }}
          <FieldsReq
            :request-body="requestBody"
            :content-type="contentType"
            :parameters="parameters"
            :method="method"
            @update-parameters="(k, v) => useSetParamExample(k, v)"
            @update-request-body="(k, v) => updateReqBdyExample(k, v)"
          />
          <div class="row justify-center">
            <TryItOutBtn />
          </div>
        </q-tab-panel>

        <q-tab-panel name="response">
          <PrettyRes />
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
  requestBody,
  contentType,
  parameters,
  setReqBdyExample,
  setParamExample,
} from "src/services/apiService";

import { apiResponse } from "src/services/apiCallService";

import FieldsReq from "src/components/ReqRes/FieldsReq.vue";
import PrettyRes from "src/components/ReqRes/PrettyRes.vue";
import TryItOutBtn from "src/components/TryItOutBtn.vue";

const tab = ref();

const init = () => {
  // Set default active tab
  tab.value = "request";
};

const useSetParamExample = (paramName, paramExam) => {
  setParamExample(paramName, paramExam);
};

const updateReqBdyExample = (bdyName, bdyExam) => {
  setReqBdyExample(bdyName, bdyExam);
};

onMounted(() => {
  init();
});

watch(apiResponse, () => {
  if (apiResponse.value) {
    tab.value = "response";
  }
});
</script>

<style lang="scss" scoped></style>
