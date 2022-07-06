<template>
  <div style="border: 1px solid #efefef" class="q-pa-sm">
    <div class="row items-center justify-between q-col-gutter-md no-wrap">
      <p style="font-size: 14px; min-width: 120px" class="q-my-none">
        File to upload:
      </p>

      <div class="row full-width no-wrap items-center q-gutter-md">
        <q-file
          class="full-width"
          dense
          outlined
          v-model="userInputFile"
          label="Click to upload a file"
          @update:model-value="extractFileDetail()"
        />
        <q-icon name="help_outline" color="grey-6" size="xs">
          <q-tooltip>
            <p class="q-my-none" style="max-width: 400px">
              Upload a file to extract the file information automatically.
              Alternativelty you can manually input the file detail from below
              input fields.
            </p>
          </q-tooltip>
        </q-icon>
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
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useQuasar } from "quasar";

import { setReqBdyExample } from "src/services/apiService";

import { setLargeFile } from "src/services/largeFileService.js";

const $q = useQuasar();

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
      setReqBdyExample(k, v);
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
