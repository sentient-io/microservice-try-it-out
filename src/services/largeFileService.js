import { computed, ref, watch } from "vue";
import { Loading, LocalStorage, date, Notify, copyToClipboard } from "quasar";
import Papa from "papaparse";
import * as axios from "boot/axios";

import { deepCopy } from "./utils";
import { docTitle } from "./docService";
import { sentientLargeFileMsDetailsFallback } from "src/configs/fallbackConfigs";
import { getArgs } from "./tryItOutService";
import { initApiResponse } from "./apiCallService";
import { setParamExample } from "./apiService";

const MS_NAME_KEY = "MicroserviceName";

const sentientLargeFileMsDetails = ref();

const currentLargeFileMsPaths = ref();

const largeFile = ref();

// Response from the 1st api call - get upload policy
const getUploadPolicyRes = ref();
const getUploadPolicyResState = ref();
const largeFileJobId = ref();

// Response from the 2nd api call - upload file
const uploadFileRes = ref();
const uploadFileResState = ref();

const largeFileJobHistory = ref();

const getLargeFileJobHistory = () => {
  largeFileJobHistory.value = LocalStorage.getItem(
    "Sentient Large File Api History"
  );
  if (!largeFileJobHistory.value) {
    LocalStorage.set("Sentient Large File Api History", {});
    getLargeFileJobHistory();
  }
};
getLargeFileJobHistory();
/**
 * Access to the try it out config google sheet:
 * https://docs.google.com/spreadsheets/d/1WK3USTdQ3SseZNgiVoNuW7ZBYyUY2W-ALB_YThk24O4/edit?usp=sharing
 * If need edit the configuration, please request access from zq
 */
const sentientLargeFileMsDetailsUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRwZu2UGE9LqKGT3LX0CxTLMKOjGqyHxDM4-NZogumEyuh7JtqcXFdUdmOP7Pf4OLOQOsdULXc4IiGw/pub?gid=1547358520&single=true&output=csv";

const checkSentientLargeFileMs = async (doc) => {
  // If url largeFile is true
  // If mapped with provided list
  if (!sentientLargeFileMsDetails.value) {
    // console.log("Fetching last fields detail.");
    Loading.show();
    await getSentientLargeFileMsNames();
    Loading.hide();
  }
  let isSentientLargeFileMs = false;
  currentLargeFileMsPaths.value = null;

  const msName = doc["info"]["title"];
  const details = sentientLargeFileMsDetails.value;
  details.forEach((detail) => {
    // If the microservice namp mapped the document recording
    if (detail[MS_NAME_KEY] == msName) {
      isSentientLargeFileMs = true;
      currentLargeFileMsPaths.value = detail;
    }
  });

  if (isSentientLargeFileMs) {
    initApiResponse();
  }

  return isSentientLargeFileMs;
};

const getSentientLargeFileMsNames = () => {
  return new Promise((resolve, reject) => {
    // console.log("getSentientLargeFileMsNames");
    // Assign a fallback value first
    Papa.parse(sentientLargeFileMsDetailsUrl, {
      download: true,
      header: true,
      transformHeader: true,
      complete: (res) => {
        if (res?.data) {
          sentientLargeFileMsDetails.value = res.data;
          resolve();
        } else {
          sentientLargeFileMsDetails.value = sentientLargeFileMsDetailsFallback;
          reject();
        }
      },
    });
  });
};

import { apiPaths } from "./docService";
const checkLargeFileMsPathMapping = () => {
  /**
   * Very hard coded funtions. This function will check if the provided
   * large file microservice's paths are same as the hard coded paths.
   * If they are not matching, do some force correction and log warning
   * messages.
   */
  for (const [key, path] of Object.entries(currentLargeFileMsPaths.value)) {
    // console.log(path, apiPaths.value);
    if (key == MS_NAME_KEY) continue;
    if (!apiPaths.value.includes(path)) {
      console.warn(
        `Path ${path} is not matching the provided path in API documentation. It can be API documentation's error, or the configuration file is not up to date.`
      );
      currentLargeFileMsPaths.value[key] = _reMapLargeFilePathsByKey(key);
    }
  }
};

const _reMapLargeFilePathsByKey = (key) => {
  let reMappedPath;
  switch (key) {
    case "getUploadPolicy":
      reMappedPath = findApiPathByIndicator("getuploadurl");
      break;
    case "uploadFile":
      reMappedPath = findApiPathByIndicator("upload");
      break;
    case "status":
      reMappedPath = findApiPathByIndicator("getstatus");
      break;
    default:
      console.error(
        `${key} is not identified, possibly the configruation document have updated, or there are other hard-coded value chagne.`
      );
  }

  console.log(`Remapped ${key}'s path to: ${reMappedPath}`);
  return reMappedPath;
};

const findApiPathByIndicator = (indicator) => {
  return apiPaths.value.find((elem) => elem.includes(indicator));
};

const getLargeFilePathByTag = (tag) => {
  console.log("getLargeFilePathByTag");
  const largeFilePath = currentLargeFileMsPaths.value[tag];
  console.log(largeFilePath);
  return largeFilePath;
};

const setLargeFile = (file) => {
  largeFile.value = file;
};

const assignGetUploadPolicyRes = (gtUpldPoliRes) => {
  getUploadPolicyRes.value = gtUpldPoliRes;
  getUploadPolicyResState.value = "success";

  try {
    largeFileJobId.value = gtUpldPoliRes["data"]["results"]["jid"];
  } catch (err) {
    console.error(
      "Assign Job ID failed from get upload policy response, this issuse likely caused by change of respose data structure."
    );
  }
};

const storeLargeFileJobHistory = () => {
  const largeFileHistoryElem = _genLgFileJobHistElem();
  const currHistory = deepCopy(largeFileJobHistory.value);

  if (!currHistory[docTitle.value]) {
    currHistory[docTitle.value] = {};
  }
  currHistory[docTitle.value][largeFileJobId.value] = largeFileHistoryElem;

  LocalStorage.set("Sentient Large File Api History", currHistory);
  getLargeFileJobHistory();
};

const updateLargeFileStatusToHistory = (jId, status) => {
  const currHistory = deepCopy(largeFileJobHistory.value);
  const currDocHistry = currHistory?.[docTitle.value];
  if (!currDocHistry) {
    currHistory[docTitle.value] = {};
  }
  const currJobHist = currDocHistry?.[jId];

  if (!currJobHist) {
    console.warn(
      `No history for id ${jId} found in record, creating a new one.`
    );
    currJobHist[jId] = {};
  }
  console.log(currJobHist[jId], jId, status);

  try {
    currJobHist["Last Updated"] = status?.["last_updated"] || "";
    currJobHist["State"] = status?.["message"] || "Pending or Error";
    currJobHist["Output URL"] = status?.["output_url"] || "";
  } catch (err) {
    console.error(err);
    console.error(
      "Some error happened during store response from large file get status api call. This may due to some data structure change. "
    );
  }
  LocalStorage.set("Sentient Large File Api History", currHistory);
  getLargeFileJobHistory();
};

const getLargeFileStatusByJid = (jId) => {
  // Set request body example
  setParamExample("jid", jId);

  // Make api call
  const args = getArgs();

  // Get response and store in local storage
  const headers = { headers: args.headers };
  Loading.show();
  axios.api
    .get(args.endpoint, headers)
    .then((res) => {
      updateLargeFileStatusToHistory(jId, res.data);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      Loading.hide();
    });
};

const assignUploadFileRes = (upldFileRes) => {
  uploadFileRes.value = upldFileRes;
  uploadFileResState.value = "success";
  storeLargeFileJobHistory();
};

const initLargeFileResponses = () => {
  getUploadPolicyRes.value = null;
  getUploadPolicyResState.value = null;
  uploadFileRes.value = null;
  uploadFileResState.value = null;
};

const deleteLargeFileHistByJid = (jId) => {
  const currHistory = deepCopy(largeFileJobHistory.value);
  const currDocHistry = currHistory[docTitle.value];

  delete currDocHistry[jId];

  Notify.create(
    `Local recording of ${jId} been deleted. This action only deletes local recording, you can still make request with this job id.`
  );

  copyToClipboard(jId).then(() => {
    Notify.create({
      message:
        "In case you didn't do this intentionally, deleted jId been copied to clipboard. You can keep it somewhere else.",
      color: "orange-7",
    });
  });

  LocalStorage.set("Sentient Large File Api History", currHistory);
  getLargeFileJobHistory();
};

const _genLgFileJobHistElem = () => {
  const configurations = _getGetPolicyResConfig();
  try {
    return {
      "File Name": largeFile.value?.name || "unknown file",
      "Upload On": date.formatDate(Date.now(), "YYYY-MM-DD HH:MM:SS"),
      // Pending process, Processing, Completed, Expired
      State: "Pending process",
      "File Size": largeFile.value?.size || "unknown size",
      Configurations: configurations,
      Cost: getUploadPolicyRes.value["data"]["results"]["request_cost"],
    };
  } catch (err) {
    console.error(err);
    console.error(
      "Above error may caused by large file microservice response data structure change. "
    );
  }
};

const _getGetPolicyResConfig = () => {
  let configurations = "";
  try {
    configurations =
      getUploadPolicyRes.value["data"]["results"]["fields"][
        "x-goog-meta-additional_param"
      ];
  } catch (err) {
    console.error(
      "Get configuration of 'x-goog-meta-additional_param' failed from get upload policy response, this issuse likely caused by change of respose data structure."
    );
  }
  return configurations;
};

watch(currentLargeFileMsPaths, () => {
  // console.log("Watching currentLargeFileMsPaths change");
  if (currentLargeFileMsPaths.value) {
    checkLargeFileMsPathMapping();
  }
});

export {
  largeFile,
  uploadFileRes,
  largeFileJobId,
  getUploadPolicyRes,
  uploadFileResState,
  largeFileJobHistory,
  sentientLargeFileMsDetails,
  setLargeFile,
  assignUploadFileRes,
  getLargeFilePathByTag,
  initLargeFileResponses,
  getLargeFileStatusByJid,
  assignGetUploadPolicyRes,
  checkSentientLargeFileMs,
  deleteLargeFileHistByJid,
};
