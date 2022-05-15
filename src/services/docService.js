import { ref } from "vue";
import axios from "axios";
import yaml from "js-yaml";

const rawDoc = ref();
const doc = ref();

const loadDoc = async (docUrl) => {
  _resetDoc();

  try {
    console.log("Loading doc from ", docUrl);
    const loadDocResponse = await axios.get(docUrl);
    const docResponse = loadDocResponse.data;
    const docType = _getUrlType(docUrl);
    const docJson = _processDocResponse(docResponse, docType);
    initDoc(docJson);
  } catch (err) {
    _handleLoadDocError();
  }
};

const initDoc = (docJson) => {
  doc.value = JSON.parse(JSON.stringify(docJson));
  rawDoc.value = JSON.parse(JSON.stringify(docJson));
};

const _handleLoadDocError = () => {
  console.log("An error occured, doc failed load from provided url.");
};

const _resetDoc = () => {
  rawDoc.value = "";
  doc.value = "";
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

export { loadDoc, doc };
