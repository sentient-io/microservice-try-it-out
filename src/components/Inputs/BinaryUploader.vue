<template>
  <div>
    <h6 class="q-mb-md q-mt-sm">Upload file as base64</h6>
    <div
      v-if="fileUrl"
      class="q-mx-auto row justify-center"
      style="max-width: 400px"
    >
      <img
        class="fit"
        :src="fileUrl"
        v-if="fileType.includes('image')"
        style="border: 5px solid rgba(155, 155, 155, 0.5)"
      />
      <video
        controls
        class="fit"
        :src="base64"
        v-else-if="fileType.includes('video')"
        style="border: 5px solid rgba(155, 155, 155, 0.5)"
      ></video>
      <audio
        controls
        v-else-if="fileType.includes('audio')"
        :src="base64"
      ></audio>
      <p v-else></p>
    </div>
    <q-file
      class="full-width q-py-md"
      outlined
      v-model="file"
      label="Choose file to upload as base64"
      @update:model-value="handleFileUpload()"
    />
    <div class="row justify-center q-gutter-lg">
      <q-btn no-caps label="Cancel" flat @click="emitCancel()" />
      <q-btn
        flat
        no-caps
        color="white"
        label="Upload"
        class="bg-primary"
        :disable="!base64"
        @click="emitUpdate()"
      />
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";

import { ref } from "vue";

const $q = useQuasar();

const file = ref();
const fileName = ref();
const fileType = ref();

const fileUrl = ref();
const base64 = ref();

const emit = defineEmits(["cancel", "update"]);

const getBase64 = () => {
  console.log("getBase64\n");

  const reader = new FileReader();
  reader.readAsDataURL(file.value);
  reader.onload = () => {
    // console.log(reader.result);
    base64.value = reader.result;
  };
};

const getFileDetail = () => {
  fileUrl.value = URL.createObjectURL(file.value);
  fileName.value = file.value.name;
  fileType.value = file.value.type;
};

const handleFileUpload = () => {
  getBase64();
  getFileDetail();
};

const emitCancel = () => {
  emit("cancel");
};

const emitUpdate = () => {
  emit("update", base64.value);

  $q.notify(`File ${fileName.value} been uploaded as base64 string.`);
};
</script>

<style lang="scss" scoped></style>
