<template>
  <q-btn
    flat
    round
    dense
    color="grey"
    icon="help_outline"
    @click="dialogShow = true"
  />
  <q-dialog v-model="dialogShow">
    <q-card class="row no-wrap">
      <q-card-section class="q-pr-none">
        <p>
          To find your API key, log in to
          <a
            href="https://platform.sentient.io/"
            target="_blank"
            class="text-green-8"
            >Sentient.io</a
          >
          Platform, search for the microservice that you want to try out. If you
          already subscribed the microservice, your api key will be at the top
          section of the miroservice page.
        </p>
        <p>
          To Subscribe the microservice, please serach for the microservice name
          in Sentient.io platform, click in to the microservice detail page and
          click "Subscribe Microservice Now".
        </p>
      </q-card-section>
      <div class="q-pt-sm q-pr-sm column full-height justify-start">
        <q-btn
          flat
          round
          dense
          color="grey"
          icon="close"
          @click="dialogShow = false"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";
const dialogShow = ref(false);
</script>

<style lang="scss" scoped></style>
