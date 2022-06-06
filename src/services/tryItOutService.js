import { ref } from "vue";

import { contentType } from "src/services/apiService";
import { apiKey } from "src/services/apiKeyService";
import { securitySchemes } from "src/services/docService";

import { postCall, getCall } from "./apiCallService";

const endpoint = ref();

const reqBdyExamples = ref();

/**
 * Reference :
 * https://swagger.io/specification/#parameter-object
 */
const queryStrArr = ref(); // Params for querty in arr
const queryStr = ref(); // Actual query str
const headerRefObj = ref(); // Parameter in header
const pathRefObj = ref(); // Parameter in path
const cookie = ref(); // Don't know how to use yet

const setEndpoint = (server, path) => {
  // console.log("tryItOutService setEndpoint", server, path);
  endpoint.value = server + path;
};

const setReqBdyExamples = (reqBdyProps = null) => {
  // console.log("setReqBdyExamples\n", reqBdyProps);
  reqBdyExamples.value = {};
  if (reqBdyProps) {
    for (const [k, v] of Object.entries(reqBdyProps)) {
      const invalidVals = ["", null, undefined];
      if (!invalidVals.includes(v["example"]))
        reqBdyExamples.value[k] = v["example"];
    }
  } else {
    reqBdyExamples.value = null;
  }
};

const setParamExamples = (params) => {
  // console.log("setParamExamples\n", params);
  resetParamExamples();
  if (!params) return;
  params.forEach((param) => {
    console.log(param);
    switch (param["in"]) {
      case "header":
        checkHeaderRefObj();
        headerRefObj.value[param["name"]] = param["example"];
        break;
      case "path":
        checkPathRefObj();
        pathRefObj.value[param["name"]] = param["example"];
        break;
      case "cookie":
        console.warn(
          `Parameter ${param.name} is meant to send as a cookie, which should be done at server side, we are not able to try this parameter in current try it out`
        );
        break;
      case "query":
        checkQueryStrArr();
        queryStrArr.value.push(getQueryStr(param));
        break;
      default:
        console.warn(
          `Parameter ${param.name} doesn't contain 'in' fields, invalid parameter documentation, please refer to https://swagger.io/specification/#parameter-object`
        );
    }
  });
  joinQueryArr();
  // console.log(queryStr.value, headerRefObj.value, pathRefObj.value);
};

const resetParamExamples = () => {
  queryStrArr.value = null;
  queryStr.value = null;
  headerRefObj.value = null;
  pathRefObj.value = null;
  cookie.value = null;
};

const checkPathRefObj = () => {
  if (!pathRefObj.value) {
    pathRefObj.value = {};
  }
};

const checkHeaderRefObj = () => {
  if (!headerRefObj.value) {
    headerRefObj.value = {};
  }
};

const checkQueryStrArr = () => {
  /**
   * Check if queryStrArr already exist, if not
   * create empty array
   */
  if (!queryStrArr.value) {
    queryStrArr.value = [];
  }
};

const joinQueryArr = () => {
  // Form query string from an array
  if (queryStrArr.value) {
    queryStr.value = queryStrArr.value.join("&");
    console.log(queryStr.value);
  }
};

const getQueryStr = (param) => {
  const queryStrPart =
    encodeURIComponent(param["name"]) +
    "=" +
    encodeURIComponent(param["example"]);
  return queryStrPart;
};

const getHeaders = () => {
  console.log("getHeaders");
  const headers = {};

  // Set api key field
  if (securitySchemes.value) {
    Object.values(securitySchemes.value).forEach((scheme) => {
      if (scheme["in"] == "header" && scheme["type"] == "apiKey") {
        const authKeyName = scheme["name"];
        headers[authKeyName] = apiKey.value;
      }
    });
  }

  /**
   * Set content type field
   * For multipart/form-data, DO NOT set the Request Header, else will
   * keep getting error. Refer to :
   * https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects
   */
  if (contentType.value !== "multipart/form-data") {
    headers["content-type"] = contentType.value;
  }

  return headers;
};

const getArgs = () => {
  const args = {};
  args.endpoint = endpoint.value;
  if (queryStr.value) {
    args.endpoint + "?" + queryStr.value;
  }

  args.data = reqBdyExamples.value;
  args.headers = getHeaders();
  return args;
};

const makeApiCall = (method) => {
  console.log("makeApiCall", method);

  const args = getArgs();

  const repeat = 60;
  console.log("=".repeat(repeat) + "\n");
  console.log("-".repeat(repeat) + "\n");
  for (const [k, v] of Object.entries(args)) {
    console.log(k + ":\n", v);
    console.log("-".repeat(repeat) + "\n");
  }
  console.log("=".repeat(repeat) + "\n");

  // TODO: Currently only supporting get and post method
  switch (method) {
    case "get":
      getCall(args);
      break;
    case "post":
    default:
      postCall(args);
  }
};

export { setEndpoint, makeApiCall, setParamExamples, setReqBdyExamples };
