import { ref } from "vue";
import * as axios from "boot/axios";
import { Loading, Notify } from "quasar";
import { debugMode } from "./appService";

const apiResponse = ref();

const apiReport = ref({});

const initApiResponse = () => {
  apiResponse.value = null;
  apiReport.value = {};
};

const _catchErr = (err) => {
  if (err.response) {
    console.error(err.response);

    if (!err.response?.["data"]?.["message"]) {
      console.warn(
        "Uncatched error message from api call error response: \n",
        err,
        "\nPlease check api response error message data structure. "
      );
    }

    __nofityError(err.response?.["data"]?.["message"] || "API Call Error");

    setApiResponse(err.response);
  } else {
    // Possible due to invalid endpoint string
    setApiResponse(String(err));
    __nofityError(String(err));
    console.error(err, "\nThis is likely caused by bad endpoint.");
  }
};

const __nofityError = (err) => {
  Notify.create({
    type: "negative",
    message: err.toString(),
    timeout: 0,
    actions: [
      {
        label: "Dismiss",
        color: "white",
        handler: () => {
          /* ... */
        },
      },
    ],
  });
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
