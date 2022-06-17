<template>
  <div>
    <div class="row justify-between q-gutter-md q-mb-sm">
      <div v-if="status">
        Status: <b>{{ status }} </b>
        <span v-show="statusText">- ({{ statusText }})</span>
      </div>
      <div v-if="resContentType">
        Content Type: <b>{{ resContentType }}</b>
      </div>
    </div>
    <!-- Preview media -->
    <div
      v-if="guessedMediaBase64[0]"
    class="full-width row justify-center q-py-md"
    >
      <Base64Viewer :base64str="guessedMediaBase64[0]" />
    </div>
    <div v-if="response">
      <PrettyObjViewer
        :object="response?.data || response"
        @guessed-media="(guessedBase64) => setGuessedMediaBase64(guessedBase64)"
      />
    </div>
    <div v-else>
      <p class="q-mt-md text-grey-6 text-center">
        No response to display yet. Please make a request.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

import PrettyObjViewer from "src/components/Viewers/PrettyObjViewer.vue";
import Base64Viewer from "src/components/Viewers/Base64Viewer.vue";

const props = defineProps({
  response: {},
});

const status = computed(() => {
  if (props.response?.status) {
    return props.response.status;
  } else {
    return "";
  }
});

// This will try to get the media content and dislay as preview
const guessedMediaBase64 = ref([]);

const statusText = computed(() => {
  if (props.response?.statusText) {
    return props.response.statusText;
  } else {
    return "";
  }
});

const setGuessedMediaBase64 = (mediaBase64) => {
  guessedMediaBase64.value.push(mediaBase64);
  if (guessedMediaBase64.value.length > 1) {
    console.warn(
      "Detected more than 1 possible base64 media returned from the response. Only the 1st detected base64 media will be displayed."
    );
  }
};

const resContentType = computed(() => {
  if (props.response?.headers?.["content-type"]) {
    return props.response.headers["content-type"];
  } else {
    return "";
  }
});

const init = () => {
  guessedMediaBase64.value = [];
};

watch(props.response, () => {
  init();
});
</script>

<style lang="scss" scoped></style>
