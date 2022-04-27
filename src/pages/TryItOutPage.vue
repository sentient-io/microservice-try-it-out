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
    <div v-show="!!docClass && isValidOpenApiDoc">
      <TryItOutLargeFile
        v-if="isSentientLargeFile"
        :api-key="apiKey"
        :doc-path="docPath"
      />
      <TryItOut
        v-else-if="isSingleEndpoint"
        :api-key="apiKey"
        :doc-path="docPath"
      />
      <div v-else>
        <p class="text-center q-ma-none">
          Try It Out is currently not support for this microservice.
        </p>
      </div>
    </div>

    <div v-show="isFetchingMicroserviceDoc">
      <p class="text-center q-ma-none">Loading microservice document ...</p>
    </div>

    <div v-show="!isFetchingMicroserviceDoc && !isValidOpenApiDoc">
      <p class="text-center q-ma-none">
        Try It Out is currently not support for this microservice.
      </p>
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

    const isSentientLargeFile = ref();
    const isSingleEndpoint = ref();
    const isValidOpenApiDoc = ref();
    const isFetchingMicroserviceDoc = ref(false);

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

    const init = () => {
      console.log('Init try it out page');
      console.log(
        route.fullPath.split('?docPath=')[1].split('.yaml')[0].includes('&')
      );

      docPath.value = getDocPath();
      // Reset docClass to trigger re-draw large file try it out
      docClass.value = '';
      if (!docPath.value) return;
      isFetchingMicroserviceDoc.value = true;
      fetchApiDoc(docPath.value)
        .then(() => {
          isValidOpenApiDoc.value = docClass.value.isValidOpenApiDoc();
          isSentientLargeFile.value = docClass.value.isSentientLargeFile();
          isSingleEndpoint.value = docClass.value.isSingleEndpoint();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          isFetchingMicroserviceDoc.value = false;
        });
    };

    const getDocPath = () => {
      /**
       * Added 2022 Apr 27
       * Some of the url contains "&" special character, vue route
       * will read is as a quqery splitter and cause error.
       *  */

      /**
       * CroppedDocPath will get the string in-between ?docPath=
       * and .yaml, that will be the full yaml doc path.
       *  */
      const croppedDocPath = route.fullPath
        .split('?docPath=')[1]
        .split('.yaml')[0];
      if (croppedDocPath.includes('&')) {
        return croppedDocPath + '.yaml';
      } else {
        return route.query.docPath;
      }
    };

    // fetchApiDoc(docPath.value).catch((err) => {
    //   console.log(err);
    // });

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
      init();
      // postWindowHeight(); /** Send the size to parent window */
    });

    onUnmounted(() => {
      /**
       * Reset the doc ref value, potentially reset the doc class
       * value as well, to prevent cashed data in UI
       */
      rawDocRef.value = '';
      docClass.value = '';
    });

    /**
     * Watching query parameters in URL change, reload yaml docs
     */
    watch(
      () => route.query.docPath,
      () => {
        init();
      }
    );

    return {
      docPath,
      apiKey,
      rawDocRef,
      docClass,
      postWindowHeight,
      isLargeFileRes: computed(() => {
        return isLargeFile(rawDocRef);
      }),
      isSentientLargeFile,
      isSingleEndpoint,
      isValidOpenApiDoc,
      isFetchingMicroserviceDoc,
    };
  },
});
</script>

<style scoped></style>
