<template>
  <div class="flex row items-center q-my-sm">
    <p>{{ label }}</p>
    <q-btn-group rounded class="q-ml-sm">
      <q-btn
        dense
        v-for="(option, idx) in options"
        :key="idx"
        :label="option"
        no-caps
        @click="select(idx)"
        :color="options[selected] === option ? 'green-7' : 'grey-4'"
        :class="options[selected] === option ? 'text-white' : 'text-grey-6'"
        class="q-px-sm"
      />
    </q-btn-group>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    options: { type: Array, required: true },
    label: { type: String },
    selectedIdx: { type: Number, default: 0 },
  },
  setup(props, { emit }) {
    const selected = ref(props.selectedIdx);

    function select(idx) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      selected.value = idx;
      emit('select', idx);
    }

    return { select, selected };
  },
});
</script>

<style lang="scss" scoped></style>
