<template>
  <div style="width: 320px; height: 220px">
    <p class="q-mb-sm">Recorde voice and upload as base64 string.</p>
    <div
      v-if="recordingState < 2"
      class="flex column justify-center items-center"
    >
      <div v-if="recordingState === 0" class="flex column justify-center">
        <div class="flex row items-center q-my-lg">
          <p class="q-mr-sm">Please Select Sample-rate:</p>
          <q-select
            v-model="sampleRate"
            dense
            outlined
            :options="sampleRateOptions"
          ></q-select>
        </div>

        <q-btn
          @click="startRecording()"
          label="Start Recording"
          icon="mic"
          color="green-7"
          no-caps
        />
      </div>

      <div v-else>
        <div class="flex row justify-center items-center q-py-lg">
          <q-spinner-puff color="primary" size="2em"></q-spinner-puff>
          <p>Recording ...</p>
        </div>
        <q-btn
          @click="stopRecording()"
          label="Stop and Upload as base64"
          icon="pause"
          no-caps
          color="green-7"
        ></q-btn>
      </div>
    </div>
    <div v-else>
      <div v-if="!base64" class="q-my-md flex row justify-center items-center">
        <q-spinner-audio color="green-7" class="q-mr-sm" />
        <p class="text-green-7">Processing audio ...</p>
      </div>
      <div v-else class="flex column items-center">
        <div class="q-mt-sm flex row justify-center items-center no-wrap">
          <q-icon
            name="task_alt"
            color="green-7"
            size="md"
            class="q-mr-sm"
          ></q-icon>
          <p class="text-green-7">
            Recorded audo had been converted to base64. Please close this window
            and continue try it out.
          </p>
        </div>
        <audio :src="base64" controls class="q-my-sm block q-mx-auto"></audio>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */

import RecordRTC from 'recordrtc';
import { ref } from 'vue';

export default {
  setup(_, { emit }) {
    const base64 = ref('');
    const sampleRate = ref(16000);
    const sampleRateOptions = [8000, 16000, 24000];
    let recorder;
    let recordingState = ref(0); //0:not started ,1:recording, 2:done

    const recorderRtcConfig = {
      type: 'audio',
      mimeType: 'audio/wav',
      recorderType: RecordRTC.StereoAudioRecorder,
      frameRate: sampleRate.value,
      desiredSampRate: sampleRate.value,
      numberOfAudioChannels: 1,
      bufferSize: 16384,
      disableLogs: true,
    };

    // Instatiate getUserMedia to get mic
    const getUserMedia = (
      navigator.mediaDevices.getUserMedia ||
      navigator.mediaDevices.webkitGetUserMedia ||
      navigator.mediaDevices.mozGetUserMedia ||
      navigator.mediaDevices.msGetUserMedia
    ).bind(navigator.mediaDevices);

    function startRecording() {
      getUserMedia({ audio: true }).then((stream) => {
        recorderRtcConfig.frameRate = sampleRate.value;
        recorderRtcConfig.desiredSampRate = sampleRate.value;
        recorder = RecordRTC(stream, recorderRtcConfig);
        console.log(recorderRtcConfig);
        recorder.startRecording();
        recordingState.value = 1;
      });
    }

    function stopRecording() {
      /** Stop recording and emit the base64 string to parent component */
      recorder.getDataURL(function (dataURL) {
        base64.value = dataURL;
        emit('convertToBase64', dataURL.split(',')[1]);
      });
      recorder.stopRecording();
      recordingState.value = 2;
    }

    return {
      base64,
      sampleRate,
      sampleRateOptions,
      startRecording,
      stopRecording,
      recordingState,
    };
  },
};
</script>

<style lang="scss" scoped></style>
