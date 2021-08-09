<template>
  <div class="q-mx-sm">
    <q-icon :name="icon" class="cursor-pointer">
      <q-menu v-model="show" persistent>
        <div class="flex row justify-between items-center q-ma-md q-pb-md s-border-b">
          <h6 class="q-pa-none q-ma-none">{{ title }}</h6>
          <q-btn size="md" dense @click="close" flat icon-right="close" no-caps
            >Close</q-btn
          >
        </div>
        <div class="q-ma-md">
          <slot></slot>
        </div>
      </q-menu>
    </q-icon>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  props: {
    title: { type: String, default: 'Some Title' },
    icon: { type: String, default: 'favorite' },
  },
  setup() {
    const show = ref(false);

    function close() {
      show.value = false;
    }

    return {
      show,
      close,
    };
  },
};
</script>

<style lang="scss" scoped></style>
