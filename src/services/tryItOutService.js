import { ref } from "vue";

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

const contentType = ref(); //
const apiKey = ref(); //

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
          `Parameter ${param.name} is meant to send as a cookie which should be done at server side, we are not able to try this parameter in current try it out`
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

const setHeaders = (cntntType, _apiKey) => {
  console.log("setHeaders\n", cntntType, apiKey);
  contentType.value = null;
  if (cntntType) {
    contentType.value = cntntType;
  }
  if (_apiKey) {
    apiKey.value = _apiKey;
  } else {
    // TODO No API key provided, please authorize with api key
  }
};

const makeApiCall = (method) => {
  console.log("makeApiCall", method);
  console.log(
    method,
    "\n---\n",
    endpoint.value,
    "\n---\n",
    contentType.value,
    "\n---\n",
    apiKey.value,
    "\n---\n",
    reqBdyExamples.value,
    "\n---\n",
    queryStr.value
  );
  // TODO: format endpoint with pathRefObj
};

export {
  setEndpoint,
  setReqBdyExamples,
  setParamExamples,
  setHeaders,
  makeApiCall,
};
