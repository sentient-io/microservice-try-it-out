<template>
  <div class="q-pa-md">
    <!-- {{ userDocRef }} -->
    <h6 class="q-ma-none">
      {{ $t('tryItOut.header') }} - {{ rawDocRef?.info?.title }}

      <q-btn v-if="!isInIframe" class="float-right" to="/" icon="home" />
    </h6>
    <p>{{ $t('tryItOut.description') }}</p>
    <BeforeYouStart />

    <APIKeyInput v-if="!apiKey" />
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
            <ResetUserInputs @resetInputs="initUserDocRef()"></ResetUserInputs>
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
        />
        <div v-else>
          <div v-if="inputTypeByApi(rawDocRef) === 'jsonDataInput'">
            <p class="q-mb-md">{{ $t('tryItOut.editJsonDataInput') }}</p>
            <JsonDataInput />
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
            !!validateInputProperties() &&
            getInputProperties(userDocRef) != undefined
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
        <RawResponse v-else :apiResponse="apiResponse"></RawResponse>
      </template>
    </InputAndResponseTabs>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { defineComponent, ref, watch, onMounted } from 'vue';
import { tryItOutService } from '../../services/TryItOut/TryItOut_service';

import BeforeYouStart from './BeforeYouStart.vue';
import APIKeyInput from './InputUnits/APIKeyInput.vue';
import InputAndResponseTabs from './InputAndResponseTabs.vue';
import ResetUserInputs from './ResetUserInputs.vue';
import ToggleButton from './ToggleButton.vue';
import EndpointsAndMethods from './EndpointsAndMethods.vue';
import FieldsInput from './InputUnits/FieldsInput.vue';
import JsonDataInput from './InputUnits/JsonDataInput.vue';
import QueryStringInput from './InputUnits/QueryStringInput.vue';
import MakeApiCallBtn from './MakeApiCallBtn.vue';
import RawResponse from './ResponseUnits/RawResponse.vue';
import ParsedResponse from './ResponseUnits/ParsedResponse.vue';

export default defineComponent({
  components: {
    BeforeYouStart,
    APIKeyInput,
    InputAndResponseTabs,
    ResetUserInputs,
    ToggleButton,
    EndpointsAndMethods,
    FieldsInput,
    JsonDataInput,
    QueryStringInput,
    MakeApiCallBtn,
    RawResponse,
    ParsedResponse,
  },
  props: {
    /** Require full path to fetch the documentation */
    docPath: { type: String },
    apiKey: { type: String },
  },
  setup(props) {
    const {
      setApiKey,
      fetchApiDoc,
      rawDocRef,
      userDocRef,
      initUserDocRef,
      inputTypeByApi,
      listOfRequiredValues,
      getInputProperties,
      apiResponse,
      validateInputProperties,
    } = tryItOutService();

    const inputTypeIdx = ref(0);
    const responseTypeIdx = ref(0);
    const InputAndResponseTabsRef = ref(null);

    /** Check if the page opened in iframe */
    const isInIframe = window.location !== window.parent.location;

    function postWindowHeight() {
      /**
       * This function useful when embedding try it out as iframe
       * try it out  will consistantpy posting window size to the
       * parent frame.
       */
      let message = {
        height: document.body.scrollHeight,
        width: document.body.scrollWidth,
      };
      // window.top refers to parent window
      window.top.postMessage(message, '*');
    }
    /** Consistantly update the window size to parent window */
    window.addEventListener('resize', postWindowHeight);
    onMounted(() => {
      if (props.apiKey) {
        setApiKey(props.apiKey);
      }
      postWindowHeight(); /** Send the size to parent window */
    });

    watch(props, () => {
      /** Update doc when the docPath changes */
      fetchApiDoc(props.docPath);
    });
    fetchApiDoc(props.docPath);

    watch(apiResponse, () => {
      if (apiResponse.status) {
        InputAndResponseTabsRef.value.toggleResponseTab();
      } else {
        InputAndResponseTabsRef.value.toggleInputTab();
      }
    });

    return {
      initUserDocRef,
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
    };
  },
});
</script>

<style lang="scss" scoped></style>
