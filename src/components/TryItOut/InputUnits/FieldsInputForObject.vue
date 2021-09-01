<template>
  <div>
    <q-input
      :label="label"
      type="textarea"
      v-model="jsonStrInput"
      outlined
      input-style="max-height:240px; word-break:break-all"
      autogrow
      @update:modelValue="processUserInputData"
      :error-message="errMsg"
      :error="errMsg !== ''"
      hide-bottom-space
    >
      <template v-slot:after>
        <q-icon name="close" @click="clearJsonStrInput"></q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { defineComponent, ref, watch } from 'vue';
// import { format } from 'quasar';
import { tryItOutService } from '../../../services/TryItOut/TryItOut_service';

export default defineComponent({
  props: { inputProperties: {}, label: {} },
  setup(props, { emit }) {
    const { formatJsonString, checkJsonAlikeString, reverseFormatJsonString } =
      tryItOutService();
    const jsonStrInput = ref('');
    const errMsg = ref('');

    function clearJsonStrInput() {
      jsonStrInput.value = '';
      emit('userInput', '');
    }

    function processUserInputData() {
      errMsg.value = '';
      if (jsonStrInput.value.replace(/\n/g, '') === '') {
        emit('userInput', '');
        return;
      }
      try {
        emit('userInput', JSON.parse(jsonStrInput.value));
        console.log(JSON.parse(jsonStrInput.value));
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        errMsg.value = err.message;
      }
    }

    function getJsonStrInput() {
      jsonStrInput.value = props.inputProperties;
      if (typeof props.inputProperties == 'object') {
        jsonStrInput.value = formatJsonString(
          JSON.stringify(props.inputProperties)
        );
      }

      if (checkJsonAlikeString(props.inputProperties)) {
        jsonStrInput.value = formatJsonString(props.inputProperties);
      }

      return jsonStrInput.value;
    }
    getJsonStrInput();

    watch(props, () => {
      getJsonStrInput();
      errMsg.value = '';
    });

    return { jsonStrInput, processUserInputData, errMsg, clearJsonStrInput };
  },
});
</script>

<style lang="scss" scoped></style>
