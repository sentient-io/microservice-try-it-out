<template>
  <div>
    <q-btn
      no-caps
      size="1.1rem"
      color="green-6"
      label="Try It Out"
      style="font-weight: bold"
      @click="triggerTryItOut()"
    />
  </div>
</template>

<script setup>
import {
  requestBody,
  api,
  method,
  contentType,
  parameters,
} from "src/services/apiService";

import {
  setReqBdyExamples,
  setParamExamples,
  makeApiCall,
} from "src/services/tryItOutService";

const triggerTryItOut = () => {
  // console.log("triggerTryItOut\n");
  if (requestBody.value?.["content"]) {
    const reqBdyContent = requestBody.value["content"];
    const reqBdySchema = reqBdyContent?.[contentType.value]?.["schema"] || "";
    const reqBdyProps = reqBdySchema?.["properties"] || "";
    setReqBdyExamples(reqBdyProps);
  } else {
    setReqBdyExamples();
  }
  setParamExamples(parameters.value);
  makeApiCall(method.value);
};
</script>

<style lang="scss" scoped></style>
