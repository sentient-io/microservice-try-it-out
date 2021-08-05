<template>
  <div>
    <q-input
      type="textarea"
      v-model="jsonStrInput"
      outlined
      class="n-json-str-input"
      input-style="resize:none; word-break:break-all; max-height:50vh; overflow:scroll"
      autogrow
      @input="processUserInputData"
      :error-message="errMsg"
      :error="errMsg !== ''"
      :disable="disable"
    ></q-input>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { defineComponent, ref, watch } from 'vue';
import { tryItOutService } from '../../../services/TryItOut/TryItOut_service';

export default defineComponent({
  props: { inputProperties: {}, disable: { type: Boolean, default: false } },
  setup(props) {
    const {
      userDocRef,
      inputPropertiesToJsonString,
      formatJsonString,
      updateJsonToInputProperties,
      validateInputProperties,
      editingHeavyContentAlert,
      editingBinaryFileContentAlert,
      inputPropertiesContainMaskedValue,
      inputPropertiesContainBinaryFile,
      getInputProperties,
    } = tryItOutService();
    const jsonStrInput = ref();
    const errMsg = ref('');

    const inputProperties = getInputProperties(userDocRef);

    function processUserInputData() {
      if (inputPropertiesContainMaskedValue(inputProperties)) {
        editingHeavyContentAlert();
      } else if (inputPropertiesContainBinaryFile(inputProperties)) {
        editingBinaryFileContentAlert();
      } else {
        errMsg.value = '';
        try {
          updateJsonToInputProperties(jsonStrInput.value, inputProperties);
        } catch (err) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          errMsg.value = err ?? err.message;
        }
      }
      getJsonStrInput();
    }

    function getJsonStrInput(removeEmptyValue = false) {
      errMsg.value = validateInputProperties(inputProperties);
      try {
        jsonStrInput.value = formatJsonString(
          inputPropertiesToJsonString(inputProperties),
          removeEmptyValue
        );
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        errMsg.value === '' ? (errMsg.value = err.message) : null;
      }
    }
    getJsonStrInput('removeEmptyValue');

    watch(props, () => {
      errMsg.value = '';
      getJsonStrInput();
    });

    return { jsonStrInput, processUserInputData, errMsg };
  },
});
</script>

<style lang="scss">
.n-json-str-input .q-field__control {
  padding-right: 0px;
}
</style>
