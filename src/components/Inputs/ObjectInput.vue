<template>
  <div>
    <div class="object_preview_area">
      <pre class="q-ma-none" @click="showEditPopup = true">{{ object }}</pre>
    </div>

    <q-dialog v-model="showEditPopup">
      <q-card class="q-pa-md">
        <h6 class="q-ma-none">Edit Object</h6>
        Test showEditPopup
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  object: {},
});

const showEditPopup = ref();
</script>

<style lang="scss" scoped>
.object_preview_area {
  white-space: pre-wrap;
  line-break: anywhere;
  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 4px;
  max-height: 140px;
  padding: 0.7rem;
  overflow-y: scroll;
  cursor: pointer;
}
.object_preview_area:hover {
  border-color: $primary;
  border-width: 2px;
  box-shadow: 0px;
}
.object_preview_area pre {
  font-size: 0.8rem;
  border: 1px solid rgba(0, 0, 0, 0);
}
.object_preview_area:hover pre {
  border-width: 0px;
}
</style>
