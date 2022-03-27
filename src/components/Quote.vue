<template>
  <!-- Last update 2022-Mar-24 -->
  <div>
    <q-card
      flat
      class="flex row items-center no-wrap q-pa-xs"
      :class="'quote'"
      :style="`border-radius: 6px;border-right: 6px solid ${color};border-left: 6px solid ${color}; background-color: ${color}26`"
    >
      <q-icon
        size="sm"
        :name="icon"
        class="q-mr-sm"
        :style="`color:${color}`"
      />
      <small :style="`color:${color}`">{{ content }}</small>
    </q-card>
  </div>
</template>

<script>
export default {
  props: {
    icon: {},
    content: {},
    color: {},
  },
};
</script>

<style lang="scss" scoped></style>
