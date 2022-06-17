<template>
  <div style="border: 1px solid #efefef" class="q-pa-sm">
    <div class="row items-center justify-between q-col-gutter-md no-wrap">
      <p class="col-5 q-my-none" style="font-size: 14px">
        Upload a file to extract the file information automatically.
        Alternativelty you can manually input the file detail from below input
        fields.
      </p>

      <div class="row col-7 no-wrap-md justify-center q-gutter-md items-center">
        <div class="column full-width">
          <q-file
            class="full-width"
            dense
            outlined
            v-model="userInputFile"
            label="Click to upload a file"
            @update:model-value="extractFileDetail()"
          />
          <!-- <div class="q-pa-xs" v-if="Object.keys(fileDetail)[0]">
            <small><b>File detail: </b>{{ fileDetail }}</small>
          </div> -->
        </div>
        <!-- <div>
          <q-btn
            color="beige-6"
            style="min-width: 10rem"
            outline
            no-caps
            label="Extract File Details"
          />
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useQuasar } from "quasar";

import { setLargeFile } from "src/services/largeFileService.js";

const $q = useQuasar();
const emit = defineEmits(["updateRequestBody"]);

const userInputFile = ref();

const fileDetail = computed(() => {
  const extractedDetail = {};
  if (userInputFile.value) {
    const theFile = userInputFile.value;
    extractedDetail["file_name"] = theFile.name;
    extractedDetail["file_size"] = theFile.size;
    extractedDetail["content_type"] = theFile.type;
  }
  return extractedDetail;
});

const extractFileDetail = () => {
  if (fileDetail.value) {
    for (const [k, v] of Object.entries(fileDetail.value)) {
      emit("updateRequestBody", k, v);
    }

    setLargeFile(userInputFile.value);

    $q.notify(`File details been applied to the Request Body.`);
  }
};

onMounted(() => {
  setLargeFile(null);
});
</script>

<style lang="scss" scoped></style>
