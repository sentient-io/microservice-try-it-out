<template>
  <div>
    <q-card
      flat
      class="flex row items-center no-wrap q-my-md bg-beige-2 n-quote"
    >
      <q-icon name="emoji_people" size="lg" class="q-mr-sm" />
      <p>{{ $t("tryItOut.beforeYouStart") }}</p>
    </q-card>
  </div>
</template>

<script>
export default {
  setup() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.n-quote {
  padding: 0.5rem;
  border-radius: 6px;
  border-right: 6px solid #cbac81;
  border-left: 6px solid #cbac81;
}

.n-quote i {
  color: #cbac81;
}
</style>
