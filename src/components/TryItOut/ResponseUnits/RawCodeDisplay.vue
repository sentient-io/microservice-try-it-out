<template>
  <div>
    <!-- <p>
      {{ $t('tryItOut.response.rawResponse.description') }}
    </p> -->

    <!-- {{ apiResponse }} -->

    <div class="q-mt-md">
      <div class="row justify-between items-center">
        <b :class="apiResponse.status[0] === '2' ? 'text-green-8' : 'text-red'"
          >{{ $t('terms.response_code') }} : {{ apiResponse.status }} -
          {{ apiResponse.statusDescription }}
        </b>
        <DownloadResponseAs :response="JSON.stringify(apiResponse.response)" />
      </div>

      <div>
        <q-btn
          label="Copy"
          icon="content_copy"
          class="q-ma-sm absolute"
          color="white"
          outline
          style="right: 2rem"
          size="sm"
          @click="copyResponse()"
        ></q-btn>

        <pre
          class="language-javascript s-code q-px-lg"
          style="max-height: 50vh; overflow: scroll"
        >
        <code style="word-break:break-all;  white-space:break-spaces">
          <!-- Alwayrs make sure the below line is not indentedF -->
{{ apiResponse }}
          </code>
          </pre>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */

/** Loads the stylesheet for VueCodeHighlight */
// import 'prismjs/themes/prism-tomorrow.css';
import DownloadResponseAs from './DownloadResponseAs.vue';
import { copyToClipboard } from 'quasar';
import { Notify } from 'quasar';

import { tryItOutService } from '../../../services/TryItOut/TryItOut_service';

// import Highlight from '@puge/highlight';

export default {
  components: { DownloadResponseAs },
  props: {
    apiResponse: { type: Object, required: true },
  },
  setup(props) {
    const { isInIframe } = tryItOutService();

    function copyResponse() {
      if (isInIframe) {
        window.top.postMessage(
          { responseToCopy: props.apiResponse.response },
          '*'
        );
      } else {
        copyToClipboard(props.apiResponse.response);
      }

      Notify.create({
        message: 'Response Copied To Clipboard',
        color: 'green-6',
        actions: [
          {
            label: 'Dismiss',
            color: 'white',
            handler: () => {
              return null;
            },
          },
        ],
        timeout: 1000,
        position: 'center',
      });
    }

    return { copyResponse };
  },
};
</script>

<style lang="scss">
/** For code display component */
.n-code-container pre {
  height: 50vh;
  margin: 0px !important;
}
pre.language-javascript {
  border-radius: 8px !important;
}
</style>
