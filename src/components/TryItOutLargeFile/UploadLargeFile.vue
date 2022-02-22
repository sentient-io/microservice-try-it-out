<template>
  <div>
    Upload Large File

    <q-file
      v-model="file"
      label="Upload"
      @update:model-value="
        (value) => {
          handleFile(value);
        }
      "
    />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import largeFileService from 'src/services/LargeFile/largeFileService';

const { processFile } = largeFileService();

export default defineComponent({
  setup() {
    const file = ref();

    function handleFile(fileObj) {
      processFile(fileObj);
    }

    return { file, handleFile };
  },
});
</script>

<style lang="scss" scoped></style>
