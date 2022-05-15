<template>
  <div>
    <span :style="textStyle" v-html="trimedContent()"></span>
    <span
      :style="textStyle"
      v-show="contentNeedsToTrim()"
      @click="
        () => {
          showMore = !showMore;
        }
      "
      class="q-px-sm cursor-pointer s-underline"
      :class="showMore ? 'text-orange-8' : 'text-green-8'"
    >
      {{ hideShowButtonText() }}</span
    >
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    content: { type: String, default: '' },
    trimAt: { type: Number, default: 30 },
    textStyle: {},
  },
  setup(props) {
    const showMore = ref(false);

    function contentNeedsToTrim() {
      if (props.content.length <= props.trimAt) {
        return false;
      }
      return true;
    }

    function trimedContent() {
      if (showMore.value) {
        return props.content;
      }

      if (contentNeedsToTrim()) {
        return props.content.slice(0, props.trimAt) + '...';
      }
      return props.content;
    }

    function hideShowButtonText() {
      if (showMore.value) {
        return 'Show Less';
      }
      return 'Show More';
    }

    return {
      showMore,
      trimedContent,
      contentNeedsToTrim,
      hideShowButtonText,
    };
  },
});
</script>

<style lang="scss" scoped></style>
