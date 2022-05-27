<template>
  <div>
    <div class="row no-wrap items-stretch">
      <div class="base64_preview_area">
        <p @click="showEditPopupAlert = true" class="q-ma-none">
          {{ clippedStr }}
        </p>
      </div>
      <div class="q-px-xs column justify-center q-gutter-md">
        <q-btn
          icon="upload"
          flat
          dense
          color="primary"
          @click="showUploader = true"
        >
          <q-tooltip> Upload Binary File </q-tooltip>
        </q-btn>
        <q-btn icon="link" flat dense color="primary">
          <q-tooltip> Upload File Via Link</q-tooltip>
        </q-btn>
        <q-btn icon="preview" flat dense color="primary">
          <q-tooltip> Preview base64 media </q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Edit base64 alert -->
    <q-dialog v-model="showEditPopupAlert">
      <q-card class="q-pa-md">
        <p>
          You are trying to edit a long base64 string.
          <b
            >Doing this may slow down your computer or completely freeze your
            browser.</b
          >
        </p>
        <p>
          If you are trying to change the file content, please consider use the
          file uploading function instead of direct modify the base64 string.
        </p>
        <div class="row justify-center q-gutter-md">
          <q-btn
            no-caps
            label="Cancel"
            flat
            @click="showEditPopupAlert = false"
          />
          <q-btn
            flat
            no-caps
            color="white"
            class="bg-primary"
            label="Edit Base64 String"
            @click="
              {
                showEditPopupAlert = false;
                showEditWindow = true;
              }
            "
          />
        </div>
      </q-card>
    </q-dialog>

    <!-- Base64 Editor -->
    <q-dialog v-model="showEditWindow" persistent>
      <q-card class="q-pa-md">
        <ByteEditor
          :base64str="base64str"
          @cancel="showEditWindow = false"
          @update="
            (newBase64Str) => {
              showEditWindow.value = false;
              emitUpdate(newBase64Str);
            }
          "
        />
      </q-card>
    </q-dialog>

    <!-- Binary Uploader -->
    <q-dialog v-model="showUploader" persistent>
      <q-card class="q-pa-md full-width">
        <BinaryUploader
          @cancel="showUploader = false"
          @update="
            (newBase64Str) => {
              showUploader = false;
              emitUpdate(newBase64Str);
            }
          "
        />
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

import ByteEditor from "./ByteEditor.vue";
import BinaryUploader from "./BinaryUploader.vue";

const props = defineProps({
  base64str: {},
  trim: { default: 200 },
});

const emit = defineEmits(["update"]);

const showEditPopupAlert = ref();
const showEditWindow = ref();
const showUploader = ref();

const clippedStr = ref();

const init = () => {
  if (props.base64str) {
    clippedStr.value = clipStr(props.base64str, props.trim);
  }
};

const emitUpdate = (newBase64Str) => {
  // console.log("saveBase64Edit\n", base64EditArea.value.innerText);
  emit("update", newBase64Str);
};

const clipStr = (rawStr, trim) => {
  if (rawStr.length > trim) {
    return `${rawStr.slice(0, trim)}...(${
      rawStr.length - trim
    } characters been clipped)`;
  } else {
    return `${rawStr}`;
  }
};

watch(
  () => props.base64str,
  () => init()
);

onMounted(() => init());
</script>

<style lang="scss" scoped>
.base64_preview_area {
  white-space: pre-wrap;
  line-break: anywhere;
  border: 1px solid rgba(128, 128, 128, 0.3);
  padding: 0.7rem;
  border-radius: 4px;

  cursor: pointer;
}
.base64_preview_area:hover {
  border-color: $primary;
  border-width: 2px;
  box-shadow: 0px;
}
.base64_preview_area p {
  font-size: 0.8rem;
  border: 1px solid rgba(0, 0, 0, 0);
}
.base64_preview_area:hover p {
  border-width: 0px;
}
</style>
