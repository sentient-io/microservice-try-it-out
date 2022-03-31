<template>
  <div>
    <div>
      <InputAndResponseTabs
        ref="InputAndResponseTabsRef"
        :apiResponse="apiResponse"
      >
        <!-- Input Tab -->
        <template v-slot:input>
          <div class="flex row justify-between">
            <div class="flex row q-my-sm">
              <h6 class="q-my-none">
                {{
                  [
                    $t('tryItOut.fieldsInput'),
                    $t(`tryItOut.${inputTypeByApi(rawDocRef)}`),
                  ][inputTypeIdx]
                }}
              </h6>
              <ResetUserInputs @resetInputs="resetInputs()"></ResetUserInputs>
            </div>
            <ToggleButton
              :label="$t('tryItOut.inputWith')"
              :options="[
                $t('tryItOut.fieldsInput'),
                $t(`tryItOut.${inputTypeByApi(rawDocRef)}`),
              ]"
              @select="(idx) => (inputTypeIdx = idx)"
              :selected-idx="inputTypeIdx"
            ></ToggleButton>
          </div>
          <EndpointsAndMethods :doc="rawDocRef"></EndpointsAndMethods>

          <!-- Main input fields area -->
          <p
            v-if="getInputProperties(userDocRef) == undefined"
            class="text-center"
          >
            {{ $t('tryItOut.doesNotRequireInput') }}
          </p>

          <FieldsInput
            v-else-if="inputTypeIdx === 0"
            :inputProperties="getInputProperties(userDocRef)"
            :requiredValues="listOfRequiredValues(userDocRef)"
            @input="handleFieldsInput"
          />
          <div v-else>
            <div v-if="inputTypeByApi(rawDocRef) === 'jsonDataInput'">
              <p class="q-mb-md">{{ $t('tryItOut.editJsonDataInput') }}</p>
              <!-- <JsonDataInput /> -->
              <JsonEditor
                :key="jsonEditorKey"
                :json-str="requestBodyStr"
                :error-prop="requestBodyError"
                @validInput="(jsonStr) => handleJsonInput(jsonStr)"
                @error="
                  (errMsg) => {
                    handleJsonInputError(errMsg);
                  }
                "
              />
            </div>

            <div v-else>
              <p class="q-mb-md">{{ $t('tryItOut.editQueryInput') }}</p>
              <QueryStringInput
                :inputProperties="getInputProperties(userDocRef)"
              />
            </div>
          </div>
          <MakeApiCallBtn
            :disable="
              (!!validateInputProperties() &&
                getInputProperties(userDocRef) != undefined) ||
              !!requestBodyError ||
              jsonInputError
            "
          ></MakeApiCallBtn>
        </template>

        <!-- Response Tab -->
        <template v-slot:response>
          <div class="flex row justify-between q-mb-md">
            <h6 class="q-my-sm">
              {{
                [$t('tryItOut.parsedResponse'), $t('tryItOut.rawResponse')][
                  responseTypeIdx
                ]
              }}
            </h6>
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

          <ParsedResponse
            v-if="responseTypeIdx === 0"
            :apiResponse="apiResponse"
          ></ParsedResponse>
          <RawResponseOLD v-else :apiResponse="apiResponse"></RawResponseOLD>
        </template>
      </InputAndResponseTabs>
    </div>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { defineComponent, ref, watch } from 'vue';

import { tryItOutService } from '../../services/TryItOut/TryItOut_service';
import { formatterService } from 'src/services/formatter_service';

import InputAndResponseTabs from './InputAndResponseTabs.vue';
import ResetUserInputs from './ResetUserInputs.vue';
import ToggleButton from './ToggleButton.vue';
import EndpointsAndMethods from './EndpointsAndMethods.vue';
import FieldsInput from './InputUnits/FieldsInput.vue';
import QueryStringInput from './InputUnits/QueryStringInput.vue';
import MakeApiCallBtn from './MakeApiCallBtn.vue';
import RawResponseOLD from './ResponseUnits/RawResponseOLD.vue';
import ParsedResponse from './ResponseUnits/ParsedResponse.vue';
import JsonEditor from 'src/modules/JsonEditor/JsonEditor.vue';
// import JsonDataInput from './InputUnits/JsonDataInput.vue';

export default defineComponent({
  components: {
    InputAndResponseTabs,
    ResetUserInputs,
    ToggleButton,
    EndpointsAndMethods,
    FieldsInput,
    QueryStringInput,
    MakeApiCallBtn,
    RawResponseOLD,
    ParsedResponse,
    JsonEditor,
    // JsonDataInput,
  },
  props: {
    /** Require full path to fetch the documentation */
    docPath: { type: String },
    apiKey: { type: String },
  },
  setup(props) {
    const {
      // setApiKey,
      fetchApiDoc,
      rawDocRef,
      userDocRef,
      initUserDocRef,
      inputTypeByApi,
      listOfRequiredValues,
      getInputProperties,
      apiResponse,
      validateInputProperties,
      isInIframe,
      updateInputPropertyExampleValue,
    } = tryItOutService();

    const { fmtReqBodyFromInputProps } = formatterService();

    const inputTypeIdx = ref(0);
    const responseTypeIdx = ref(0);
    const InputAndResponseTabsRef = ref(null);

    // Formatted string from documentation request body
    const requestBodyStr = ref('');
    // Error message placeholder for JsonEditor
    const requestBodyError = ref('');
    const jsonInputError = ref(false);
    const jsonEditorKey = ref(0);
    /**
     * Process validated JSON data from JSON editor
     */
    const handleJsonInput = (jsonStr) => {
      // The jsonStr should always be valid jsonString
      requestBodyError.value = ''; // Reset error message
      const jsonObj = JSON.parse(jsonStr);
      const inputProps = getInputProperties(userDocRef);
      const inputPropKeys = Object.keys(inputProps);

      /**
       * Loop through all keys from user input json object, update valid
       * keys to the doc props example  ( later will be used for the api
       * call). If there are new keys not in documentation, raise error.
       */
      Object.keys(jsonObj).forEach((key) => {
        if (inputPropKeys.includes(key)) {
          // Avoid invalid keys
          updateInputPropertyExampleValue(inputProps[key], jsonObj[key]);
        } else {
          console.log('Capturing error message');
          requestBodyError.value = `Invalid key "${key}", please refer to documentation detail. For trying out purpose, please try not to modify the pre-defined key value.`;
          console.log(requestBodyError.value);
          return; // Catch error and break loop
        }
      });

      /**
       * Loop through all documentation props keys, if there are keys doesn't
       * appear in the user provided JSON object, means user manually deleted
       * the key. Will set the example value to empty string.
       */
      const userKeys = Object.keys(jsonObj);
      inputPropKeys.forEach((key) => {
        if (!userKeys.includes(key)) {
          // Set property valye to empty string
          updateInputPropertyExampleValue(inputProps[key], '');
        }
      });

      // Get formatted request body with updated content
      updateReqBodyStr();

      if (!requestBodyError.value) {
        jsonInputError.value = false;
      }

      /** END OF handleJsonInput() */
    };

    /**
     * update requestBodyStr for JsonEditor to display updated value
     */
    const updateReqBodyStr = () => {
      requestBodyStr.value = '';
      const inputProperties = getInputProperties(userDocRef);
      requestBodyStr.value = fmtReqBodyFromInputProps(inputProperties);
    };

    const handleFieldsInput = () => {
      updateReqBodyStr();
    };

    function postWindowHeight() {
      /**
       * This function useful when embedding try it out as iframe
       * try it out  will consistantpy posting window size to the
       * parent frame.
       */
      const pageContainer =
        document.getElementsByClassName('q-page-container')[0];
      let message = {
        // height: document.body.scrollHeight,
        height: pageContainer.scrollHeight,
        width: pageContainer.scrollWidth,
        completed: apiResponse.status,
      };

      // window.top refers to parent window
      window.top.postMessage(message, '*');
    }

    function resetInputs() {
      console.log('resetting input');
      initUserDocRef();
      jsonEditorKey.value += 1;
    }

    const handleJsonInputError = (err) => {
      if (!err) {
        jsonInputError.value = false;
        requestBodyError.value = '';
      } else {
        jsonInputError.value = true;
      }
    };

    /** Consistantly update the window size to parent window */
    window.addEventListener('resize', postWindowHeight);
    // onMounted(() => {
    //   if (props.apiKey) {
    //     setApiKey(props.apiKey);
    //   }
    //   // postWindowHeight(); /** Send the size to parent window */
    // });

    watch(userDocRef, () => {
      // console.log('Watching userDocRef update');
      updateReqBodyStr();
    });

    fetchApiDoc(props.docPath).catch((err) => {
      console.log(err);
    });

    // watch(
    //   rawDocRef,
    //   () => {
    //     console.log('Watching raw doc change')
    //     updateReqBodyStr();
    //   }
    // );

    watch(apiResponse, () => {
      // console.log('Watching response');
      if (apiResponse.status) {
        InputAndResponseTabsRef.value.toggleResponseTab();
      } else {
        InputAndResponseTabsRef.value.toggleInputTab();
      }
    });

    return {
      rawDocRef,
      userDocRef,
      inputTypeIdx,
      inputTypeByApi,
      responseTypeIdx,
      getInputProperties,
      listOfRequiredValues,
      InputAndResponseTabsRef,
      apiResponse,
      validateInputProperties,
      isInIframe,
      postWindowHeight,
      resetInputs,
      handleJsonInput,
      requestBodyStr,
      requestBodyError,
      handleFieldsInput,
      jsonInputError,
      jsonEditorKey,
      handleJsonInputError,
    };
  },
});
</script>

<style lang="scss" scoped></style>
