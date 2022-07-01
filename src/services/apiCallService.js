import { ref } from "vue";
import * as axios from "boot/axios";
import { Loading } from "quasar";
import { debugMode } from "./appService";

const apiResponse = ref();

const apiReport = ref({});

const initApiResponse = () => {
  apiResponse.value = null;
  apiReport.value = {};
};

const _catchErr = (err) => {
  if (err.response) {
    setApiResponse(err.response);
    console.error(err.response);
  } else {
    // Possible due to invalid endpoint string
    setApiResponse(String(err));
    console.error(err);
  }
};

const _handelRes = (res) => {
  setApiResponse(res);
  // Do not disable below console log
  console.log("Api Call Response\n", res);
};

const postCall = (args) => {
  // console.log("postCall");
  Loading.show();
  initApiResponse();
  const headers = { headers: args.headers };
  const startTime = Date.now();
  axios.api
    .post(args.endpoint, args.data, headers)
    .then((res) => {
      _handelRes(res);
    })
    .catch((err) => {
      _catchErr(err);
    })
    .finally(() => {
      setApiReport(startTime, args.endpoint, args.data, headers);
      Loading.hide();
    });
};

const getCall = (args) => {
  // console.log("getCall");
  Loading.show();
  initApiResponse();
  const headers = { headers: args.headers };
  const startTime = Date.now();
  axios.api
    .get(args.endpoint, headers)
    .then((res) => {
      _handelRes(res);
    })
    .catch((err) => {
      _catchErr(err);
    })
    .finally(() => {
      setApiReport(startTime, args.endpoint, "", headers);
      Loading.hide();
    });
};

const setApiReport = (startTime, endpoint, reqBdy, headers) => {
  // console.log('setApiReport')
  const stopTime = Date.now();
  let requestBodyStr = "";
  try {
    requestBodyStr = JSON.stringify(reqBdy);
  } catch (err) {}
  apiReport.value["Ednpoint"] = endpoint;
  apiReport.value["Headers"] = headers;
  apiReport.value["Request Body"] = requestBodyStr;
  apiReport.value["Response Time"] = `${stopTime - startTime} ms`;

  // Debug
  if (debugMode.value) console.log("API Report\n", apiReport.value);
};

const setApiResponse = (res) => {
  apiResponse.value = res;
};

export { postCall, getCall, apiResponse, apiReport, initApiResponse };
