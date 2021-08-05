
<template>
  <div>
    <q-file
      outlined
      :label="label + ' (Please upload file)'"
      v-model="file"
      @input="uploadFile()"
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

<script>
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ref, onMounted } from 'vue';
export default {
  props: { label: {}, hint: {}, example: { type: String } },
  setup(props, { emit }) {
    onMounted(() => {
      /** Assign user uploaded file to file variable */
      typeof props.example !== 'string' ? (file.value = props.example) : null;
    });
    const file = ref();
    function uploadFile() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      emit('uploadFile', file.value);
    }

    return {
      file,
      uploadFile,
    };
  },
};
</script>

<style lang="scss" scoped></style>
