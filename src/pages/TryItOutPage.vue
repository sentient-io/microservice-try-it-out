<template>
  <div class="q-pa-md">
    {{ docPath }}
    {{ route.query }}
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
        v-if="isLargeFileRes && docClass"
        :api-key="apiKey"
        :doc-path="docPath"
      />
      <TryItOut v-else :api-key="apiKey" :doc-path="docPath" />
    </div>
  </div>
</template>

<script>
import {
  ref,
  defineComponent,
  computed,
  onMounted,
  onUnmounted,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { tryItOutService } from 'src/services/TryItOut/TryItOut_service';
import { checkers } from 'src/services/checkers';

import TryItOut from '../components/TryItOut/TryItOut.vue';
import TryItOutLargeFile from '../components/TryItOutLargeFile/TryItOutLargeFile.vue';
import BaseHeader from 'src/components/BaseHeader.vue';

const { rawDocRef, fetchApiDoc, apiResponse, setApiKey, docClass } =
  tryItOutService();
const { isLargeFile, isInIframe } = checkers();

export default defineComponent({
  components: { TryItOut, TryItOutLargeFile, BaseHeader },
  setup() {
    const route = useRoute();

    const apiKey = route.query.apiKey || '';

    const docPath = ref('');
    docPath.value = route.query.docPath;

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

    fetchApiDoc(docPath.value).catch((err) => {
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
      console.log('Try It Out Mounted');
      // postWindowHeight(); /** Send the size to parent window */
    });

    onUnmounted(() => {
      /**
       * Reset the doc ref value, potentially reset the doc class
       * value as well, to prevent cashed data in UI
       */
      rawDocRef.value = '';
    });

    /**
     * Watching query parameters in URL change, reload yaml docs
     */
    watch(
      () => route.query.docPath,
      () => {
        docPath.value = route.query.docPath;
        // Reset docClass to trigger re-draw large file try it out
        docClass.value = '';
        fetchApiDoc(docPath.value).catch((err) => {
          console.log(err);
        });
      }
    );

    return {
      docPath,
      apiKey,
      rawDocRef,
      docClass,
      route,
      postWindowHeight,
      isLargeFileRes: computed(() => {
        return isLargeFile(rawDocRef);
      }),
    };
  },
});
</script>

<style scoped></style>
