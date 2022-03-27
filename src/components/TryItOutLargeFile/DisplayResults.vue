<template>
  <div>
    <div v-if="largeFileResult">
      <div class="row justify-between">
        <div class="column q-gutter-sm">
          <div><b>File Name: </b>{{ statusObj.fileName }}</div>
          <div><b>Time Uploaded: </b>{{ statusObj.timestamp }}</div>
          <div><b>Cost: </b>{{ statusObj.cost }}</div>
        </div>
        <div>
          <ToggleButton
            :label="$t('tryItOut.displayAs')"
            :options="[
              $t('tryItOut.parsedResponse'),
              $t('tryItOut.rawResponse'),
            ]"
            @select="(idx) => (responseTypeIdx = idx)"
            :selected-idx="responseTypeIdx"
          />
        </div>
      </div>
      <div>
        <FlatObjectList v-if="responseTypeIdx === 0" :data="largeFileResult" />
        <RawCodeDisplay v-else :apiResponse="largeFileResult" />
      </div>
    </div>
    <div v-else>
      <p>
        Please select a processed file from "Get Status" tab. If there are
        nothing in the list, please upload a file to start try it out.
      </p>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import largeFileService from 'src/services/LargeFile/largeFileService';
import ToggleButton from 'src/components/TryItOut/ToggleButton.vue';
import RawCodeDisplay from 'src/components/TryItOut/ResponseUnits/RawCodeDisplay.vue';
import FlatObjectList from 'src/components/TryItOut/ResponseUnits/FlatObjectList.vue';

const { useFetchLargeFileResult } = largeFileService();

export default defineComponent({
  props: {
    statusObj: {},
  },
  components: {
    ToggleButton,
    RawCodeDisplay,
    FlatObjectList,
  },
  setup(props) {
    const largeFileResult = ref();
    const responseTypeIdx = ref(0);

    onMounted(async () => {
      const resultsUrl = props.statusObj.status['output_url'];
      largeFileResult.value = await useFetchLargeFileResult(resultsUrl);
    });

    return { largeFileResult, responseTypeIdx };
  },
});
</script>

<style lang="scss" scoped></style>
