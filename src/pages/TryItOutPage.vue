<template>
  <div class="q-pa-md">
    <BaseHeader :doc-path="docPath" :api-key="apiKey" />
    <!-- 
      This will listen to window size change 
      and update parent latest  height (when 
      try it out been accessed via iframe) 
      -->
    <q-resize-observer @resize="postWindowHeight" />

    <!-- 
      Below content will only display when there is valid rawDocRef content
      -->
    <div v-show="Object.keys(rawDocRef).length !== 0 && rawDocRef.openapi">
      <TryItOutLargeFile
        v-if="isLargeFileRes"
        :api-key="apiKey"
        :doc-path="docPath"
      />
      <TryItOut v-else :api-key="apiKey" :doc-path="docPath" />
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { tryItOutService } from 'src/services/TryItOut/TryItOut_service';
import { checkers } from 'src/services/checkers';

import TryItOut from '../components/TryItOut/TryItOut.vue';
import TryItOutLargeFile from '../components/TryItOutLargeFile/TryItOutLargeFile.vue';
import BaseHeader from 'src/components/BaseHeader.vue';

const { rawDocRef, fetchApiDoc, apiResponse, setApiKey } = tryItOutService();
const { isLargeFile, isInIframe } = checkers();

export default defineComponent({
  components: { TryItOut, TryItOutLargeFile, BaseHeader },
  setup() {
    const route = useRoute();

    const apiKey = route.query.apiKey || '';

    const docPath = route.query.docPath;

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

    /** Consistantly update the window size to parent window */
    window.addEventListener('resize', postWindowHeight);

    fetchApiDoc(docPath).catch((err) => {
      console.log(err);
    });

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
      if (apiKey) {
        setApiKey(apiKey);
      }
      // postWindowHeight(); /** Send the size to parent window */
    });

    return {
      docPath,
      apiKey,
      rawDocRef,
      postWindowHeight,
      isLargeFileRes: computed(() => {
        return isLargeFile(rawDocRef);
      }),
    };
  },
});
</script>

<style scoped></style>
