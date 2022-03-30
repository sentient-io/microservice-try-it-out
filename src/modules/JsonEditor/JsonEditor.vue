<template>
  <div>
    <div class="q-mb-sm">
      <pre
        :contenteditable="contentEditable"
        class="json-input q-ma-none q-pa-sm text-grey-8 small-scrollbar"
        :class="contentEditable ? '' : 'cursor-not-allowed'"
        style="font: inherit"
        @input="(evt) => handleJsonInputEvt(evt)"
        @click="getCursorPosition"
        @keyup="getCursorPosition"
        >{{ validatedJson }}</pre
      >
    </div>

    <!-- JSON Error Message -->
    <div
      class="q-px-sm row items-center q-gutter-xs text-red"
      v-show="jsonErrorMessage"
    >
      <q-icon name="error_outline" color="q-mr-sm" />
      <small
        >{{ jsonErrorMessage }}. Current position: {{ cursorPosition }}</small
      >
    </div>

    <!-- Prop Error Message -->
    <div
      class="q-px-sm row items-center q-gutter-xs text-red"
      v-show="propErrorMessage"
    >
      <q-icon name="error_outline" color="q-mr-sm" />
      <small>{{ propErrorMessage }}</small>
    </div>

    <!-- Disabled Content Editing Message -->
    <div
      class="q-px-sm row items-center q-gutter-xs text-amber-8"
      v-show="!contentEditable"
    >
      <q-icon name="warning_amber" color="q-mr-sm" />
      <small
        >Because the JSON object contains long string values, editing is
        disabled to prevent browser crashes.</small
      >
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import JsonEditorService from './JsonEditorService';

export default defineComponent({
  props: {
    jsonStr: {},
    errorProp: {},
  },
  setup(props, { emit }) {
    // Can be either JsonString or JsonObj
    const validatedJson = ref();
    const jsonErrorMessage = ref();
    const propErrorMessage = ref();
    const cursorPosition = ref();
    const contentEditable = ref(true);

    const { clipLongStringInJsonObj, isContainsLongString } =
      JsonEditorService();

    const init = () => {
      const jsonObj = JSON.parse(props.jsonStr);
      console.log(jsonObj);
      if (isContainsLongString(jsonObj)) {
        contentEditable.value = false;
        const clippedJsonObj = clipLongStringInJsonObj(jsonObj);
        validatedJson.value = clippedJsonObj;
      } else {
        validatedJson.value = jsonObj;
      }
      // formatJsonString();
      console.log('Init JSON Editor Component');
    };

    /**
     * Take user input event, get the content from user input
     * Check if the input is valid JSON string
     */
    const handleJsonInputEvt = (inputEvent) => {
      console.log('calling handleJsonInput Function');
      let jsonStr = inputEvent.target.innerText;
      // Escape empty string scse
      if (jsonStr === '') jsonStr = '{}';
      jsonErrorMessage.value = '';
      try {
        // Validate user input json
        JSON.parse(jsonStr);
      } catch (err) {
        console.log(err.message);
        jsonErrorMessage.value = err.message;
        emit('error', err.message);
        return;
      }
      //'String is valid'
      handleValidInput(jsonStr);
    };

    const handleValidInput = (validJsonStr) => {
      /**
       * This function causing a smaller issue, when user insert
       * new keys, the JSON editor will try to auto  format  the
       * input string for user, and the cursor will move to  the
       * start position.
       * */
      const jsonObj = JSON.parse(validJsonStr);
      validatedJson.value = jsonObj;
      // Output As String
      emit('validInput', validJsonStr);
    };

    /**
     * Make it easier for user to de-bug, reference:
     * https://stackoverflow.com/questions/3972014/get-contenteditable-caret-position
     */
    const getCursorPosition = () => {
      cursorPosition.value = document.getSelection().anchorOffset;
    };

    // const formatJsonString = () => {
    //   validatedJsonStr.value = JSON.parse(validatedJsonStr.value);
    // };

    watch(props, () => {
      console.log('Watching error message');
      propErrorMessage.value = props.errorProp;
      console.log(propErrorMessage.value);
    });

    onMounted(() => {
      init();
    });

    onUnmounted(() => {
      // When component unmounted, clear the error message
      emit('error', false);
    });

    return {
      validatedJson,
      jsonErrorMessage,
      propErrorMessage,
      cursorPosition,
      contentEditable,
      handleJsonInputEvt,
      getCursorPosition,
    };
  },
});
</script>

<style lang="scss" scoped>
.json-input {
  max-height: 400px;
  overflow: scroll;
  line-break: anywhere;
  white-space: break-spaces;
  border-style: solid;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.25);
  border-radius: 0.25rem;
}

.json-input:hover {
  border-color: rgba(0, 0, 0, 0.7);
}

.json-input:focus-within {
  border-color: #1976d2;
}
</style>
