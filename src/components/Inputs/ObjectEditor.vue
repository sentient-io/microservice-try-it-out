<template>
  <div>
    <div class="q-my-md">
      <div class="row q-mb-sm q-gutter-sm">
        <q-btn
          :disable="warningMsg !== ''"
          outline
          dense
          no-caps
          size="sm"
          label="Format JSON"
          class="q-px-xs"
          color="grey-7"
          icon="format_align_left"
          @click="formatJson"
        />
        <q-btn
          outline
          dense
          no-caps
          size="sm"
          label="Reset JSON"
          class="q-px-xs"
          color="grey-7"
          icon="restart_alt"
          @click="resetJson"
        />
      </div>
      <pre
        class="object_edit_area q-ma-none"
        contenteditable="true"
        ref="ObjEditArea"
        @input="checkJsonErr"
        :key="ObjEditAreaKey"
        >{{ jsonObj }}</pre
      >
      <div>
        <small class="text-red">{{ warningMsg }}</small>
      </div>
    </div>

    <div class="row justify-around">
      <q-btn label="Cancel" flat no-caps @click="emitCancel" />
      <q-btn
        flat
        no-caps
        label="Save"
        color="white"
        class="bg-primary"
        :disable="warningMsg !== ''"
        @click="emitUpdate"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  object: {},
});

const emit = defineEmits(["cancel", "update"]);

const jsonObj = ref();

// HTML element use as ID
const ObjEditArea = ref();
/**
 * This number change will trigger the HTML element redraw from the
 * formatted jsonObj. Without this,assign value to pre element will
 * cause additional <br> been inserted
 * */
const ObjEditAreaKey = ref(0);

const warningMsg = ref("");

const emitCancel = () => {
  emit("cancel");
};

const checkJsonErr = () => {
  const userInput = ObjEditArea.value.innerText;
  warningMsg.value = "";
  try {
    JSON.parse(userInput);
  } catch (err) {
    warningMsg.value = err;
  }
};

const formatJson = () => {
  const userInput = ObjEditArea.value.innerText;
  jsonObj.value = JSON.parse(userInput);
  ObjEditAreaKey.value++;
};

const resetJson = () => {
  ObjEditAreaKey.value++;
};

const emitUpdate = () => {
  const userInput = ObjEditArea.value.innerText;
  emit("update", JSON.parse(userInput));
};

const init = () => {
  warningMsg.value = "";
  jsonObj.value = props.object;
};

onMounted(() => init());

watch(
  () => ObjEditArea.value,
  () => {
    if (ObjEditArea.value.innerText) {
      checkJsonErr();
    }
  }
);
</script>

<style lang="scss" scoped>
.object_edit_area {
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
