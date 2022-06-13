<template>
  <div>
    <div class="row justify-between q-gutter-md q-mb-sm">
      <div v-if="status">
        Status: <b>{{ status }} </b>
        <span v-show="statusText">- ({{ statusText }})</span>
      </div>
      <div v-if="resContentType">
        Content Type: <b>{{ resContentType }}</b>
      </div>
    </div>

    <div v-if="response">
      <ObjectViewer
        :object="response.data"
        v-if="JSON_TYPE.includes(resContentType)"
      />
      <div v-else>
        <p class="q-pa-md" style="border: 1px solid rgba(128, 128, 128, 0.25)">
          {{ rawRes }}
        </p>
      </div>
    </div>
    <div v-else>
      <p class="q-mt-md text-grey-6 text-center">
        No response to display yet. Please make a request.
      </p>
    </div>

    <div v-if="response" class="row q-pa-md q-gutter-sm">
      <q-btn
        outline
        no-caps
        color="green-6"
        size="0.75rem"
        icon="content_copy"
        label="Copy Response"
        @click="copyRawRes()"
      />

      <q-btn
        outline
        no-caps
        color="amber-8"
        size="0.75rem"
        icon="download"
        label="Download Response"
        @click="downloadRawRes()"
      />

      <q-btn
        outline
        no-caps
        color="grey-6"
        size="0.75rem"
        label="View Full Response"
        @click="showFullRes = true"
      />
    </div>

    <q-dialog v-model="showFullRes">
      <q-card
        class="q-pa-md column items-center q-gutter-md"
        style="width: clamp(280px, 75vw, 900px); max-width: 100%"
      >
        <p class="text-center q-ma-none">Complete response from the API call</p>
        <ObjectViewer :object="response" />
        <q-btn
          label="Close"
          @click="showFullRes = false"
          no-caps
          outline
          color="grey-8"
        />
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { copyToClipboard, useQuasar } from "quasar";

import exportFromJSON from "export-from-json";

import { isInIframe } from "src/services/appService";
import ObjectViewer from "src/components/Viewers/ObjectViewer.vue";

const $q = useQuasar();

const props = defineProps({
  response: {},
});

// Renamed as resContentType so it is different from contentType from request
const resContentType = ref();
const status = ref();
const statusText = ref();

const rawRes = computed(() => {
  const response = props.response;
  return response.data || response.message || response;
});

const rawResStr = computed(() => {
  let _rawRes = rawRes.value;
  if (typeof _rawRes !== "string") {
    _rawRes = JSON.stringify(_rawRes);
  }
  return _rawRes;
});

const showFullRes = ref(false);

const JSON_TYPE = ["application/json"];
const TEXT_TYPE = ["text/plain"];

const setResponse = () => {
  resContentType.value = props.response?.headers?.["content-type"] || "";
  status.value = props.response.status;
  statusText.value = props.response.statusText;
};

const copyRawRes = () => {
  if (isInIframe) {
    window.top.postMessage({ responseToCopy: rawResStr.value }, "*");
  } else {
    copyToClipboard(rawResStr.value);
  }
  $q.notify("Response Copied To Clipboard");
};

const downloadRawRes = () => {
  let rawResObj = rawRes.value;
  if (typeof rawResObj !== "object") {
    // Alwayus make sure pass an object to exportFromJson()
    rawResObj = { "": rawResObj };
  }
  const exportArgs = {
    data: rawResObj,
    fileName: "Response",
    exportType: exportFromJSON.types.json,
  };
  exportFromJSON(exportArgs);
};

const initRes = () => {
  status.value = "";
  resContentType.value = "";
  statusText.value = "";
};

const _init = () => {
  if (props.response) {
    setResponse();
  } else {
    initRes();
  }
};

onMounted(() => {
  _init();
});

watch(
  () => props,
  () => _init()
);
</script>

<style lang="scss" scoped>
pre {
  white-space: pre-wrap;
  line-break: anywhere;
}
</style>
