<template>
  <div>
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
        <div class="q-mr-sm">
          <JsonDataInput :inputProperties="inputProperties"></JsonDataInput>
        </div>
      </template>
      <template v-slot:after>
        <div class="q-ml-sm s-code-container">
          <pre
            class="q-pa-md bg-grey-3 brder-round-4"
          ><code >{{ parseInputPropertiesToQueryStr(inputProperties) }}</code></pre>
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script>
// import { component as VueCodeHighlight } from 'vue-code-highlight';
/** Loads the stylesheet for VueCodeHighlight */
// import "prismjs/themes/prism-tomorrow.css";

import { defineComponent, ref } from 'vue';
import JsonDataInput from './JsonDataInput.vue';

import { tryItOutService } from '../../../services/TryItOut/TryItOut_service';
export default defineComponent({
  components: {
    JsonDataInput,
    // VueCodeHighlight
  },
  props: { inputProperties: {} },
  setup() {
    const { parseInputPropertiesToQueryStr } = tryItOutService();
    const splitterModel = ref(50);
    return {
      splitterModel,
      parseInputPropertiesToQueryStr,
    };
  },
});
</script>

<style lang="scss"></style>
