<template>
  <q-layout
    view="lHh Lpr lFf"
    style="margin: auto; max-width: 1200px"
    class="q-pa-md"
  >
    <q-page-container class="q-pa-md" :class="debugMode ? 'debugMode' : ''">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import { debugMode } from "src/services/appService";

export default defineComponent({
  setup() {
    return { debugMode };
  },
});
</script>

<style scoped>
.debugMode {
  border: 4px solid #c10000;
}
</style>
