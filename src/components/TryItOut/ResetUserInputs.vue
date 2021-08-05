<template>
  <div>
    <q-btn
      no-caps
      dense
      flat
      class="q-ml-md"
      color="brown-4"
      @click="emit('resetInputs')"
    >
      <q-icon name="refresh" class="q-mr-xs" size="xs" />
      {{ $t('tryItOut.resetUserInput') }}
    </q-btn>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  setup(_, { emit }) {
    return { emit };
  },
});
</script>

<style lang="scss" scoped></style>
