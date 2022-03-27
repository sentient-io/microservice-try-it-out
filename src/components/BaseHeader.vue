<template>
  <div>
    <!-- 
      Using v-show logic to display 404 error
      message if the document is  not found .
      Forget why don't use v-if, but there is
      a reason.
      -->
    <div
      v-show="Object.keys(rawDocRef).length === 0 || !rawDocRef.openapi"
      class="row items-center justify-center q-my-lg no-wrap"
    >
      <div class="q-mr-md">
        <q-icon name="mdi-telescope" size="4rem" color="grey-4" />
      </div>
      <div v-if="rawDocRef.openapi">
        <p>Oops, API documentation not found from the provided url below:</p>

        <a
          class="s-break-all text-green-8"
          :href="docPath"
          :target="isInIframe ? '_parent' : '_blank'"
          >{{ docPath }}</a
        >
      </div>
      <h5 v-else class="text-grey-7">
        Try It Out is currently not available for websocket APIs.
      </h5>
    </div>

    <h3 class="q-ma-none">
      {{ $t('tryItOut.header') }}
      {{ isInIframe ? null : `- ${rawDocRef?.info?.title}` }}

      <q-btn v-if="!isInIframe" class="float-right" to="/" icon="home" />
    </h3>
    <p>{{ $t('tryItOut.description') }}</p>

    <div v-if="!apiKey">
      <!-- Used mainly on platform, if an API key is attached with the 
      query url, don't need to display this section any more -->
      <BeforeYouStart />
      <APIKeyInput />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { tryItOutService } from 'src/services/TryItOut/TryItOut_service';
import { checkers } from 'src/services/checkers';

import BeforeYouStart from 'src/components/TryItOut/BeforeYouStart.vue';
import APIKeyInput from 'src/components/TryItOut/InputUnits/APIKeyInput.vue';

const { rawDocRef } = tryItOutService();
const { isInIframe } = checkers();

export default defineComponent({
  props: {
    docPath: {},
    apiKey: {},
  },
  components: {
    BeforeYouStart,
    APIKeyInput,
  },
  setup() {
    return { rawDocRef, isInIframe };
  },
});
</script>

<style lang="scss" scoped></style>
