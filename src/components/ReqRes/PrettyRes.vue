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
    <div v-if="response">
      <PrettyObjViewer :object="response.data" />
    </div>
    <div v-else>
      <p class="q-mt-md text-grey-6 text-center">
        No response to display yet. Please make a request.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

import PrettyObjViewer from "src/components/Viewers/PrettyObjViewer.vue";

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

const statusText = computed(() => {
  if (props.response?.statusText) {
    return props.response.statusText;
  } else {
    return "";
  }
});

const resContentType = computed(() => {
  if (props.response?.headers?.["content-type"]) {
    return props.response.headers["content-type"];
  } else {
    return "";
  }
});
</script>

<style lang="scss" scoped></style>
