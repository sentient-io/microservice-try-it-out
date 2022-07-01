import { ref, computed, watch } from "vue";
import axios from "axios";
import yaml from "js-yaml";

import { Resolver } from "@stoplight/json-ref-resolver";
import { Loading } from "quasar";

import { checkSentientLargeFileMs } from "./largeFileService";

const rawDoc = ref();
const doc = ref();
const docErr = ref("");
const yamlErr = ref("");

const docTitle = computed(() => {
  return doc.value?.["info"]?.["title"];
});

const securitySchemes = ref();

const isSentientLargeFileMs = ref();

const loadDoc = async (docUrl) => {
  // Do not disable below console log
  console.log("Loading doc from:\n" + docUrl);

  _resetDoc();
  Loading.show();
  try {
    const docRes = await _getDoc(docUrl);
    const docType = _getUrlType(docUrl);
    const docJson = await _processDocRes(docRes, docType);
    _chkOpenApi3(docJson);
    const parsedDoc = await _parseDocJson(docJson);

    // Keep a copy of original docJson for debugging purpose
    rawDoc.value = docJson;
    doc.value = parsedDoc;

    _setSecuritySchemes();

    // Do not disable below console log
    console.log("Raw Documentation\n", docJson);
  } catch (err) {
    console.error(err);
    docErr.value = err;
  }

  Loading.hide();
};

const getApiPaths = () => {
  const _apiPaths = Object.keys(doc.value["paths"]);
  return _apiPaths;
};

const getServerObjs = () => {
  const serverObjs = doc.value?.["servers"];
  return serverObjs;
};

const getServerStr = () => {
  const serverObjs = doc.value?.["servers"];
  const serverStr = serverObjs?.[0] || doc.value?.["host"];
  if (doc.value?.["host"]) {
    console.warn('"host" tag detected, this is not part of OAS3.0.');
  }
  /**
   * !IMPORTANT!
   * Based on OAS3.0, a server can take more than one element.
   * Current version of try it out will only take the first server
   * element,   and user selecting function is not enabled till we
   * have such microservices (multiple server microservice)
   * 2022 15 Jun by ZQ
   */
  if (serverObjs.length > 1) {
    console.warn(
      "Multiple server element detected. Current version of try it out is not able to handle this."
    );
  }
  return serverStr;
};

const getApiObjsByPath = (path) => {
  const apis = doc.value["paths"][path];
  return apis;
};

const getMethodListByPath = (path) => {
  const apis = getApiObjsByPath(path);
  const methodList = Object.keys(apis);
  return methodList;
};

const _getDoc = async (url) => {
  const getDocResponse = await axios.get(url).catch((err) => {
    console.error(err);
    throw new Error("Failed to load documentation from url " + url);
  });
  try {
    return getDocResponse.data;
  } catch {
    throw new Error(
      "Failed to process loaded documentation, this is likely Try It Out platform's error."
    );
  }
};

const _parseDocJson = async (docJson) => {
  /**
   * Initiate valid documentation object. Also keep an copy
   * as rawDoc ,  this rawDoc should not expose to anywhere
   * outside of this file.   It is used to reset user inout
   */
  // console.log("_parseDocJson\n", docJson);
  const parsedDoc = await _resolveJsonRef(docJson).catch((err) => {
    console.error("Resolve JSON Error\n", err);
  });
  return parsedDoc;
};

const _resetDoc = () => {
  rawDoc.value = "";
  doc.value = "";
  docErr.value = "";
  yamlErr.value = "";
  securitySchemes.value = null; // init value
};

const _getUrlType = (url) => {
  /**
   * Extract the extention after "." from url to identify
   * the type of url
   */
  const urlType = url.match(/.*\.(.*)$/)[1];
  const urlTypes = ["json", "yaml", "yml"];
  if (urlTypes.includes(urlType)) {
    return urlType;
  } else {
    throw new Error(
      `Invalid documentation url, expect an url targeting to 'json', 'yaml' or 'yml' document.`
    );
  }
};

const _processDocRes = (docResponse, docType = "") => {
  /**
   * This function takes any format of API documentation
   * and convert to valid JSON object.
   */
  let docJson;
  if (docType == "yaml" || docType == "yml") {
    try {
      docJson = yaml.load(docResponse);
    } catch (err) {
      const errMsg = "Yaml error. Please fix the yaml documentation. " + err;
      throw errMsg;
    }
  } else if (typeof docResponse == "string") {
    docJson = JSON.parse(docResponse);
  } else {
    docJson = JSON.parse(JSON.stringify(docResponse));
  }

  return docJson;
};

const _resolveJsonRef = async (jsonObj) => {
  /**
   * This function takes an Json Object, use the jsonref package to
   * flat all the "$ref" element. Make everything direct accessable
   */
  const resolver = new Resolver();
  const resolvedJson = await resolver.resolve(jsonObj);
  return resolvedJson.result;
};

const _chkOpenApi3 = (docJson) => {
  const isOpenApi3 = docJson?.["openapi"]?.[0] == "3";
  if (!isOpenApi3) {
    throw new Error(
      "Provided API documentation is not OpenAPI Specification V3."
    );
  }
};

const _setSecuritySchemes = () => {
  securitySchemes.value = doc.value?.["components"]?.["securitySchemes"] || "";
};

watch(doc, async () => {
  // console.log("watching doc change");
  if (doc.value) {
    isSentientLargeFileMs.value = await checkSentientLargeFileMs(doc.value);
  }
});

const apiPaths = computed(() => {
  return Object.keys(doc.value["paths"]);
});

export {
  doc,
  docErr,
  yamlErr,
  apiPaths,
  docTitle,
  securitySchemes,
  isSentientLargeFileMs,
  loadDoc,
  getApiPaths,
  getServerStr,
  getServerObjs,
  getApiObjsByPath,
  getMethodListByPath,
};
