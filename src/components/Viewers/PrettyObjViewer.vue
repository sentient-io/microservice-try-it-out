<template>
  <div>
    <div v-for="(val, key) in object" :key="key">
      <!-- Recursive loop -->
      <q-expansion-item
        dense
        dense-toggle
        :model-value="isExpandLocal"
        class="q-my-xs"
        style="border: 1px solid rgba(128, 128, 128, 0.25)"
        :caption="countChildElem(val)"
        :label="(Array.isArray(object) ? '(Array item) ' : '') + key"
        ><div class="q-ml-md">
          <PrettyObjViewer v-if="typeof val == 'object'" :object="val" />
          <!-- Actual value display -->
          <div v-else class="bg-grey-2 q-pa-sm q-my-sm q-mr-md">
            <!-- Base64 display -->
            <div v-if="isBase64(val)">
              <div class="row items-center q-pa-sm">
                <p
                  style="max-width: 420px; line-height: 1"
                  class="q-ma-none q-mr-sm"
                >
                  <small
                    >The response below seems to be a Base64 String.
                  </small>
                </p>
                <div>
                  <q-btn
                    outline
                    dense
                    size="0.7rem"
                    no-caps
                    icon="preview"
                    color="primary"
                    label="Preview base64 Media"
                    @click="showBase64Viewer = true"
                  />
                </div>
              </div>
              <ObjectViewer display-style="max-height:220px" :object="val" />

              <!-- Base64 Viewer -->
              <q-dialog v-model="showBase64Viewer">
                <q-card class="q-pa-md">
                  <Base64Viewer
                    :base64str="val"
                    @cancel="showBase64Viewer = false"
                  />
                </q-card>
              </q-dialog>
            </div>

            <!-- Default, text display -->
            <div v-else>
              <p class="q-ma-none">{{ val }}</p>
            </div>
          </div>
        </div>
      </q-expansion-item>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from "vue";
import { prettyResExpandAll } from "src/services/appService";
import { isBase64 } from "src/services/utils";

import PrettyObjViewer from "src/components/Viewers/PrettyObjViewer.vue";
import ObjectViewer from "src/components/Viewers/ObjectViewer.vue";
import Base64Viewer from "src/components/Viewers/Base64Viewer.vue";

export default defineComponent({
  name: "PrettyObjViewer",
  props: { object: {} },
  components: { ObjectViewer, Base64Viewer },
  setup() {
    const countChildElem = (obj) => {
      let childElemCount;
      if (typeof obj == "object") {
        childElemCount = Object.entries(obj).length;
      } else {
        childElemCount = 1;
      }
      const message = "item(s) nested.";
      return childElemCount + " " + message;
    };

    const isExpandLocal = ref(false);

    const showBase64Viewer = ref(false);

    watch(prettyResExpandAll, () => {
      console.log("watching prettyResExpandAll", prettyResExpandAll.value);
      if (prettyResExpandAll.value) {
        isExpandLocal.value = true;
      } else {
        isExpandLocal.value = false;
      }
    });
    return {
      isBase64,
      isExpandLocal,
      countChildElem,
      showBase64Viewer,
    };
  },
});
</script>

<style lang="scss" scoped></style>
