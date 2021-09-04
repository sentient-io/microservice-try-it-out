<template>
  <div>
    <q-file
      outlined
      :label="label + ' (Please upload file)'"
      :model-value="file"
      @update:model-value="(val) => uploadFile(val)"
      :error="!file || !file.lastModified"
      hide-bottom-space
      clearable
      error-message="Field required, please upload a file."
    >
      <template v-slot:after>
        <!-- This will mos likely be empty. Just to align the input box with Input Fields -->
        <div></div>
      </template>

      <template v-slot:prepend>
        <q-icon name="cloud_upload" />
      </template>
    </q-file>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ref, defineComponent, onMounted, watch } from 'vue';
export default defineComponent({
  props: { label: {}, hint: {}, example: {} },
  setup(props, { emit }) {
    onMounted(() => {
      /** Assign user uploaded file to file variable */
      typeof props.example !== 'string' ? (file.value = props.example) : null;
    });
    const file = ref(props.example);
    function uploadFile(ufile: File) {
      /**
       * Emit "uploadFile" event together with the user uploaded file
       * At this moment, the file variable haven't updated  yet . The
       * event listener will then update the  "example"  value. Below
       * watcher function will then update the file variable.
       *
       * When user click "reset input" button, the watcher  will also
       * list to props update, and re-assign file to empty value from
       * the reseted example.
       */
      emit('uploadFile', ufile);
    }

    watch(props, () => {
      file.value = props.example;
    });

    return {
      file,
      uploadFile,
    };
  },
});
</script>

<style lang="scss" scoped></style>
