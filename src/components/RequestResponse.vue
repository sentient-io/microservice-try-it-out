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
        <q-tab-panel name="request">
          <FieldsReq
            :request-body="requestBody"
            :content-type="contentType"
            :parameters="parameters"
            :method="method"
            @update-parameters="(newParams) => useSetParams(newParams)"
            @update-request-body="(newReqBdy) => useSetReqBdy(newReqBdy)"
          />
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
  setParameters,
  setRequestBody,
} from "src/services/apiService";

import FieldsReq from "src/components/ReqRes/FieldsReq.vue";
import PrettyRes from "src/components/ReqRes/PrettyRes.vue";

const tab = ref();

const init = () => {
  // Set default active tab
  tab.value = "request";
};

const useSetParams = (newParams) => {
  setParameters(newParams);
};

const useSetReqBdy = (newReqBdy) => {
  setRequestBody(newReqBdy);
};

onMounted(() => {
  init();
});
</script>

<style lang="scss" scoped></style>
