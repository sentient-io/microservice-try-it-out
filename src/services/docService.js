import { ref } from "vue";
import axios from "axios";
import yaml from "js-yaml";

const rawDoc = ref();
const doc = ref();

const loadDoc = async (docUrl) => {
  console.log("Loading doc from ", docUrl);

  const loadDocResponse = await axios.get(docUrl);

  const docType = getUrlType(docUrl);
  console.log("Doc Url Type: ", docType);

  const docStr = loadDocResponse.data;

  let docJson;
  if (docType == "yaml" || docType == "yml") {
    docJson = yaml.load(docStr);
  } else if (typeof docStr == "string") {
    docJson = JSON.parse(docStr);
  } else {
    docJson = docStr;
  }
  initDoc(docJson);
};

const initDoc = (docJson) => {
  console.log("Init doc");
  doc.value = JSON.parse(JSON.stringify(docJson));
  rawDoc.value = JSON.parse(JSON.stringify(docJson));
};

const getUrlType = (url) => {
  return url.match(/.*\.(.*)$/)[1];
};

export { loadDoc, doc };
