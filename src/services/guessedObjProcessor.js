import { ref, watch } from "vue";

import { getUriHeader, getMediaTypeFromUriHeader } from "src/services/utils";

import Papa from "papaparse";

/**
 * Structure of the base64UriHeaderMap:
 * {
 *   "request_key": "media/type",
 *   "wav_base64":"audio/wav"
 * }
 * To deploy on prem or hard code the base64UriHeaderMap,
 * simply disable the __loadBase64UriHeaderMap() function
 * And add the hard coded mapping in to below variable.
 */
const base64UriHeaderMap = ref();

const fieldKeyToMediaTypeMap = ref();

const base64UriHeaderMapUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRwZu2UGE9LqKGT3LX0CxTLMKOjGqyHxDM4-NZogumEyuh7JtqcXFdUdmOP7Pf4OLOQOsdULXc4IiGw/pub?gid=0&single=true&output=csv";

// watch(base64UriHeaderMap, () => {
// console.log("base64UriHeaderMap\n", base64UriHeaderMap.value);
// });

const guessBase64UriByName = (key, origBase64) => {
  // console.log("guessBase64UriByName", key, origBase64);

  if (!Object.keys(base64UriHeaderMap.value)[0]) {
    console.error(
      "Failed to load base64UriHeaderMap from:\n" + base64UriHeaderMapUrl
    );
    return "";
  }
  const mediaType = base64UriHeaderMap.value?.[key] || "";
  if (mediaType == "") {
    console.warn(`Media type of key ${key} is not mapped.`);
    // Terminate
    return "";
  }
  const uriHeader = `data:${mediaType};base64,`;
  return uriHeader + origBase64;
};

const guessBase64MediaType = (key, base64) => {
  // console.log("guessMediaTypeByKeyAndBase64");
  let mediaType = null;
  // const TEST_HEADER = "data:audio/wav;base64,";
  const mediaHeader = getUriHeader(base64);
  if (mediaHeader) {
    mediaType = getMediaTypeFromUriHeader(mediaHeader);
  } else {
    mediaType = fieldKeyToMediaTypeMap.value?.[key];
  }

  return mediaType;
};

// !Important! Always put this function at the most bottom
const __loadBase64UriHeaderMap = (() => {
  // console.log("loadBase64UriHeaderMap");
  Papa.parse(base64UriHeaderMapUrl, {
    download: true,
    header: true,
    transformHeader: true,
    complete: (res) => {
      if (res?.data) {
        base64UriHeaderMap.value = {};
        fieldKeyToMediaTypeMap.value = {};
        res.data.forEach((elem) => {
          base64UriHeaderMap.value[elem["Key"]] = elem["UriHeader"];
          // Extract the media type and assign to mediaTypeMap
          const mediaType = elem["UriHeader"].split("/")[0];
          fieldKeyToMediaTypeMap.value[elem["Key"]] = mediaType;
        });
      }
    },
  });
})();

export { guessBase64UriByName, guessBase64MediaType };
