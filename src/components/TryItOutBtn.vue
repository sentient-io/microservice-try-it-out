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

import { makeApiCall } from "src/services/tryItOutService";

const triggerTryItOut = () => {
  console.log("triggerTryItOut\n");

  makeApiCall(method.value);
};
</script>

<style lang="scss" scoped></style>
