<template>
  <div>
    <!-- 
      This disable key may be a bit confusing, but it saved a lot of duplicated code.
      -
      From [Parsed Response] page, we'll provide full details of what user had passed
      to the API, so they'll have a better idea where are the result came from.
      It works exactly same as JSON data input, except, user shouldn't key in anything
      -
      To make it more useful, we are adding preview of audio/images and video data
     -->
    <div v-if="disable">
      <pre class="s-code q-px-lg" style="max-height: 30vh; overflow: scroll">
      <code style="word-break:break-all;  white-space:break-spaces">
        {{jsonStrInput}}
      </code>
      </pre>
      <img
        v-if="getMediaBase64ByType('image')"
        :src="getMediaBase64ByType('image')"
        style="height: 200px"
      />
      <audio v-if="getMediaBase64ByType('audio')" controls>
        <source :src="getMediaBase64ByType('audio')" />
      </audio>
      <video
        controls
        v-if="getMediaBase64ByType('video')"
        :src="getMediaBase64ByType('video')"
        style="height: 200px"
      ></video>
    </div>
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

<script lang="js">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */

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

    const getMediaBase64ByType = (mediaType) => {
      const mdeiaTypesMapping = {
        // mediaType : [[array of key names used in input],'data type']
        image: [['image_base64'], 'image/jpeg'],
        audio: [['wav_base64'], 'audio/wav'],
        video: [['video_base64'], 'video/mp4'],
      };
      const keys = mdeiaTypesMapping[mediaType][0];
      const base64DataType = mdeiaTypesMapping[mediaType][1];

      let result = '';

      keys.forEach((key) => {
        if (Object.keys(inputProperties).indexOf(key) > -1) {
          result = `data:${base64DataType};base64,${inputProperties[key].example}`;
        }
      });

      return result;
    };

    watch(props, () => {
      errMsg.value = '';
      getJsonStrInput();
    });

    return {
      jsonStrInput,
      processUserInputData,
      errMsg,
      userDocRef,
      getMediaBase64ByType,
    };
  },
});
</script>

<style lang="scss">
.n-json-str-input .q-field__control {
  padding-right: 0px;
}
</style>
