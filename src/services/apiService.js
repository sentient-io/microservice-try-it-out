import { ref, watch } from "vue";

import { PATH_ITEM_OPERATION_OBJECT } from "src/consistents/openapiStructure";

import { deepCopy } from "src/services/utils";
import { setReqBdyExamples, setParamExamples } from "./tryItOutService";
import { initApiResponse } from "./apiCallService";

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
  requestBody.value = null;
  methods.value = null;
  method.value = null;
  parameters.value = null;
  contentTypes.value = null;
  contentType.value = null;
};

const setReqBdyExample = (bdyName, bdyExam) => {
  /**
   * When user change the request body fields, update
   * the user input value to the example value.
   */
  const content = requestBody.value["content"];
  const schema = content[contentType.value]["schema"];
  const reqProps = schema["properties"];

  // TODO this will loop each time function been called, not efficient
  for (const [k, v] of Object.entries(reqProps)) {
    if (k == bdyName) {
      v["example"] = bdyExam;
    }
  }
  _useSetReqBdyExamples();
};

const reqBdyExamplesToNull = () => {
  /**
   * This function will set all current
   * request body examples to null.
   */
  const content = requestBody.value["content"];
  const schema = content[contentType.value]["schema"];
  const reqProps = schema["properties"];
  for (const [k, v] of Object.entries(reqProps)) {
    v["example"] = null;
  }
};

const parametersExamplesToNull = () => {
  parameters.value.forEach((param) => {
    if (param["example"]) {
      param["example"] = null;
    }
  });
};

/**
 * !!Important!!
 * Potential issue, currently searching and updating
 * the params based on the name value.  If there are
 * multiple element has the same key  but applied to
 * different area,  e.g. one in the header the other
 * in the query. This will cause ERROR
 * TODO: Create saperate function for diff 'in' placement
 */
const setParamExample = (paramName, paramExam) => {
  parameters.value.forEach((param) => {
    if (param["name"] == paramName) {
      param["example"] = paramExam;
    }
  });

  _useSetParamExamples();
};

import { processReqBdy } from "./apiServiceProcessor";

const _setRequestBody = () => {
  console.log("_setRequestBody");
  requestBody.value = null;

  if (api.value["requestBody"]) {
    /**
     * Process request body to make the request body structure easier
     * for user to use. But bugs or errors may happend here.
     */

    // !! processedReqBdy is a deep copy from api !!
    const processedReqBdy = processReqBdy(api.value["requestBody"]);
    requestBody.value = processedReqBdy;

    /**
     * !! Debugging Instruction
     * to debug, enable the line below and disable everything
     * above.  Terminate processReqBdy completely to keep all
     * the original data structure from api
     */
    // requestBody.value = deepCopy(api.value["requestBody"])

    console.log(requestBody.value);
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

const _useSetReqBdyExamples = () => {
  // console.log("using setReqBdyExamples", requestBody.value);
  if (requestBody.value?.["content"]) {
    const reqBdyContent = requestBody.value["content"];
    const reqBdySchema = reqBdyContent?.[contentType.value]?.["schema"] || "";
    const reqBdyProps = reqBdySchema?.["properties"] || "";
    setReqBdyExamples(reqBdyProps);
  } else {
    setReqBdyExamples(null);
  }
};

const _useSetParamExamples = () => {
  // console.log("using setParamExamples", parameters.value);
  if (parameters.value) {
    setParamExamples(parameters.value);
  } else {
    setParamExamples(null);
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
    initApiResponse();
  }
});

watch(
  () => requestBody.value,
  () => {
    _useSetReqBdyExamples();
  }
);

watch(parameters, () => {
  _useSetParamExamples();
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
  setParamExample,
  setReqBdyExample,
  reqBdyExamplesToNull,
  parametersExamplesToNull,
};
