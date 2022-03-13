<template>
  <div>
    Display Results

    <div>{{ largeFileResult }}</div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import largeFileService from 'src/services/LargeFile/largeFileService';

const { useFetchLargeFileResult } = largeFileService();

export default defineComponent({
  props: {
    resultUrl: {},
  },
  setup(props) {
    const largeFileResult = ref('');
    onMounted(async () => {
      largeFileResult.value = await useFetchLargeFileResult(props.resultUrl);
      console.log(props);
    });

    return { largeFileResult };
  },
});
</script>

<style lang="scss" scoped></style>
