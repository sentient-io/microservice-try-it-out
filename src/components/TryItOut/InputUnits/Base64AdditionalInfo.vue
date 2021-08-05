<template>
  <div class="flex row items-center text-indigo">
    <q-icon name="help" color="indigo" />
    <span @mouseenter="show = true" @mouseout="show = false">
      Why the base64 string is clipped?
      <q-menu v-model="show">
        <div class="q-pa-sm" style="max-width: 600px">
          <p>
            Base64 is a format to send binary files to server in a machine
            readable way. Since it is not designed for human reading way,
            displaying the full base64 string may slow down your browser and
            affect your user experience.
          </p>
          <br />
          <p>
            However, when you click the "Make API Call" button, we will still
            send the original base64 string from your uploaded file to the
            server and return the actual result.
          </p>
        </div>
      </q-menu>
    </span>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const show = ref(false);
    return {
      show,
    };
  },
};
</script>

<style lang="scss" scoped></style>
