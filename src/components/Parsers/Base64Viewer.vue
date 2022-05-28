<template>
  <div class="fit row items-center">
    <img class="fit" :src="base64str" v-if="mediaType == 'image'" />
    <audio
      controls
      class="full-width"
      v-else-if="mediaType == 'audio'"
      :src="base64str"
    ></audio>
    <video
      controls
      class="fit"
      :src="base64str"
      v-else-if="mediaType == 'video'"
    ></video>
    <p v-else class="q-ma-none">
      This media type is currently not supported for preview.
    </p>
  </div>
</template>

<script setup>
/**
 * TODO: Make JSON binary file available to preview
 * Reference:
 * https://stackoverflow.com/questions/38134200/base64-encode-a-javascript-object
 */
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  base64str: {},
});

const mediaType = ref();

const MIME_IMAGE_TYPES = [
  "image/apng",
  "image/png",
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
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

const init = () => {
  getBase64MediaType();
};

onMounted(() => {
  init();
});

watch(
  () => props.base64str,
  () => init()
);
</script>

<style lang="scss" scoped></style>
