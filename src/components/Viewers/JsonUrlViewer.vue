<template>
  <div>
    <div class="row justify-between q-mb-sm">
      <div class="row items-center">
        <b>Pretty Response</b>
        <q-toggle
          size="2rem"
          color="green-7"
          class="state-toggle"
          v-model="isRawResponse"
        />
        <b>Raw Response</b>
      </div>

      <!-- Expand all nested pretty response -->
      <div v-if="!isRawResponse">
        <q-checkbox
          size="2rem"
          v-model="prettyResExpandAll"
          label="Expand All"
        />
      </div>
    </div>
    <RawRes v-if="isRawResponse" :response="jsonRes" />
    <PrettyRes v-else :response="jsonRes" />
    <ApiResReport />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { api } from "boot/axios";

import PrettyRes from "src/components/ReqRes/PrettyRes.vue";
import RawRes from "src/components/ReqRes/RawRes.vue";

import { prettyResExpandAll } from "src/services/appService";

const props = defineProps({
  url: { required: true },
});

const isRawResponse = ref(false);

const jsonRes = ref();

onMounted(() => {
  // console.log("JsonUrlViewer Mounted");
  api
    .get(props.url)
    .then((res) => {
      jsonRes.value = res;
    })
    .catch((err) => {
      /**
       * Large file get api call response is xml format, current try
       * it out is not capable for processing xml response.Hardcoded
       * this part to temporarily hanlde the error.
       *
       * TODO: Handle the get api call error response properly
       */
      jsonRes.value = "Error, URL expired or invalid URL";
    });
});
</script>

<style lang="scss" scoped></style>
