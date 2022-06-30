<template>
  <div>
    <q-btn
      no-caps
      size="1.1rem"
      color="green-6"
      :label="label"
      style="font-weight: bold"
      @click="triggerTryItOut()"
    />
  </div>
</template>

<script setup>
import {
  api,
  parameters,
  contentType,
  requestBody,
} from "src/services/apiService";

import { makeApiCall } from "src/services/tryItOutService";

const props = defineProps({
  label: { type: String, default: "Try It Out" },
});

const triggerTryItOut = () => {
  console.log("triggerTryItOut\n");

  makeApiCall();
};
</script>

<style lang="scss" scoped></style>
