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
  _resetDoc();
  Loading.show();
  try {
    console.log("Loading doc from:\n" + docUrl);

    const loadDocResponse = await axios.get(docUrl);
    const docResponse = loadDocResponse.data;
    const docType = _getUrlType(docUrl);
    const docJson = await _processDocResponse(docResponse, docType);

    await initDoc(docJson);
  } catch (err) {
    _handleLoadDocError(docUrl);
  }
  Loading.hide();
};

const initDoc = async (docJson) => {
  /**
   * Initiate valid documentation object. Also keep an copy
   * as rawDoc ,  this rawDoc should not expose to anywhere
   * outside of this file.   It is used to reset user inout
   */
  // console.log("initDoc\n", docJson);

  rawDoc.value = docJson;
  const parsedDoc = await _resolveJsonRef(docJson).catch((err) => {
    console.error("Resolve JSON Error\n", err);
  });
  doc.value = parsedDoc;
  setSecuritySchemes();
};

const setSecuritySchemes = () => {
  securitySchemes.value = null; // init value
  securitySchemes.value = doc.value["components"]["securitySchemes"];
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

const _handleLoadDocError = (docUrl) => {
  docErr.value = "An error occured, dococument failed load from url: " + docUrl;
};

const _resetDoc = () => {
  rawDoc.value = "";
  doc.value = "";
  docErr.value = "";
  yamlErr.value = "";
};

const _getUrlType = (url) => {
  /**
   * Extract the extention after "." from url to identify
   * the type of url (json / yaml / yml)
   */
  return url.match(/.*\.(.*)$/)[1];
};

const _processDocResponse = (docResponse, docType = "") => {
  /**
   * This function takes any format of API documentation
   * and convert to valid JSON object.
   */
  let docJson;
  if (docType == "yaml" || docType == "yml") {
    try {
      docJson = yaml.load(docResponse);
    } catch (err) {
      console.error("Yaml error. Please fix the yaml documentation.\n", err);
      yamlErr.value = err;
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
