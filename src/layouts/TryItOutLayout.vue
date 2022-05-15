<template>
  <q-layout view="lHh Lpr lFf" style="margin: auto; max-width: 1200px">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>
