<template>
  <div class="q-mb-md">
    <div v-if="type == 'boolean'">
      <q-checkbox
        :label="label"
        v-model="param"
        @update:model-value="userInput"
      />
    </div>

    <div v-else>
      <q-input
        :label="label"
        :type="type"
        outlined
        hide-bottom-space
        bottom-slots
        input-style="max-height:120px"
        v-model="param"
        :error-message="'Field required'"
        @input="userInput"
      >
      </q-input>
    </div>

    <ReadMore
      :content="description"
      :trim-at="130"
      text-style="font-size:0.8rem"
      class="q-mx-sm"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import ReadMore from 'src/components/TryItOut/ReadMore.vue';

export default defineComponent({
  props: { label: {}, default: {}, type: {}, required: {}, description: {} },
  components: { ReadMore },
  setup(props, { emit }) {
    const param = ref();

    function init() {
      param.value = props.default;
      userInput();
    }

    function userInput() {
      emit('input', param.value);
    }

    init();

    return { param, userInput };
  },
});
</script>

<style lang="scss" scoped></style>
