<template>
  <div class="q-mb-sm">
    <q-expansion-item
      dense
      dense-toggle
      :class="
        _status == 'success'
          ? 'bg-green-1'
          : _status == 'failure'
          ? 'bg-red-1'
          : 'bg-yellow-1'
      "
      :label="label"
      style="border: 1px solid rgba(128, 128, 128, 0.25)"
    >
      <div class="q-pt-md q-px-sm">
        <RawRes :response="response" />
      </div>
    </q-expansion-item>

    <small
      class="q-pa-sm"
      :class="_status == 'success' ? 'text-green-6' : 'text-red-6'"
      >{{ responseMessage }}</small
    >
  </div>
</template>

<script setup>
import RawRes from "src/components/ReqRes/RawRes.vue";
import { computed } from "vue";

const props = defineProps({
  response: {},
  status: {},
  responseMessage: {},
  label: { type: String, default: "API Call Response" },
});

const _status = computed(() => props.status?.toLowerCase());
</script>

<style lang="scss" scoped></style>
