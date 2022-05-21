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
          <FieldsReq :request-body="requestBody" />
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

import FieldsReq from "src/components/ReqRes/FieldsReq.vue";
import PrettyRes from "src/components/ReqRes/PrettyRes.vue";

const props = defineProps({
  api: { required: true },
  method: {},
});

const tab = ref();

const requestBody = ref();

const init = () => {
  // Set default active tab
  tab.value = "request";
  // _setRequestBody();
  console.log(props);
};

const _setRequestBody = () => {
  requestBody.value = props.api["requestBody"];
};

onMounted(() => {
  init();
});

watch(
  () => props.api,
  () => {
    console.log("Watching props change.");
    if (props.api) {
      console.log(props.api);
      _setRequestBody();
    }
  }
);
</script>

<style lang="scss" scoped></style>
