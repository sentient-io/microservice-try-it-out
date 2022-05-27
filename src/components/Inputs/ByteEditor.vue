<template>
  <div>
    <p>
      You are editing a very long base64 string. It may slow down or completely
      freeze your browser.
    </p>

    <a
      href="https://developer.mozilla.org/en-US/docs/Glossary/Base64"
      target="_blank"
      >What is Base64?</a
    >
    <div>
      <pre class="base64_edit_area" contenteditable="true" ref="base64EditArea"
        >{{ base64str }}
        </pre
      >
    </div>
    <div class="row justify-center q-gutter-md">
      <q-btn label="Cancel" flat @click="emitCancel" />
      <q-btn
        label="Save Edit"
        flat
        color="white"
        class="bg-primary"
        @click="emitUpdate()"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  base64str: { default: "" },
});
const emit = defineEmits(["cancel", "update"]);
const base64EditArea = ref();

const emitCancel = () => {
  emit("cancel");
};

const emitUpdate = () => {
  const newBase64Str = base64EditArea.value.innerHTML;
  emit("update", newBase64Str);
};
</script>

<style lang="scss" scoped>
.base64_edit_area {
  white-space: pre-wrap;
  line-break: anywhere;
  border: 1px solid rgba(128, 128, 128, 0.3);
  padding: 0.7rem;
  border-radius: 4px;
  font-size: 0.8rem;
  width: clac(300px, 100%, 600px);
  height: 50vh;
  overflow: scroll;
  cursor: pointer;
}
</style>
