<template>
  <div>
    <!-- {{ inputProperties }} -->
    <div v-for="(inputProperty, name, index) in inputProperties" :key="index">
      {{ inputProperty }}
    </div>
    <div
      v-for="(inputProperty, name, index) in inputProperties"
      :key="index"
      class="q-mt-lg"
    >
      <FieldsInputForObject
        v-if="
          ['object', 'array'].includes(inputProperty.type) ||
          inputProperty.name === 'filterdata'
        "
        :label="getInputFieldLabel(inputProperty, index)"
        :inputProperties="inputProperty.example"
        @userInput="
          (userInputValue) => {
            inputProperty.example = userInputValue;
          }
        "
      ></FieldsInputForObject>

      <div v-else-if="inputProperty.format === 'binary'">
        <p>test</p>
        <BinaryUploader
          :label="getInputFieldLabel(inputProperty, index)"
          :example="inputProperty['example']"
          @uploadFile="
            (file) => {
              inputProperty.example = file;
            }
          "
        ></BinaryUploader>
      </div>

      <!-- Remark: 2021 Jul 27 Removed .native modifier from
@[isBase64(inputProperty)].native.capture.prevent  -->
      <div v-else>
        <p>Test</p>
        <q-input
          outlined
          hide-bottom-space
          input-style="max-height:120px"
          type="textarea"
          autogrow
          :label="getInputFieldLabel(inputProperty, index)"
          :model-value="inputProperty.maskedValue || inputProperty.example"
          :error-message="'Field required'"
          :error="
            inputProperty.example == '' &&
            !inputProperty[0] &&
            requiredValues.includes(inputProperty['x-name'])
          "
          @update:modelValue="
            (val) => {
              inputProperty.maskedValue
                ? editingHeavyContentAlert()
                : updateInputPropertyExampleValue(inputProperty, val);
            }
          "
          @[isBase64(inputProperty)].capture.prevent="
            (ev) => {
              handleUserPastedValue(ev, inputProperty);
            }
          "
        >
          <template v-slot:hint>
            <div v-if="Boolean(isBase64(inputProperty))">
              <Base64AdditionalInfo></Base64AdditionalInfo>
            </div>
          </template>
          <template v-slot:after>
            <!-- Clear button for base64 text -->
            <q-icon
              name="clear"
              class="cursor-pointer q-mx-sm"
              v-if="Boolean(isBase64(inputProperty))"
              @click="
                () => {
                  inputProperty.maskedValue = '';
                  inputProperty.example = '';
                }
              "
            ></q-icon>

            <!-- Binary to base64 file uploader -->
            <ExpandableIcon
              icon="upload_file"
              title="File Uploader"
              v-if="Boolean(isBase64(inputProperty))"
            >
              <BinaryToBase64
                @convertToBase64="
                  (val) => {
                    inputProperty.example = val;
                  }
                "
              ></BinaryToBase64>
            </ExpandableIcon>

            <!-- Audio Recorder -->
            <ExpandableIcon
              icon="keyboard_voice"
              title="Voice Recorder"
              v-if="
                Boolean(isBase64(inputProperty)) &&
                apiCategory(inputProperty) === 'voice'
              "
            >
              <AudioRecorder
                @convertToBase64="
                  (val) => {
                    inputProperty.example = val;
                  }
                "
              ></AudioRecorder>
            </ExpandableIcon>
          </template>
        </q-input>
      </div>

      <ReadMore
        :content="inputProperty.description"
        :trim-at="130"
        text-style="font-size:0.8rem"
        class="q-mx-sm"
      />
    </div>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { defineComponent, ref } from 'vue';

import { tryItOutService } from '../../../services/TryItOut/TryItOut_service';

import FieldsInputForObject from './FieldsInputForObject.vue';
import Base64AdditionalInfo from './Base64AdditionalInfo.vue';
import ExpandableIcon from '../ExpandableIcon.vue';
import AudioRecorder from './AudioRecorder.vue';
import BinaryToBase64 from './BinaryToBase64.vue';
import BinaryUploader from './BinaryUploader.vue';
import ReadMore from '../ReadMore.vue';

export default defineComponent({
  components: {
    FieldsInputForObject,
    Base64AdditionalInfo,
    ExpandableIcon,
    AudioRecorder,
    BinaryToBase64,
    BinaryUploader,
    ReadMore,
  },
  props: { inputProperties: {}, requiredValues: {} },
  setup() {
    const errMsg = ref('');
    const {
      editingHeavyContentAlert,
      getInputFieldLabel,
      getInputDataType,
      updateInputPropertyExampleValue,
    } = tryItOutService();
    function isBase64(property) {
      /**
       * Very complex logic, refer to @[isBase64(property)].native.capture.prevent
       * attribute in the input fields HTML tag above. This function will return a
       * null or "paste" string depends on the type of input field.
       *
       * The final rendered result will be @paste.native.capture.prevent for base64
       * string inputs. And do nothing for other types of inputs. userPasteVal() is
       * the function to manage user's input, so it will not freeze the browser.
       */
      if (property['x-name']?.includes('base64')) {
        return 'paste';
      } else {
        return null;
      }
    }

    function handleUserPastedValue(ev, inputProperty) {
      /** @native.paste event will happen before the input event */
      /**sa
       * @apste.native.capture.prevent will prevent pasted value display
       * on the input field. Here will assign the values directly to the
       * selected fields inside schema. And the display value inside the
       * input filed will be processed before display (by the maskVlue()
       * function).
       */
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      let val = ev.clipboardData.getData('Text');
      inputProperty.example = val;
    }

    function apiCategory(inputProperty) {
      // How do we know the API is audio category?
      let category = 'unknown';
      switch (inputProperty['x-name']) {
        case 'wav_base64':
          category = 'voice';
          break;
        default:
          break;
      }
      return category;
    }

    return {
      isBase64,
      handleUserPastedValue,
      editingHeavyContentAlert,
      apiCategory,
      errMsg,
      getInputFieldLabel,
      getInputDataType,
      updateInputPropertyExampleValue,
    };
  },
});
</script>

<style lang="scss" scoped></style>
