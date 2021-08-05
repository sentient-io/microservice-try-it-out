<template>
  <div>
    <div class="flex row justify-between q-my-md">
      <div class="flex row items-center">
        <b class="q-mr-sm">{{ $t('tryItOut.endPoint') }} </b>
        <div class="flex row no-wrap items-center">
          <p>{{ server }}</p>
          <q-select
            dense
            class="q-pa-xs"
            outlined
            :options="pathOptions"
            v-model="path"
            v-if="pathOptions.length > 1"
          />
          <p v-else class="text-brown-4">
            {{ pathOptions[0] }}
          </p>
        </div>
      </div>

      <div class="flex row items-center">
        <b class="q-mr-sm">Method: </b>
        <q-select
          dense
          outlined
          :options="methodsOptions"
          :option-label="(item) => item.toUpperCase()"
          :display-value="method.toUpperCase()"
          v-model="method"
          v-if="methodsOptions.length > 1"
        />
        <p v-else>
          {{ methodsOptions[0] ? methodsOptions[0].toUpperCase() : null }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { ref, watch, onMounted } from 'vue';
export default {
  props: {
    doc: { type: Object },
  },
  setup(props) {
    const path = ref('');
    const method = ref('');
    const pathOptions = ref([]);
    const methodsOptions = ref([]);
    const server = ref('');

    /** This doesn't looks right */
    watch(props, () => {
      updatePathsAndMethods();
    });
    onMounted(() => {
      props.doc.paths ? updatePathsAndMethods() : null;
    });

    function updatePathsAndMethods() {
      path.value = Object.keys(props.doc.paths)[0] || '';
      pathOptions.value = Object.keys(props.doc.paths) || '';
      method.value = Object.keys(props.doc.paths[path.value])[0] || '';
      methodsOptions.value = Object.keys(props.doc.paths[path.value]) || '';
      server.value = props.doc.servers[0]['url'] || '';

      /** Update the current server, path and method value to state */
      // props.doc.state.server = server.value;
      // props.doc.state.path = path.value;
      // props.doc.state.method = method.value;
    }

    return { path, method, pathOptions, methodsOptions, server };
  },
};
</script>

<style lang="scss" scoped></style>
