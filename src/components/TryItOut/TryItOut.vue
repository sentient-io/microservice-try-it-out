<template>
  <div class="q-pa-md">
    <!-- 
      This will listen to window size change 
      and update parent latest  height (when 
      try it out been accessed via iframe) 
      -->
    <q-resize-observer @resize="postWindowHeight" />

    <!-- 
      Using v-show logic to display 404 error
      message if the document is  not found .
      Forget why don't use v-if, but there is
      a reason.
     -->
    <div
      v-show="Object.keys(rawDocRef).length === 0 || !rawDocRef.openapi"
      class="row items-center justify-center q-my-lg no-wrap"
    >
      <div class="q-mr-md">
        <q-icon name="mdi-telescope" size="4rem" color="grey-4" />
      </div>
      <div v-if="rawDocRef.openapi">
        <p>Oops, API documentation not found from the provided url below:</p>

        <a
          class="s-break-all text-green-8"
          :href="docPath"
          :target="isInIframe ? '_parent' : '_blank'"
          >{{ docPath }}</a
        >
      </div>
      <h5 v-else class="text-grey-7">
        Try It Out is currently not available for websocket APIs.
      </h5>
    </div>

    <!-- 
      Below content will only display when there is valid rawDocRef content
      -->
    <div v-show="Object.keys(rawDocRef).length !== 0 && rawDocRef.openapi">
      <!-- {{ userDocRef }} -->
      <h6 class="q-ma-none">
        {{ $t('tryItOut.header') }} - {{ rawDocRef?.info?.title }}

        <q-btn v-if="!isInIframe" class="float-right" to="/" icon="home" />
      </h6>
      <p>{{ $t('tryItOut.description') }}</p>

      <div v-if="!apiKey">
        <BeforeYouStart />
        <APIKeyInput />
      </div>

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
      isInIframe,
    } = tryItOutService();

    const inputTypeIdx = ref(0);
    const responseTypeIdx = ref(0);
    const InputAndResponseTabsRef = ref(null);

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
      initUserDocRef();
    }

    if (isInIframe) {
      /**
       * Disable scroll bar on body element if the page is opened in iframe, This will
       * prevent  flashing  scroll  bar  when  user toggle Fields inout and JSON input
       * */
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    }

    /** Consistantly update the window size to parent window */
    window.addEventListener('resize', postWindowHeight);
    onMounted(() => {
      if (props.apiKey) {
        setApiKey(props.apiKey);
      }
      // postWindowHeight(); /** Send the size to parent window */
    });

    watch(props, () => {
      /** Update doc when the docPath changes */
      fetchApiDoc(props.docPath).catch((err) => {
        console.log(err);
      });
    });

    fetchApiDoc(props.docPath).catch((err) => {
      console.log(err);
    });

    watch(apiResponse, () => {
      console.log('Watching response')
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
    };
  },
});
</script>

<style lang="scss" scoped></style>
