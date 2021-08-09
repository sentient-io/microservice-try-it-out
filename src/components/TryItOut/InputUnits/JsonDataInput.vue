<template>
  <div>
    <pre
      v-if="disable"
      class="s-code q-px-lg"
      style="max-height: 50vh; overflow: scroll"
    >
      <code style="word-break:break-all;  white-space:break-spaces">
        {{jsonStrInput}}
      </code>
    </pre>
    <q-input
      v-else
      type="textarea"
      v-model="jsonStrInput"
      outlined
      class="n-json-str-input"
      input-style="resize:none; word-break:break-all; max-height:50vh; overflow:scroll"
      autogrow
      @update:modelValue="processUserInputData"
      :error-message="errMsg"
      :error="errMsg !== ''"
    ></q-input>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { defineComponent, ref, watch } from 'vue';
import { tryItOutService } from '../../../services/TryItOut/TryItOut_service';
import { Notify } from 'quasar';

export default defineComponent({
  props: { inputProperties: {}, disable: { type: Boolean, default: false } },
  setup(props) {
    const {
      userDocRef,
      inputPropertiesToJsonString,
      formatJsonString,
      updateJsonToInputProperties,
      validateInputProperties,
      stopEditingNotifyMessage,
      inputPropertiesContainMaskedValue,
      inputPropertiesContainBinaryFile,
      getInputProperties,
    } = tryItOutService();
    const jsonStrInput = ref();
    const errMsg = ref('');

    const inputProperties = getInputProperties(userDocRef);

    function editingHeavyContentNotify(message) {
      Notify.create({
        message: message,
        color: 'orange-7',
        html: true,
        actions: [
          {
            label: 'Dismiss',
            color: 'white',
            handler: () => {
              return null;
            },
          },
        ],
        timeout: 15000,
        position: 'center',
      });
    }

    function processUserInputData() {
      if (inputPropertiesContainMaskedValue(inputProperties)) {
        // To prevent user from editing base64 string
        editingHeavyContentNotify(stopEditingNotifyMessage.base64str);
      } else if (inputPropertiesContainBinaryFile(inputProperties)) {
        /**
         * To prevent user from editing binary fine, as the display
         * on screen is just the file name, not the actual data
         */
        editingHeavyContentNotify(stopEditingNotifyMessage.binaryFile);
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
