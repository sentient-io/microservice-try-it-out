import { ref, computed } from "vue";

import { api, contentType, method } from "src/services/apiService";
import { apiKey } from "src/services/apiKeyService";
import { securitySchemes } from "src/services/docService";

import { postCall, getCall } from "./apiCallService";
import { debugMode } from "./appService";

const endpoint = ref();

const reqBdyExamples = ref();

/**
 * Reference :
 * https://swagger.io/specification/#parameter-object
 */

const queryParamObj = ref({}); // Params for query in an obj

const headerParamObj = ref(); //// Parameter in header
// const headerParamObj = ref(); // Parameter in header
const pathParamObj = ref(); // Parameter in path
const cookie = ref(); // Don't know how to use yet

const queryStrArr = computed(() => {
  // Form an array of queryStr Parts from queryParamObj
  const theQuertStrArr = [];
  if (!queryParamObj.value) return [];
  for (let [k, v] of Object.entries(queryParamObj.value)) {
    const queryStrPart = encodeURIComponent(k) + "=" + encodeURIComponent(v);
    theQuertStrArr.push(queryStrPart);
  }
  return theQuertStrArr;
});

const queryStr = computed(() => {
  return queryStrArr.value.join("&");
}); // Actual query str

const setEndpoint = (server, path) => {
  // console.log("tryItOutService setEndpoint", server, path);
  endpoint.value = server + path;
};

const setReqBdyExamples = (reqBdyProps = null) => {
  // console.log("setReqBdyExamples\n", reqBdyProps);
  reqBdyExamples.value = {};
  if (reqBdyProps) {
    for (const [k, v] of Object.entries(reqBdyProps)) {
      const invalidVals = [null, undefined];
      if (!invalidVals.includes(v["example"]))
        reqBdyExamples.value[k] = v["example"];
    }
  } else {
    reqBdyExamples.value = null;
  }
};

const setParamExamples = (params = null) => {
  // console.log("setParamExamples\n", params);
  resetParamExamples();
  if (params == null) return;
  params.forEach((param) => {
    // console.log(param);
    switch (param["in"]) {
      case "header":
        checkheaderParamObj();
        headerParamObj.value[param["name"]] = param["example"];
        break;
      case "path":
        checkpathParamObj();
        pathParamObj.value[param["name"]] = param["example"];
        break;
      case "cookie":
        console.warn(
          `Parameter ${param.name} is meant to send as a cookie, which should be done at server side, we are not able to try this parameter in current try it out`
        );
        break;
      case "query":
        checkQueryParamObj();
        _setQueryParamElem(param);
        // console.log("queryParamObj", queryParamObj.value);
        // queryStrArr.value.push(getQueryStr(param));
        break;
      default:
        console.warn(
          `Parameter ${param.name} doesn't contain 'in' fields, invalid parameter documentation, please refer to https://swagger.io/specification/#parameter-object`
        );
    }
  });

  // console.log(queryStr.value, headerParamObj.value, pathParamObj.value);
};

const resetParamExamples = () => {
  queryParamObj.value = null;
  headerParamObj.value = null;
  pathParamObj.value = null;
  cookie.value = null;
};

const checkpathParamObj = () => {
  if (!pathParamObj.value) {
    pathParamObj.value = {};
  }
};

const checkheaderParamObj = () => {
  if (!headerParamObj.value) {
    headerParamObj.value = {};
  }
};

const checkQueryParamObj = () => {
  /**
   * Check if queryStrArr already exist, if not
   * create empty array
   */
  if (!queryParamObj.value) {
    queryParamObj.value = {};
  }
};

const _setQueryParamElem = (param) => {
  // console.log("setQueryParamElem");
  const paramName = param["name"];
  const paramVal = param["example"];
  if (paramVal !== null) {
    queryParamObj.value[paramName] = paramVal;
  }
  // console.log(paramName, paramVal, param);
};

const getHeaders = () => {
  // console.log("getHeaders");
  const headers = {};

  // api.security will override the global securitySchemes
  const securityScheme = api.value?.["security"];

  // Set api key field
  if (securityScheme) {
    Object.values(securityScheme).forEach((scheme) => {
      try {
        const schemeElemKey = Object.keys(scheme)[0];
        const schemeElem = securitySchemes.value[schemeElemKey];
        const authKeyName = schemeElem["name"];
        headers[authKeyName] = apiKey.value;
      } catch (err) {
        console.error(err);
      }
    });
  }

  /**
   * Set content type field
   * For multipart/form-data, DO NOT set the Request Header, else will
   * keep getting error. Refer to :
   * https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects
   */
  headers["content-type"] = contentType.value;
  // if (contentType.value !== "multipart/form-data") {
  //   headers["content-type"] = contentType.value;
  // }

  return headers;
};

const setReqBdyExamplesObj = (reqBdyEgObj) => {
  reqBdyExamples.value = reqBdyEgObj;
};

const setQueryParamObj = (newQueryParam) => {
  queryParamObj.value = newQueryParam;
};

const getEndpint = () => {
  if (api.value?.["servers"]?.[0]) {
    try {
      let overrideServerUrl = api.value["servers"][0]["url"];
      console.warn(
        "Server url overriding. For trying out purpose, the path is NOT applied to the endpoint, however, this is not follow OAS3.0, refer to: https://swagger.io/specification/#server-object and https://swagger.io/specification/#operation-object"
      );
      // overrideServerUrl = "https://lp_user_space_prod.storage.googleapis.com/";
      return overrideServerUrl;
    } catch (err) {
      console.error("Server item in api element contains error.");
    }
  }
  return endpoint.value;
};

const getArgs = () => {
  const args = {};
  args.endpoint = getEndpint();
  if (queryStr.value) {
    args.endpoint = args.endpoint + "?" + queryStr.value;
  }
  // TODO handle header param and path param input

  // Handle "multipart/form-data", file input
  if (contentType.value == "multipart/form-data") {
    const formData = new FormData();
    let HARD_CODED_FILE = null;
    for (const [k, v] of Object.entries(reqBdyExamples.value)) {
      if (k == "file") {
        console.warn(
          "IMPORTANT, the order of binary file have been moved to the last element in the Form data. Else will cause unknown error."
        );
        HARD_CODED_FILE = v;
      } else if (k == "content-type") {
        console.warn(
          "IMPORTANT, Hard coded 'content-type' in to 'Content-Type' or prevent some google error. This is for TESTING only."
        );
        const HARD_CODED_CONTENT_TYPE = "Content-Type";
        formData.append(HARD_CODED_CONTENT_TYPE, v);
      } else {
        formData.append(k, v);
      }
    }

    if (HARD_CODED_FILE) {
      formData.append("file", HARD_CODED_FILE);
    }

    args.data = formData;
  } else {
    args.data = reqBdyExamples.value;
  }

  args.headers = getHeaders();
  return args;
};

const makeApiCall = () => {
  const _method = method.value;

  const args = getArgs();

  const dividerRepeat = 60;

  if (debugMode.value) {
    console.log(`Making ${_method} api call.`);
    console.log("=".repeat(dividerRepeat) + "\n");
    console.log("-".repeat(dividerRepeat) + "\n");
    for (const [k, v] of Object.entries(args)) {
      console.log(k + ":\n", v);
      console.log("-".repeat(dividerRepeat) + "\n");
    }
    console.log("=".repeat(dividerRepeat) + "\n");
  }

  // TODO: Currently only supporting get and post method

  switch (_method) {
    case "get":
      getCall(args);
      break;
    case "post":
    default:
      postCall(args);
  }
};

export {
  endpoint,
  queryStr,
  pathParamObj,
  queryParamObj,
  headerParamObj,
  reqBdyExamples,
  getArgs,
  setEndpoint,
  makeApiCall,
  setQueryParamObj,
  setParamExamples,
  setReqBdyExamples,
  setReqBdyExamplesObj,
};
