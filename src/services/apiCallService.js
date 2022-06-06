import { ref } from "vue";
import { api } from "boot/axios";
import { Loading } from "quasar";

const apiResponse = ref();

const init = () => {
  apiResponse.value = null;
};

const postCall = (args) => {
  console.log("postCall");
  Loading.show();
  init();
  const headers = { headers: args.headers };
  api
    .post(args.endpoint, args.data, headers)
    .then((res) => {
      setApiResponse(res);
      console.log(res);
    })
    .finally(() => {
      Loading.hide();
    });
};

const getCall = (args) => {
  console.log("getCall");
  Loading.show();
  init();
  const headers = { headers: args.headers };
  api
    .get(args.endpoint, headers)
    .then((res) => {
      console.log(res);
      setApiResponse(res);
    })
    .finally(() => {
      Loading.hide();
    });
};

const setApiResponse = (res) => {
  apiResponse.value = res;
};

export { postCall, getCall, apiResponse };
