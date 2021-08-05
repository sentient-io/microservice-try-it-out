<template>
  <div>
    <TryItOut :docPath="docPath" :apiKey="apiKey" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import TryItOut from '../components/TryItOut/TryItOut.vue';

export default defineComponent({
  components: { TryItOut },
  props: { default: {} },
  setup() {
    const route = useRoute();

    return {
      docPath: computed(() => {
        return route.query.docPath;
      }),
      apiKey: computed(() => {
        return route.query.apiKey;
      }),
    };
  },
});
</script>

<style scoped></style>
