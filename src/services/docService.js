import { ref } from "vue";
import axios from "axios";
import yaml from "js-yaml";
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
    const docJson = _processDocResponse(docResponse, docType);
    initDoc(docJson);
  } catch (err) {
    _handleLoadDocError(docUrl);
  }
  Loading.hide();
};

const initDoc = (docJson) => {
  /**
   * Initiate valid documentation object. Also keep an copy
   * as rawDoc ,  this rawDoc should not expose to anywhere
   * outside of this file.   It is used to reset user inout
   */
  doc.value = JSON.parse(JSON.stringify(docJson));
  rawDoc.value = JSON.parse(JSON.stringify(docJson));
};

const getPathsList = () => {
  const pathsList = Object.keys(doc.value["paths"]);
  return pathsList;
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

export {
  loadDoc,
  doc,
  docErr,
  getPathsList,
  getServerStr,
  getApiObjsByPath,
  getMethodListByPath,
};
