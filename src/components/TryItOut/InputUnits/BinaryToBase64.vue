<template>
  <div>
    <p class="q-mb-sm">Upload binary file as base64 string.</p>

    <div v-if="!base64" class="flex column items-center">
      <q-file
        filled
        bottom-slots
        label="Select file to upload"
        v-model="binaryFile"
      >
        <template v-slot:prepend>
          <q-icon name="cloud_upload" @click.stop />
        </template>
      </q-file>

      <q-btn
        no-caps
        :label="
          binaryFile ? 'Upload as base64 string' : 'Please select a file first'
        "
        color="green-8"
        @click="convertToBase64"
        :disable="!binaryFile"
      />
    </div>

    <div class="flex row justify-between no-wrap items-center" v-else>
      <q-icon name="check_circle" size="md" color="green" />
      <p class="text-green-8 q-ml-sm">
        Your file been converted to base64 string and applied to the input
        field.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';

export default defineComponent({
  setup(_, { emit }) {
    const binaryFile = ref();
    const base64 = ref('');

    function convertToBase64() {
      const reader = new FileReader();
      reader.readAsDataURL(binaryFile.value);
      reader.onload = () => {
        console.log(reader.result);
        base64.value = op.trimBase64(reader.result?.toString() || '');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        emit('convertToBase64', base64.value);
      };
    }
    return { binaryFile, convertToBase64, base64 };
  },
});
const op = {
  trimBase64(str: string): string {
    if (!str.includes(';base64,')) {
      /**
       * All converted base64 string usually start with something + ;base64,
       * Return original string if it's not full base64 string.
       */
      return str;
    }
    /** Trim the base64 string to only left the actual part */
    const trimmedStr = str.split(';base64,')[1];
    return trimmedStr;
  },
};
</script>

<style lang="scss" scoped></style>
