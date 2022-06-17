import { ref } from "vue";
import * as axios from "boot/axios";
import { Loading } from "quasar";

const apiResponse = ref();

const initApiResponse = () => {
  apiResponse.value = null;
};

const _catchErr = (err) => {
  if (err.response) {
    setApiResponse(err.response);
    console.log(err.response);
  } else {
    // Possible due to invalid endpoint string
    setApiResponse(String(err));
    console.log(err);
  }
};

const _handelRes = (res) => {
  setApiResponse(res);
  console.log("Api Call Response\n", res);
};

const postCall = (args) => {
  console.log("postCall");
  Loading.show();
  initApiResponse();
  const headers = { headers: args.headers };
  axios.api
    .post(args.endpoint, args.data, headers)
    .then((res) => {
      _handelRes(res);
    })
    .catch((err) => {
      _catchErr(err);
    })
    .finally(() => {
      Loading.hide();
    });
};

const getCall = (args) => {
  console.log("getCall");
  Loading.show();
  initApiResponse();
  const headers = { headers: args.headers };
  axios.api
    .get(args.endpoint, headers)
    .then((res) => {
      _handelRes(res);
    })
    .catch((err) => {
      _catchErr(err);
    })
    .finally(() => {
      Loading.hide();
    });
};

const setApiResponse = (res) => {
  apiResponse.value = res;
};

export { postCall, getCall, apiResponse, initApiResponse };
