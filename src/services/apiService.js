import { reactive, ref, watch } from "vue";

import { PATH_ITEM_OPERATION_OBJECT } from "src/consistents/openapiStructure";

import { deepCopy } from "src/services/utils";

// Apis are all the details inside the path
const apis = ref();

// An api is the detail under single method
const api = ref();

const methods = ref();
const method = ref();

/**
 * requstBody and parameters can appear together
 */

// The request body values (usually for put and post)
const requestBody = ref();

// The value that goes to the url
const parameters = ref();

const contentTypes = ref();
const contentType = ref();

const setApis = (apiObjs) => {
  // console.log("setApis", apiObjs);
  apis.value = apiObjs;

  methods.value = _getApiObjsMethods(apiObjs);
  method.value = methods.value[0];

  // Set the first api as the default
  setApiByMethod(method.value);
};

const _getApiObjsMethods = (apiObjs) => {
  /**
   * Because not all child in apiObject are methods, there
   * are also summary, description etc. to be filter out.
   */
  const methodsList = [];
  Object.keys(apiObjs).forEach((e) => {
    if (PATH_ITEM_OPERATION_OBJECT.includes(e)) {
      methodsList.push(e);
    }
  });

  return methodsList;
};

const setApiByMethod = (method) => {
  // console.log("setApiByMethod\n", method);
  api.value = apis.value[method];
};

const setMethod = (meth) => {
  method.value = meth;

  setApiByMethod(method.value);
};

const setContentType = (contType) => {
  contentType.value = contType;
};

const initApis = () => {
  apis.value = null;
  api.value = null;
};

const setReqBdyExample = (bdyName, bdyExam) => {
  /**
   * When user change the request body fields, update
   * the user input value to the example value.
   */
  const content = requestBody.value["content"];
  const schema = content[contentType.value]["schema"];
  const reqProps = schema["properties"];

  for (const [k, v] of Object.entries(reqProps)) {
    if (k == bdyName) {
      v["example"] = bdyExam;
    }
  }
};

const setParamExample = (paramName, paramExam) => {
  parameters.value.forEach((param) => {
    if (param["name"] == paramName) {
      param["example"] = paramExam;
    }
  });
};

const _setRequestBody = () => {
  // console.log("getRequestBody");
  requestBody.value = null;

  if (api.value["requestBody"]) {
    // console.log("Deep copy request body value to make it reactive");
    requestBody.value = deepCopy(api.value["requestBody"]);
  }
};

const _getContentTypes = () => {
  // console.log("getContentTypes\n", requestBody.value);
  contentTypes.value = null;
  contentType.value = null;

  let contTypes = "";
  if (requestBody.value) {
    contTypes = Object.keys(requestBody.value["content"]);
    contentTypes.value = contTypes;
    contentType.value = contTypes[0];
  }
};

const _setParameters = () => {
  parameters.value = null;
  if (api.value["parameters"]) {
    parameters.value = deepCopy(api.value["parameters"]);
  }
};

watch(api, () => {
  // console.log("Watching api change");
  // console.log(api.value);
  if (api.value) {
    // console.log("Api value has changed");

    _setRequestBody();
    _setParameters();
    _getContentTypes();
  }
});

export {
  apis,
  api,
  methods,
  method,
  contentTypes,
  contentType,
  requestBody,
  parameters,
  setApis,
  initApis,
  setMethod,
  setContentType,
  setReqBdyExample,
  setParamExample,
};
