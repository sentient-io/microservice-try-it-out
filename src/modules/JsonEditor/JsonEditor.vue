<template>
  <div>
    <div class="q-mb-sm">
      <span v-if="label">{{label}}</span>
      <pre
        :contenteditable="contentEditable"
        class="json-input q-ma-none q-pa-sm text-grey-8 small-scrollbar"
        :class="contentEditable ? '' : 'cursor-not-allowed'"
        style="font: inherit"
        @input="(inputEvent) => handleJsonInputEvt(inputEvent)"
        @click="getCursorPosition"
        @keyup="getCursorPosition"
        >{{ validatedJson }}</pre
      >
    </div>

    <!-- JSON Error Message -->
    <div
      class="q-px-sm q-mb-sm row items-center q-gutter-xs text-red no-wrap"
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
      <small>Content editing is disabled. {{ contentDisabledMsg }}</small>
    </div>
  </div>
</template>

<script>
/**
 * @author zq
 * @lastUpdate 2022-Mar-31
 *
 * A vue.js component takes a JSON string, display formatted JSON content
 * editing, and report JSON formatting error.
 *
 * @depencencies ['scroll-bar.css', './JsonEditorService']
 *
 * @props jsonStr: JSON string, must be validated
 * @props errorProp: error message passed from parent component
 *
 * @emits error: emit error event contains an error message string
 * @emits validInput: emit validInput event with validated JSON string
 */
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import JsonEditorService from './JsonEditorService';

export default defineComponent({
  props: {
    jsonStr: {},
    errorProp: {},
    disabled: { default: false, type: Boolean },
    label: { default: false },
  },
  setup(props, { emit }) {
    const EDIT_LONG_STRING_WARNING =
      'Editing JSON object with long string value may cause browser crashes.';

    // Can be either JsonString or JsonObj
    const validatedJson = ref();
    const jsonErrorMessage = ref();
    const propErrorMessage = ref();
    const cursorPosition = ref();
    const contentEditable = ref(true);
    const contentDisabledMsg = ref('');

    const { clipLongStringInJsonObj, isContainsLongString } =
      JsonEditorService();

    /**
     * Set local variables to default value, local state management
     */
    const setDefault = () => {
      contentDisabledMsg.value = '';
      contentEditable.value = true;
    };

    const init = () => {
      /**
       * Assign prop value to local variable, working together
       * with watcher function.
       */
      setDefault();
      let jsonObj = {};
      try {
        jsonObj = JSON.parse(props.jsonStr);
      } catch (err) {
        console.log(err);
      }

      if (props.disabled) {
        contentEditable.value = false;
      }

      if (isContainsLongString(jsonObj)) {
        handleLongStringJsonObj(jsonObj);
      } else {
        validatedJson.value = jsonObj;
      }

      // formatJsonString();
      console.log('Init JSON Editor Component');
    };

    /**
     * If input JSON object contains very long string, stop user
     * from editing the JSON object.Trim the JSON object and add
     * in trimmed message.
     */
    const handleLongStringJsonObj = (jsonObj) => {
      contentEditable.value = false;
      contentDisabledMsg.value = EDIT_LONG_STRING_WARNING;

      // Displaying the JSON object with clipped long string
      const clippedJsonObj = clipLongStringInJsonObj(jsonObj);
      validatedJson.value = clippedJsonObj;
    };

    /**
     * Take user input event, get the content from user input
     * Check if the input is valid JSON string
     */
    const handleJsonInputEvt = (inputEvent) => {
      // console.log('calling handleJsonInput Function');
      let jsonStr = inputEvent.target.innerText;

      // Escape empty string scse
      if (jsonStr === '') jsonStr = '{}';
      jsonErrorMessage.value = '';

      // Validate user input json
      try {
        const jsonObj = JSON.parse(jsonStr);
        handleLargeNumber(jsonObj);
      } catch (err) {
        console.log(err.message);
        jsonErrorMessage.value = err.message;
        emit('error', err.message);
        return;
      }
      //'String is valid'
      handleValidInput(jsonStr);
    };

    const handleLargeNumber = (jsonObj) => {
      for (const [, val] of Object.entries(jsonObj)) {
        if (typeof val == 'object') handleLargeNumber(val);
        if (typeof val == 'number' && val.toString().length >= 16) {
          console.log(val.toString());
          jsonErrorMessage.value =
            'Input contains large (long) number, current JSON editor may round the number up and cause error. However you can continue use scientific notation to repersent large number, e.g.1.79e+308';
        }
      }
    };

    /**
     * This function causing a smaller issue, when user insert
     * new keys, the JSON editor will try to auto  format  the
     * input string for user, and the cursor will move to  the
     * start position.
     * */
    const handleValidInput = (validJsonStr) => {
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
      // console.log('Watching error message');
      propErrorMessage.value = props.errorProp;
    });

    /**
     * Any jsonStr change will always trigger the init() function
     * This will prevent any casched state from  previous content
     */
    watch(
      () => props.jsonStr,
      () => {
        console.log('Watching jsonStr props change');
        init();
      }
    );

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
      contentDisabledMsg,
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
