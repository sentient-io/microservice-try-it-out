<template>
  <div>
    <h6 class="q-mb-lg q-mt-sm">RTC Audio Recorder</h6>
    <div style="height: 12.3rem">
      <div class="row items-center justify-center q-gutter-sm q-mb-md">
        <span>Sample Rate:</span>
        <q-select
          dense
          outlined
          :disable="recordingState !== 0"
          class="dense_selector"
          v-model="sampleRate"
          :options="sampleRateOptions"
        />
      </div>

      <!-- Start Recoding -->
      <div
        class="full-height column items-center q-py-lg"
        v-if="recordingState == 0"
      >
        <q-btn
          round
          outline
          size="xl"
          icon="mic"
          color="green-6"
          @click="startRecording()"
        />
        <small class="q-mt-lg text-grey-7">Start Recording</small>
      </div>

      <!-- Recording -->
      <div
        v-else-if="recordingState == 1"
        class="full-height column items-center"
      >
        <div class="row items-center justify-center">
          <q-btn
            round
            outline
            size="xl"
            class="absolute"
            color="orange-6"
            icon="stop"
            @click="stopRecording()"
          />
          <q-spinner-puff color="orange-3" size="8rem" />
        </div>

        <small class="text-grey-7">Recording ...</small>
      </div>

      <!-- Preview Recording -->
      <div v-else class="row full-height justify-center items-center q-pb-xl">
        <p v-if="!audioBase64" class="text-grey-7">Processing audio ...</p>

        <div v-else class="row items-center q-gutter-md">
          <audio controls>
            <source :src="audioBase64" />
          </audio>
          <div>
            <q-btn
              round
              size="md"
              icon="restart_alt"
              color="grey-7"
              @click="resetRecording()"
            >
              <q-tooltip> Restart recoding</q-tooltip></q-btn
            >
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-center q-my-md">
      <q-checkbox
        label="Keep base64 data URI header"
        v-model="keepBase64Header"
      />
    </div>
    <div class="row justify-center q-gutter-lg q-mb-md">
      <q-btn no-caps label="Cancel" flat @click="emitCancel()" />
      <q-btn
        flat
        no-caps
        color="white"
        label="Save Audio Base64"
        class="bg-primary"
        :disable="!audioBase64"
        @click="emitBase64()"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useQuasar } from "quasar";
import RecordRTC from "recordrtc";

const $q = useQuasar();

// Decide if uploading image with base64 header
const keepBase64Header = ref(false);

const emit = defineEmits(["cancel", "update"]);

const audioBase64 = ref();

const sampleRate = ref(16000);
const sampleRateOptions = [8000, 16000, 24000];

const recorderRtcConfig = {
  type: "audio",
  mimeType: "audio/wav",
  recorderType: RecordRTC.StereoAudioRecorder,
  frameRate: sampleRate.value,
  desiredSampRate: sampleRate.value,
  numberOfAudioChannels: 1,
  bufferSize: 16384,
  disableLogs: true,
};

let recorder;
let recordingState = ref(0); //0:not started ,1:recording, 2:done

// Instatiate getUserMedia to get mic
const getUserMedia = (
  navigator.mediaDevices.getUserMedia ||
  navigator.mediaDevices.webkitGetUserMedia ||
  navigator.mediaDevices.mozGetUserMedia ||
  navigator.mediaDevices.msGetUserMedia
).bind(navigator.mediaDevices);

const startRecording = () => {
  getUserMedia({ audio: true }).then((stream) => {
    recorderRtcConfig.frameRate = sampleRate.value;
    recorderRtcConfig.desiredSampRate = sampleRate.value;
    recorder = RecordRTC(stream, recorderRtcConfig);
    console.log(recorderRtcConfig);
    recorder.startRecording();
    recordingState.value = 1;
  });
};

const stopRecording = () => {
  /** Stop recording and store the base64 string */
  console.log("Stopped recording");
  recorder.getDataURL(function (dataURL) {
    audioBase64.value = dataURL;
    console.log(dataURL);
  });
  recorder.stopRecording();
  recordingState.value = 2;
};

const emitCancel = () => {
  emit("cancel");
};

const resetRecording = () => {
  recordingState.value = 0;
  audioBase64.value = "";
};

const emitBase64 = () => {
  if (keepBase64Header.value) {
    emit("base64update", audioBase64.value);
  } else {
    // Upload base64 without media type uri header
    emit("base64update", audioBase64.value.split(",")[1]);
  }
  $q.notify(`Recorded audio been uploaded as base64 string.`);
};
</script>

<style lang="scss" scoped></style>
