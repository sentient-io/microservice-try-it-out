<template>
  <div v-if="method?.toLowerCase() == 'get' && !queryParams">
    <h5>Parameters</h5>
    <p>No Parameter required</p>
  </div>

  <div v-if="queryParams">
    <div class="row q-gutter-md no-wrap">
      <div class="col-6 column justify-between">
        <div>
          <h5>Query Parameters</h5>
          <p class="text-grey-8">
            These are parameters that will be used in the query part of request
            URL. Formated in JSON.
          </p>
        </div>
        <ObjectInput
          :object="queryParams"
          display-style="max-height:50vh; height:220px"
          @update="(newQueryParam) => handleUpdateQueryParams(newQueryParam)"
        />
      </div>
      <div class="col-6 column justify-between">
        <div>
          <h5>Query String Preview</h5>
          <p class="text-grey-8">
            The foramtted query string that will be attach to the request URL.
          </p>
        </div>
        <div class="query_str_preview_area full-width bg-grey-2">
          <pre class="q-ma-none">{{ queryString }}</pre>
        </div>
      </div>
    </div>
  </div>

  <div v-if="reqBdyExamples">
    <div class="row items-center justify-between">
      <h5>Request body</h5>
      <div v-if="contentType">
        Content Type: <b>{{ contentType }}</b>
      </div>
    </div>
    <ObjectInput
      :object="reqBdyExamples"
      display-style="max-height:50vh"
      @update="(newReqBdy) => handleUpdateReqBdy(newReqBdy)"
    />
  </div>
</template>

<script setup>
import ObjectInput from "src/components/Inputs/ObjectInput.vue";

const props = defineProps({
  reqBdyExamples: {},
  queryParams: {},
  method: {},
  queryString: {},
  contentType: {},
});

const emit = defineEmits(["updateRequestBody", "updateQueryParams"]);

const handleUpdateReqBdy = (newReqBdy) => {
  // console.log("handleUpdateReqBdy", newReqBdy);
  emit("updateRequestBody", newReqBdy);
};

const handleUpdateQueryParams = (newQueryParam) => {
  emit("updateQueryParams", newQueryParam);
};
</script>

<style lang="scss" scoped>
h5 {
  margin: 1rem 0px;
}

.query_str_preview_area {
  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 4px;
  height: 220px;
  padding: 0.7rem;
  overflow-y: auto;
  cursor: not-allowed;
}

.query_str_preview_area pre {
  white-space: pre-wrap;
  max-width: 1200px;
  line-break: anywhere;
  font-size: 0.8rem;
  border: 1px solid rgba(0, 0, 0, 0);
}
</style>
