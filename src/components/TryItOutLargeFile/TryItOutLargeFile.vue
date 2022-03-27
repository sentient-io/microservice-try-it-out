<template>
  <div>
    <q-tabs
      v-model="currentStep"
      :breakpoint="9999"
      align="justify"
      indicator-color="transparent"
      class="or-tryout bg-grey-4 text-grey-6"
      dense
      active-bg-color="green-7"
      active-color="white"
    >
      <q-tab :name="LargeFileTrySteps[0]" no-caps>
        {{ LargeFileTrySteps[0] }}
      </q-tab>
      <q-tab :name="LargeFileTrySteps[1]" no-caps>
        {{ LargeFileTrySteps[1] }}
      </q-tab>
      <q-tab :name="LargeFileTrySteps[2]" no-caps>
        {{ LargeFileTrySteps[2] }}
      </q-tab>
    </q-tabs>

    <q-tab-panels v-model="currentStep">
      <q-tab-panel :name="LargeFileTrySteps[0]">
        <UploadLargeFile @goToGetStatus="goToGetStatus"
      /></q-tab-panel>
      <q-tab-panel :name="LargeFileTrySteps[1]">
        <GetStatus
          @handleDisplayResult="(statusObj) => displayResult(statusObj)"
        />
      </q-tab-panel>
      <q-tab-panel :name="LargeFileTrySteps[2]">
        <DislayResults :status-obj="statusObjRef" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { tryItOutService } from 'src/services/TryItOut/TryItOut_service';

import UploadLargeFile from 'src/components/TryItOutLargeFile/UploadLargeFile.vue';
import GetStatus from 'src/components/TryItOutLargeFile/GetStatus.vue';
import DislayResults from 'src/components/TryItOutLargeFile/DisplayResults.vue';

export default defineComponent({
  components: { UploadLargeFile, GetStatus, DislayResults },
  setup() {
    const { rawDocRef } = tryItOutService();

    const LargeFileTrySteps = [
      'Upload',
      'File Process Status',
      'Display Result',
    ];
    const currentStep = ref(LargeFileTrySteps[0]);

    const statusObjRef = ref({});

    const displayResult = (statusObj) => {
      console.log(statusObj);
      statusObjRef.value = statusObj;
      currentStep.value = LargeFileTrySteps[2];
    };

    function goToGetStatus() {
      currentStep.value = LargeFileTrySteps[1];
    }
    return {
      currentStep,
      rawDocRef,
      LargeFileTrySteps,
      statusObjRef,
      displayResult,
      goToGetStatus,
    };
  },
});
</script>

<style lang="scss" scoped></style>
