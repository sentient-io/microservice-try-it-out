<template>
  <div>
    <div class="q-mb-sm">
      <pre
        contenteditable="true"
        class="input q-ma-none q-pa-sm text-grey-8"
        style="font: inherit"
        @input="(evt) => handleJsonInputEvt(evt)"
        @click="getCursorPosition"
        @keyup="getCursorPosition"
        >{{ validatedJsonStr }}</pre
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
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue';

export default defineComponent({
  props: {
    jsonStr: {},
    errorProp: {},
  },
  setup(props, { emit }) {
    const validatedJsonStr = ref();
    const jsonErrorMessage = ref();
    const propErrorMessage = ref();
    const cursorPosition = ref();

    const init = () => {
      const jsonObj = JSON.parse(props.jsonStr);
      validatedJsonStr.value = jsonObj;
      // formatJsonString();
      console.log('Init JSON Editor Component');
    };

    /**
     * Take user input event, get the content from user input
     * Check if the input is valid JSON string
     */
    const handleJsonInputEvt = (inputEvent) => {
      console.log('calling handleJsonInput Function');
      const jsonStr = inputEvent.target.innerText;
      jsonErrorMessage.value = '';
      try {
        // Validate user input json
        JSON.parse(jsonStr);
      } catch (err) {
        console.log(err.message);
        jsonErrorMessage.value = err.message;
        emit('error');
        return;
      }
      //'String is valid'
      handleValidInput(jsonStr);
    };

    const handleValidInput = (validJsonStr) => {
      const jsonObj = JSON.parse(validJsonStr);
      validatedJsonStr.value = jsonObj;
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

    return {
      validatedJsonStr,
      jsonErrorMessage,
      propErrorMessage,
      cursorPosition,
      handleJsonInputEvt,
      getCursorPosition,
    };
  },
});
</script>

<style lang="scss" scoped>
.input {
  border-style: solid;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.25);
  border-radius: 0.25rem;
}

.input:hover {
  border-color: rgba(0, 0, 0, 0.7);
}

.input:focus-within {
  border-color: #1976d2;
}
</style>
