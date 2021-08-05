<template>
  <div class="flex row justify-center items-center q-ma-md">
    <p>{{ $t('tryItOut.apiKey') }} :</p>

    <q-input
      :model-value="apiKey"
      :type="showApiKey ? 'text' : 'password'"
      dense
      outlined
      @update:model-value="(val) => setApiKey(val)"
      class="n-key-input q-pt-md"
      placeholder="API Key"
      :error-message="$t('tryItOut.apiKeyErrMsg')"
      :error="apiKey ? false : true"
    />

    <q-icon
      :name="showApiKey ? 'visibility_off' : 'visibility'"
      size="sm"
      @click="showApiKey = !showApiKey"
      class="cursor-pointer"
      color="grey"
    />

    <!-- Helper tool tip -->
    <q-icon
      name="help_outline"
      size="sm"
      color="grey"
      class="q-mx-lg"
      @mouseenter="helpCtr.show"
      @mouseout="helpCtr.hide"
    >
      <q-menu
        v-model="showHelp"
        @mouseover="helpCtr.clearTimer"
        @mouseout="helpCtr.hide"
        anchor="bottom middle"
        self="top middle"
      >
        <div class="n-tooltip flex column">
          <p class="q-mb-md" v-html="$t('tryItOut.apiKeyTooltip')"></p>
          <a
            href="https://platform.sentient.io"
            target="_blank"
            class="block q-mx-auto"
          >
            <q-btn
              color="green-6"
              :label="$t('tryItOut.goToMicroservicePage')"
              icon="open_in_new"
              no-caps
          /></a>
        </div>
      </q-menu>
    </q-icon>
  </div>
</template>

<script>
import { ref } from 'vue';
import { tryItOutService } from '../../../services/TryItOut/TryItOut_service';

export default {
  props: {},
  setup() {
    /** When component loaded, get the api key from local storage */
    const { apiKey, setApiKey } = tryItOutService();
    // const apikey = ref(localStorage.getItem("sentientApiKey"));
    const showApiKey = ref(false);

    /** When user input API key, save them in to local storage */
    // function setApiKey() {
    //   localStorage.setItem("sentientApiKey", apikey.value);
    // }

    /** Help tool tip for API key input fields */
    const showHelp = ref(false);
    let timer = null;

    function test(test) {
      console.log('test', test);
    }

    const helpCtr = {
      show() {
        showHelp.value = true;
      },
      hide() {
        timer = setTimeout(() => {
          showHelp.value = false;
        }, 400);
      },
      clearTimer() {
        clearTimeout(timer);
      },
    };

    return { test, apiKey, setApiKey, showApiKey, showHelp, helpCtr };
  },
};
</script>

<style lang="scss" scoped>
.n-key-input {
  max-width: 320px;
  width: 100%;
  margin: 0 1rem;
}
.n-tooltip {
  margin: 1rem;
  max-width: 350px;
}
</style>
