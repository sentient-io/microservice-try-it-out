<template>
  <div>
    <!-- {{ inputProperties }} -->
    <div v-for="(inputProperty, name, index) in inputProperties" :key="index">
      <!-- {{ inputProperty }} -->
    </div>
    <div
      v-for="(inputProperty, name, index) in inputProperties"
      :key="index"
      class="q-my-lg n-fields-input"
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
            //inputProperty.example = userInputValue;
            updateInputPropertyExampleValue(inputProperty, userInputValue);
          }
        "
      ></FieldsInputForObject>

      <div v-else-if="inputProperty.format === 'binary'">
        <BinaryUploader
          :label="getInputFieldLabel(inputProperty, name, index)"
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
      <div v-else-if="inputProperty.type == 'boolean'">
        <!-- Remark: 2021 Nov 19 Added boolean value -->
        <q-checkbox
          class="q-ml-sm"
          color="green-8"
          :label="getInputFieldLabel(inputProperty, name, index)"
          :model-value="inputProperty.maskedValue || inputProperty.example"
          @update:modelValue="
            (val) => {
              inputProperty.maskedValue
                ? editingHeavyContentNotify(stopEditingNotifyMessage.base64str)
                : updateInputPropertyExampleValue(inputProperty, val);
            }
          "
        />
      </div>
      <div v-else>
        <!-- Generic input fields -->
        <!-- Some notes: 
        The model-value's logic is to hide long base64 string so it will not freeze browser 
        The autogrow will force all other type as "textarea", so only use it for actual 'textarea'
        The error is to check if the element is empty, and inside required list, then rise error
        -->
        <q-input
          outlined
          hide-bottom-space
          bottom-slots
          input-style="max-height:120px"
          :type="getInputDataType(inputProperty)"
          :autogrow="getInputDataType(inputProperty) === 'textarea'"
          :label="getInputFieldLabel(inputProperty, name, index)"
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
                ? editingHeavyContentNotify(stopEditingNotifyMessage.base64str)
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

import { Notify } from 'quasar';

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
      stopEditingNotifyMessage,
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

    return {
      isBase64,
      handleUserPastedValue,
      stopEditingNotifyMessage,
      editingHeavyContentNotify,
      apiCategory,
      errMsg,
      getInputFieldLabel,
      getInputDataType,
      updateInputPropertyExampleValue,
    };
  },
});
</script>

<style lang="scss">
.n-fields-input .q-field__bottom {
  /** This will remove additional space for error message below input fields */
  min-height: 0px;
  padding: 4px 8px;
}
</style>
