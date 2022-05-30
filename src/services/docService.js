import { ref } from "vue";
import axios from "axios";
import yaml from "js-yaml";
import { Resolver } from "@stoplight/json-ref-resolver";
import { Loading } from "quasar";

const rawDoc = ref();
const doc = ref();
const docErr = ref("");

const loadDoc = async (docUrl) => {
  _resetDoc();
  Loading.show();
  try {
    console.log("Loading doc from ", docUrl);

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
  const parsedDoc = await _resolveJsonRef(docJson);
  doc.value = parsedDoc;
};

const getApiPaths = () => {
  const apiPaths = Object.keys(doc.value["paths"]);
  return apiPaths;
};

const getServerStr = () => {
  const serverStr = doc.value?.["servers"]?.[0]?.["url"] || doc.value?.["host"];
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
    docJson = yaml.load(docResponse);
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

export {
  loadDoc,
  doc,
  docErr,
  getApiPaths,
  getServerStr,
  getApiObjsByPath,
  getMethodListByPath,
};