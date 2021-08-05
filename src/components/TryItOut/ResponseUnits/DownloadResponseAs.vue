<template>
  <div>
    <q-btn-dropdown no-caps flat label="Download Response">
      <q-list>
        <q-item v-for="(item, idx) in downloadOptions" :key="idx">
          <q-item-section>
            <q-item-label class="row justify-center stretch">
              <q-btn
                @click="downloadResponse(item.type)"
                flat
                no-caps
                class="full-width"
                :label="'Download as .' + item.type"
              />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { defineComponent } from 'vue';
import exportFromJSON from 'export-from-json';

export default defineComponent({
  props: { response: { type: String, required: true } },
  setup(props) {
    const downloadOptions = [{ type: 'txt' }, { type: 'json' }];

    function downloadResponse(type: string) {
      if (type == 'txt') {
        exportFromJSON({
          data: props.response,
          fileName: 'Response',
          exportType: exportFromJSON.types.txt,
        });
      } else {
        exportFromJSON({
          data: JSON.parse(props.response),
          fileName: 'Response',
          exportType: exportFromJSON.types.json,
        });
      }
    }
    return { downloadOptions, downloadResponse };
  },
});
</script>

<style scoped></style>
