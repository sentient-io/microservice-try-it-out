<template>
  <div>
    Upload Large File

    <q-file
      v-model="file"
      label="Upload"
      @update:model-value="
        (value) => {
          handleRequestPolicy(value);
        }
      "
    />
    <div v-if="policy" class="q-my-md">
      <div class="text-center">
        <!-- Main call to action button -->
        <q-btn
          @click="handleFileUploading()"
          color="green-8"
          no-caps
          label="Continue Uploading"
        />

        <!-- !!! Important hard coded policy cost -->
        <p class="q-my-sm text-orange">
          Below are generated policy for the file uploading. Please take note,
          this api call will cost you <b>{{ policy.request_cost }}</b>
        </p>
      </div>
      <FlatObjectList :data="policy" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import largeFileService from 'src/services/LargeFile/largeFileService';
import FlatObjectList from 'src/components/TryItOut/ResponseUnits/FlatObjectList.vue';

export default defineComponent({
  components: { FlatObjectList },
  setup() {
    const { requestUploadingPolicy, useUploadLargeFile } = largeFileService();
    const file = ref();
    const policy = ref();

    async function handleRequestPolicy(fileObj) {
      // Trigger the first api call
      policy.value = await requestUploadingPolicy(fileObj);
    }

    function handleFileUploading() {
      // Trigger the second api call
      useUploadLargeFile(file.value, policy.value);
      return;
    }
    return {
      file,
      policy,
      handleRequestPolicy,
      handleFileUploading,
    };
  },
});
</script>

<style lang="scss" scoped></style>
