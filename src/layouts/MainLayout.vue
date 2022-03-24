<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="full-width">
      <router-view style="max-width: 1200px" class="q-mx-auto" />
      <div class="text-center"><small>Try It Out Version: v0.1.0</small></div>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  components: {},

  setup() {
    return {};
  },
});
</script>
