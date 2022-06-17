import { computed, ref, watch } from "vue";
import { Loading } from "quasar";

import Papa from "papaparse";

import { sentientLargeFileMsDetailsFallback } from "src/configs/fallbackConfigs";

import { initApiResponse } from "./apiCallService";

const sentientLargeFileMsDetails = ref();

const currentLargeFileMsPaths = ref();

const largeFile = ref();

const MS_NAME_KEY = "MicroserviceName";

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
      currentLargeFileMsPaths.value[key] = reMapLargeFilePathsByKey(key);
    }
  }
};

const reMapLargeFilePathsByKey = (key) => {
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

watch(currentLargeFileMsPaths, () => {
  console.log("Watching currentLargeFileMsPaths change");
  if (currentLargeFileMsPaths.value) {
    checkLargeFileMsPathMapping();
  }
});

export {
  largeFile,
  setLargeFile,
  getLargeFilePathByTag,
  checkSentientLargeFileMs,
  sentientLargeFileMsDetails,
};
