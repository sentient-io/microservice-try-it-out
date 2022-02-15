<template>
  <div>
    Upload Large File

    <q-file v-model="file" label="Upload" />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const file = ref();

    return { file };
  },
});
</script>

<style lang="scss" scoped></style>
