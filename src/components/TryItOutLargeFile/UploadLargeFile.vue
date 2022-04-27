<template>
  <div>
    <div v-if="additionalParamRef">
      <div v-for="(paramKey, idx) in additionalParamKeys" :key="idx">
        <ParamInput
          :label="paramKey"
          :type="additionalParamRef.properties[paramKey].type"
          :default="additionalParamRef.properties[paramKey].example"
          :description="additionalParamRef.properties[paramKey].description"
          @input="(param) => userParamInput(paramKey, param)"
        />
      </div>
    </div>

    <q-file
      outlined
      v-model="file"
      label="Upload File"
      @update:model-value="
        (value) => {
          handleRequestPolicy(value);
        }
      "
    />
    <span>{{ fileHint }}</span>
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
import ParamInput from 'src/components/ParamInput.vue';

export default defineComponent({
  components: { FlatObjectList, ParamInput },
  setup(_, { emit }) {
    const { requestUploadingPolicy, useUploadLargeFile, getInputSchema } =
      largeFileService();

    const file = ref();
    const policy = ref();
    const additionalParamRef = ref();
    const additionalParamKeys = ref();
    const additionalParam = ref({});
    const fileHint = ref();
    // !IMPORTANT hard coded value

    fileHint.value =
      getInputSchema().properties['file_name'].description +
      'e.g.' +
      getInputSchema().properties['file_name'].example;

    additionalParamRef.value = getInputSchema().properties['additional_param'];
    if (additionalParamRef.value) {
      // Not all large files have additional Params
      additionalParamKeys.value = Object.keys(
        additionalParamRef.value.properties
      );
    } else {
      additionalParamKeys.value = '';
    }

    async function handleRequestPolicy(fileObj) {
      // Trigger the first api call
      policy.value = await requestUploadingPolicy(
        fileObj,
        additionalParam.value
      );
    }

    async function handleFileUploading() {
      // Trigger the second api call
      await useUploadLargeFile(file.value, policy.value);
      emit('goToGetStatus');
      return;
    }

    function userParamInput(key, val) {
      if (!additionalParam.value[key]) {
        additionalParam.value[key] = '';
      }
      additionalParam.value[key] = val;
    }
    return {
      file,
      policy,
      additionalParamRef,
      additionalParamKeys,
      handleRequestPolicy,
      handleFileUploading,
      userParamInput,
      fileHint,
    };
  },
});
</script>

<style lang="scss" scoped></style>
