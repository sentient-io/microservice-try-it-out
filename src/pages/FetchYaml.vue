<template>
  <div class="row justify-center items-center" style="height: 100vh">
    <div class="col-4 column q-gutter-lg">
      <q-input
        label="YAML Document URL"
        type="textarea"
        autogrow
        v-model="docPath"
        outlined
      />
      <!-- <q-input label="API Key" v-model="apiKey" type="password" outlined /> -->
      <q-btn
        class="self-center bg-green-6"
        label="Launch Try It Out"
        no-caps
        color="white"
        flat
        @click="goToUrlWithDocPathAndApiKey()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  components: {},
  setup() {
    const router = useRouter();
    const docPath = ref('');
    const apiKey = ref('');

    function goToUrlWithDocPathAndApiKey() {
      void router.push({
        path: '/try',
        query: {
          docPath: docPath.value,
          apiKey: apiKey.value,
        },
      });
    }
    return { docPath, apiKey, goToUrlWithDocPathAndApiKey };
  },
});
</script>

<style scoped></style>
