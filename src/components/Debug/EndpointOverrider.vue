<template>
  <div>
    <q-form @submit="useOverrideEndpoint">
      <div class="row full-width no-wrap items-center q-gutter-sm">
        <q-input
          outlined
          dense
          v-model="newEndpoint"
          label="New Endpoint"
          class="full-width"
        />
        <q-btn
          no-caps
          color="red"
          label="Override Endpoint"
          type="submit"
          style="min-width: 150px"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { setEndpoint, endpoint } from "src/services/tryItOutService";

import { debugState, debugService } from "src/services/debugService";

const { overrideEndpoint } = debugService();

const newEndpoint = ref();

const useOverrideEndpoint = () => {
  console.warn(
    "\nWarning!Warning!Warning!\nYou are using a debug function - Override Endpoint. This fucntion is built for internal testing only.",
    "\nEndpoint been set to:\n",
    newEndpoint.value
  );
  overrideEndpoint(newEndpoint.value);
};

onMounted(() => {
  newEndpoint.value = endpoint.value;
});

watch(endpoint, () => {
  newEndpoint.value = endpoint.value;
  overrideEndpoint("");
});
</script>

<style lang="scss" scoped></style>
