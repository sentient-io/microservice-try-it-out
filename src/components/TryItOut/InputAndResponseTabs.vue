<template>
  <div class="s-border-u">
    <q-tabs
      v-model="inputAndResponseTab"
      no-caps
      :breakpoint="9999"
      align="justify"
      indicator-color="transparent"
      class="or-tryout bg-grey-4 text-grey-6"
      dense
      active-bg-color="green-7"
      active-color="white"
    >
      <q-tab name="input" value="input" label="Input" class="col-6" />
      <q-tab
        name="response"
        value="response"
        label="Response"
        class="col-6"
        :disable="!apiResponse"
      />
    </q-tabs>

    <q-tab-panels v-model="inputAndResponseTab">
      <!-- Input -->
      <q-tab-panel name="input">
        <slot name="input"></slot>
      </q-tab-panel>

      <!-- Response -->
      <q-tab-panel name="response">
        <slot name="response"></slot>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: { apiResponse: {} },
  setup() {
    const inputAndResponseTab = ref('input');

    function toggleResponseTab() {
      inputAndResponseTab.value = 'response';
    }

    function toggleInputTab() {
      inputAndResponseTab.value = 'input';
    }

    return { inputAndResponseTab, toggleResponseTab, toggleInputTab };
  },
});
</script>

<style lang="scss" scoped></style>
