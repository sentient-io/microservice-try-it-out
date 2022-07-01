<template>
  <div class="fit row items-center justify-center">
    <img class="fit" :src="fmtedBase64Str" v-if="mediaType == 'image'" />
    <audio controls v-else-if="mediaType == 'audio'">
      <source :src="fmtedBase64Str" />
    </audio>
    <video
      controls
      class="fit"
      :src="fmtedBase64Str"
      v-else-if="mediaType == 'video'"
    ></video>
    <div v-else class="q-ma-none">
      <p>This media type is currently not supported for preview.</p>
      <p class="text-left text-grey-8 q-my-xs" style="line-height: 1">
        <small>
          It may caused by supplied base64 string missing media type header.
          Please try to select supported MIME media type belw.
        </small>
      </p>
      <div class="row items-center q-gutter-sm q-my-sm">
        <small>Select Media Type :</small>
        <q-select
          outlined
          dense
          options-dense
          style="min-width: 120px"
          class="listMediaTypeSelector"
          v-model="selectedMediaType"
          :options="[
            ...MIME_IMAGE_TYPES,
            ...MIME_AUDIO_TYPES,
            ...MIME_VIDEO_TYPES,
          ]"
        />
        <q-btn
          dense
          no-caps
          flat
          label="Apply"
          class="bg-green-6 text-white"
          size="0.65rem"
          @click="applySelectedMediaType()"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * TODO: Make JSON binary file available to preview
 * Reference:
 * https://stackoverflow.com/questions/38134200/base64-encode-a-javascript-object
 */
import { computed, onMounted, ref, watch } from "vue";

const props = defineProps({
  base64str: {},
});

const mediaType = ref();
const selectedMediaType = ref();

const fmtedBase64Str = ref();

const MIME_IMAGE_TYPES = [
  "image/apng",
  "image/png",
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/svg",
  "image/webp",
  "image/tiff",
];

const MIME_AUDIO_TYPES = [
  "audio/wav",
  "audio/webm",
  "audio/ogg",
  "audio/mp4",
  "audio/mpeg",
];

const MIME_VIDEO_TYPES = ["video/mp4", "video/ogg", "video/mp4"];

const getBase64MediaType = () => {
  // console.log("getBase64MediaType\n");

  let type;
  if (props.base64str) {
    let regx = /data:(.*)\;base64/;
    let match = regx.exec(props.base64str);
    if (match?.[1]) {
      type = match[1];
    }
  }

  mediaType.value = mapMediaType(type);
};

const mapMediaType = (type) => {
  if (MIME_IMAGE_TYPES.includes(type)) {
    return "image";
  }

  if (MIME_AUDIO_TYPES.includes(type)) {
    return "audio";
  }

  if (MIME_VIDEO_TYPES.includes(type)) {
    return "video";
  }

  return null;
};

const applySelectedMediaType = () => {
  // console.log("applySelectedMediaType");
  mediaType.value = mapMediaType(selectedMediaType.value);
  fmtedBase64Str.value = `data:${selectedMediaType.value};base64,${props.base64str}`;
  // console.log(fmtedBase64Str.value, mediaType.value);
};

const init = () => {
  getBase64MediaType();
  selectedMediaType.value = "";
  if (props.base64str) {
    fmtedBase64Str.value = props.base64str;
  }
};

onMounted(() => {
  init();
});

watch(
  () => props.base64str,
  () => init()
);
</script>

<style lang="scss">
// Customied global variables, to make the height of list selector sorter
.listMediaTypeSelector.q-field__control,
.listMediaTypeSelector.q-field--auto-height.q-field--dense .q-field__native,
.listMediaTypeSelector.q-field--auto-height.q-field--dense .q-field__control,
.listMediaTypeSelector.q-field--dense .q-field__marginal {
  height: 26px;
  min-height: 26px;
  line-height: 0px;
  padding: 0 4px;
}
</style>
