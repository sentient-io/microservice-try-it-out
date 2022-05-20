import { ref } from "vue";

import { PATH_ITEM_OPERATION_OBJECT } from "src/consistents/openapiStructure";

// Apis are all the details inside the path
const apis = ref();

// An api is the detail under single method
const api = ref();

const methods = ref();
const method = ref();

const setApis = (apiObjs) => {
  apis.value = apiObjs;

  methods.value = _getApiObjsMethods(apiObjs);
  method.value = methods.value[0];

  setApiByMethod(method.value);
};

const _getApiObjsMethods = (apiObjs) => {
  /**
   * Because no all child in apiObject are methods,
   * there are also summary, description etc.
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
  api.value = apis.value[method];
};

const setMethod = (meth) => {
  method.value = meth;

  setApiByMethod(method.value);
};

const initApis = () => {
  apis.value = null;
  api.value = null;
};

export { apis, api, methods, setApis, initApis, setMethod };
