<template>
  <div>
    <q-tabs
      dense
      no-caps
      v-model="tab"
      align="justify"
      narrow-indicator
      indicator-color="transparent"
      active-class="text-white bg-beige"
      class="bg-grey-2"
    >
      <q-tab
        v-for="tabKey in Object.keys(tabs)"
        :key="tabKey"
        :name="tabKey"
        :label="tabs[tabKey].label"
      ></q-tab>
    </q-tabs>
    <div style="border: 1px solid #efefef">
      <q-tab-panels v-model="tab">
        <q-tab-panel name="getUploadPolicy">
          <!-- Response viwe (likely caused by error) -->
          <LargeFileRawResViewer
            v-if="apiResponse"
            :response="apiResponse"
            :status="apiResponse?.data?.status || ''"
            :response-message="apiResponse?.data?.message || ''"
            lable="Last API Call Response"
          />
          <RequestsComp
            :show-endpoint-and-method="true"
            try-it-out-btn-label="Get Policy"
          >
            <template #requests-helper>
              <div class="q-mt-md bg-grey-1">
                <LargeFileUploader />
              </div>
            </template>
          </RequestsComp>
        </q-tab-panel>

        <!-- Upload File -->
        <q-tab-panel name="uploadFile">
          <!-- Preview Response -->
          <!-- Show error response first -->
          <!-- Particularly for large file, the error message is "Error: Network Error", this is likely caused by error in policy, or endpoints -->
          <!-- {{ apiResponse }} -->
          <div v-if="debugMode">
            <LargeFileRawResViewer
              v-if="apiResponse == 'Error: Network Error'"
              :response="apiResponse"
              status="failure"
              :response-message="apiResponse"
              label="Error: Network Error"
            />
            <!-- This is to log the standard error. Anything not started with "2" -->
            <LargeFileRawResViewer
              v-else-if="
                apiResponse?.status &&
                apiResponse?.status?.toString()?.[0] !== '2'
              "
              :response="apiResponse"
              :status="apiResponse?.data?.status || 'failure'"
              :response-message="apiResponse?.data?.message || apiResponse"
              label="Response From Last API Call"
            />
            <!-- If last API call is success, show the previous Tab's response as data reference -->
            <LargeFileRawResViewer
              v-else-if="getUploadPolicyRes"
              :response="getUploadPolicyRes"
              :status="getUploadPolicyRes?.data?.status || ''"
              :response-message="getUploadPolicyRes?.data?.message || ''"
              label="Response From Last Step"
            />
          </div>

          <div>
            <!-- Append both file value and upload policy response -->
            <RequestsComp
              :show-endpoint-and-method="true"
              try-it-out-btn-label="Upload File"
              :request-body-example-obj="{
                ...fieldsForUploadApi,
                ...{ file: largeFile },
              }"
            />
          </div>
        </q-tab-panel>

        <!-- Status Panel -->
        <q-tab-panel name="status">
          <!-- {{ uploadFileRes }} -->
          <!-- Because this response is from Google's server, so the structure is different from other response (status is not wrapped inside data) -->
          <LargeFileRawResViewer
            v-if="uploadFileRes"
            :response="uploadFileRes"
            :status="
              uploadFileRes?.status?.toString()?.[0] == '2'
                ? 'success'
                : 'failure'
            "
            :response-message="uploadFileRes?.data?.message || ''"
            label="Response From Last Step"
          />

          <div>
            <LargeFileHistory :doc-title="docTitle" class="q-mb-md" />
            <RequestsComp
              :show-endpoint-and-method="true"
              try-it-out-btn-label="Get Status"
            />
          </div>
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
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { deepCopy } from "src/services/utils";

import { apiResponse } from "src/services/apiCallService";

import { prettyResExpandAll, debugMode } from "src/services/appService";

import { requestBody, setReqBdyExample } from "src/services/apiService";

import {
  largeFile,
  uploadFileRes,
  getUploadPolicyRes,
  assignUploadFileRes,
  largeFileJobHistory,
  getLargeFilePathByTag,
  initLargeFileResponses,
  assignGetUploadPolicyRes,
} from "src/services/largeFileService";

import { doc, docTitle } from "src/services/docService";

import RawRes from "src/components/ReqRes/RawRes.vue";
import PrettyRes from "src/components/ReqRes/PrettyRes.vue";
import RequestsComp from "src/components/ReqRes/RequestsComp.vue";
import LargeFileHistory from "src/components/Plus/LargeFileHistory.vue";
import LargeFileUploader from "src/components/Plus/LargeFileUploader.vue";
import LargeFileRawResViewer from "./LargeFileRawResViewer.vue";

const $q = useQuasar();
const emit = defineEmits(["setApiPath"]);

const tabs = {
  getUploadPolicy: { label: "Get Upload Policy" },
  uploadFile: { label: "Upload File" },
  status: { label: "Status" },
  // response: { label: "Response" },
};

const isRawResponse = ref(false);

const tab = ref("getUploadPolicy");

const isGetUploadPolicyResSuccess = computed(() => {
  if (getUploadPolicyRes.value) {
    return true;
  } else {
    return false;
  }
});

const getUploadPolicyResMsg = computed(() => {
  // console.log(apiResponse.value);
  const apiResStatus = apiResponse.value?.["data"]?.["status"] || "";
  const apiFailure = apiResStatus.toLowerCase() == "failure";
  if (getUploadPolicyRes.value) {
    return "Response from previous API call be applied to current request body.";
  } else if (apiFailure) {
    return `Error from previous api call. ${apiResponse.value?.["data"]?.message}`;
  } else {
    return "";
  }
});

const uploadFileResMsg = computed(() => {
  // console.log(apiResponse.value);
  const apiFailure = apiResponse.value == "Error: Network Error";
  if (getUploadPolicyRes.value) {
    return "Response from previous API call be applied to current request body.";
  } else if (apiFailure) {
    return "Network error. This is may caused by issues in the endpoint URL.";
  } else {
    return "";
  }
});

const fieldsForUploadApi = computed(() => {
  return getUploadPolicyRes.value?.["data"]?.["results"]?.["fields"] || "";
});

const handleUserSelectTab = (tabName) => {
  let pathToSet;
  pathToSet = getLargeFilePathByTag(tabName);

  if (pathToSet) {
    emit("setApiPath", pathToSet);
  }
};

const setGetUploadPolicyRes = () => {
  // console.log("setGetUploadPolicyRes\n", apiResponse.value);
  const isSuccessResponse =
    apiResponse.value?.["data"]?.["results"]?.["fields"];
  if (isSuccessResponse) {
    const getUpldPoliRes = deepCopy(apiResponse.value);
    assignGetUploadPolicyRes(getUpldPoliRes);

    // Set stored binary file as the file value

    // Store JID, file name, processed time, configruation locally
    $q.notify({
      message: getUploadPolicyResMsg.value,
      color: "green-7",
    });
  } else {
    // It could also be the response data structure have been changed
    if (!uploadFileResMsg.value) return;
    $q.notify({
      message: getUploadPolicyResMsg.value,
      color: "orange-7",
    });
  }
};

const setUploadFileRes = () => {
  // console.log("setUploadFileRes", apiResponse.value);
  const apiResFields = apiResponse.value;
  if (apiResFields?.["status"] == "204" || "200") {
    const apiResFieldsCopy = deepCopy(apiResFields);
    assignUploadFileRes(apiResFieldsCopy);

    // Set stored binary file as the file value

    $q.notify({ message: uploadFileResMsg.value, color: "green-7" });
  } else {
    // It could also be the response data structure have been changed
    if (!uploadFileResMsg.value) return;
    $q.notify({
      message: uploadFileResMsg.value,
      color: "orange-7",
    });
  }
};

onMounted(() => {
  // console.log("LargeFile.vue Mounted");
  // Init based on first query string
});

watch(tab, () => {
  handleUserSelectTab(tab.value);
});

/**
 * !! Important !!
 * Main flow of navigating user between large file tabs
 */
watch(apiResponse, () => {
  // console.log("Watching apiResponse Change", apiResponse.value);
  if (apiResponse.value && apiResponse.value?.status?.toString()?.[0] != "2") {
    console.error(
      apiResponse.value?.data?.["message"] || "Unsuccessful API call"
    );
    return;
  }
  if (apiResponse.value) {
    const tabsArr = Object.keys(tabs);
    const currentTabIndex = tabsArr.findIndex((elem) => {
      return elem == tab.value;
    });
    if (tab.value !== tabsArr[2]) {
      tab.value = tabsArr[currentTabIndex + 1];
    }

    // If move from 1st api call to 2nd api call
    if (tab.value == tabsArr[1]) setGetUploadPolicyRes();
    // If user moved from 2nd api to 3rd api
    if (tab.value == tabsArr[2]) setUploadFileRes();
  }
});

watch(doc, () => {
  // console.log("Watching doc change from large file");
  initLargeFileResponses();
});
</script>

<style lang="scss" scoped></style>
