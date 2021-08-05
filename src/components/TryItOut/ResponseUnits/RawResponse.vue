<template>
  <div>
    <p>
      {{ $t('tryItOut.response.rawResponse.description') }}
    </p>

    {{ apiResponse }}

    <div class="q-mt-md">
      <div class="row justify-between items-center">
        <b>{{ $t('terms.response_code') }} : {{ apiResponse.status }} </b>
        <DownloadResponseAs :response="JSON.stringify(apiResponse.response)" />
      </div>

      <div>
        <q-btn
          label="Copy"
          icon="content_copy"
          class="q-ma-sm absolute"
          color="white"
          outline
          style="right: 1rem"
          size="sm"
          @click="copyResponse()"
        ></q-btn>

        <pre class="language-javascript n-code q-px-lg">
        <code>
          <!-- Alwayrs make sure the below line is not indentedF -->
{{ formatJsonString(JSON.stringify(apiResponse.response)) }}
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
    const { formatJsonString } = tryItOutService();

    function copyResponse() {
      copyToClipboard(props.apiResponse.response);
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

    return { copyResponse, formatJsonString };
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
.n-code {
  background: hsl(90, 10%, 10%);
  color: hsl(100, 100%, 80%);
}
</style>
