<template>
  <div v-if="currLgFileJobHist">
    <h5 class="q-my-md">Status Recording</h5>
    <p style="font-size: 14px">
      Try It Out will store all the recorded statuses in the browser's local
      storage. You will remove these recordings by changing to another browser
      or clearing the browsing history.
    </p>
    <!-- {{ largeFileJobHistory }} -->
    <q-table :columns="table_cols" :rows="table_rows" v-if="table_rows">
      <!-- jId cell slot -->
      <template #body-cell-jId="props">
        <q-td :props="props">
          <div class="row items-center q-gutter-sm justify-center no-wrap">
            <span
              >{{ props.value.slice(0, 3) }}...{{
                props.value.substr(props.value.length - 3)
              }}
              <q-tooltip> {{ props.value }} </q-tooltip>
            </span>
            <q-btn
              round
              flat
              icon="content_copy"
              size="0.6rem"
              @click="copy(props.value)"
            />
          </div>
        </q-td>
      </template>

      <!-- File Details -->
      <template #body-cell-file="props">
        <q-td :props="props">
          <div class="column items-center">
            <p
              class="q-my-none"
              style="white-space: pre-wrap; line-break: anywhere"
            >
              <b>{{ props.value["name"] }}</b>
            </p>
            <small class="text-grey-7"
              >(size:
              {{ (props.value["size"] / 1024 / 1024).toFixed(2) }} MB)</small
            >
          </div>
        </q-td>
      </template>

      <!-- Uploaded On -->
      <template #body-cell-uploadOn="props">
        <q-td :props="props">
          <div class="column items-start" v-if="props.value">
            <span v-for="(v, k) in props.value.split(' ')" :key="k">
              {{ v }}
            </span>
          </div>
          <div v-else>
            {{ props.value }}
          </div>
        </q-td>
      </template>

      <!-- Last Updated -->
      <template #body-cell-lastUpdated="props">
        <q-td :props="props">
          <div class="column items-start" v-if="props.value">
            <span v-for="(v, k) in props.value.split(' ')" :key="k">
              {{ v }}
            </span>
            <small class="text-amber-9"
              >Expire in
              {{ calcLargeFileExpireDays(props.value) }} day(s)</small
            >
          </div>
          <div v-else>
            {{ props.value }}
          </div>
        </q-td>
      </template>

      <!-- Output URL -->
      <template #body-cell-outputUrl="props">
        <q-td :props="props">
          <div class="row items-center no-wrap" v-if="props.value">
            <span
              >{{ props.value.slice(0, 10) }}...{{
                props.value.substr(props.value.length - 4)
              }}
              <q-tooltip> {{ props.value }} </q-tooltip>
            </span>
            <a
              :href="props.value"
              style="text-decoration: none"
              class="text-primary"
              target="_blank"
            >
              <q-btn round flat icon="open_in_new" size="0.6rem" />
            </a>
            <q-btn
              round
              flat
              icon="preview"
              color="green-6"
              size="0.6rem"
              @click="openLargeFileResPreview(props.value)"
            />
          </div>
          <div v-else>No url available.</div>
        </q-td>
      </template>

      <!-- Configurations -->
      <!-- File Details -->
      <template #body-cell-configs="props">
        <q-td :props="props">
          <div>
            <pre
              class="text-left"
              v-if="typeof props.value == 'object'"
              style="max-height: 200px; overflow-y: auto"
              >{{ props.value }}</pre
            >
            <span v-else>{{ props.value }}</span>
          </div>
        </q-td>
      </template>

      <!-- Actions -->
      <!-- Since all action are based on job id, this is essentially another cell for job id, but display something else -->
      <template #body-cell-actions="props">
        <q-td :props="props">
          <div class="row no-wrap">
            <q-btn
              round
              flat
              icon="refresh"
              size="0.6rem"
              color="green"
              @click="getLargeFileStatusByJid(props.value)"
              ><q-tooltip>
                <template #default>
                  <p
                    style="max-width: 300px; font-size: 14px"
                    class="q-my-none"
                  >
                    Fetch the latest job state.
                  </p>
                </template>
              </q-tooltip></q-btn
            >
            <q-btn
              round
              flat
              icon="delete_forever"
              size="0.6rem"
              color="red"
              @click="deleteLargeFileHistByJid(props.value)"
              ><q-tooltip>
                <template #default>
                  <p
                    style="max-width: 300px; font-size: 14px"
                    class="q-my-none"
                  >
                    Delete reocrd from local storage. This is just an UI action,
                    will not do anything to the large fie requests you have
                    made.
                  </p>
                </template>
              </q-tooltip></q-btn
            >
          </div>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="showLargeFileResPreview" persistent full-width>
      <q-card style="max-width: 1000px !important" class="q-pa-md">
        <div class="row justify-between items-center">
          <h5 class="q-my-none">Preview Large File Response</h5>
          <q-btn
            flat
            round
            size="md"
            icon="close"
            @click="closeLargeFileResPreview()"
          />
        </div>
        <div
          class="q-pa-md"
          style="
            max-height: 500px;
            overflow-y: scroll;
            border: 1px solid rgba(100, 100, 100, 0.25);
          "
        >
          <JsonUrlViewer :url="largeFileResUrl" />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { copyToClipboard, useQuasar } from "quasar";

import JsonUrlViewer from "src/components/Viewers/JsonUrlViewer.vue";

import {
  largeFileJobHistory,
  calcLargeFileExpireDays,
  getLargeFileStatusByJid,
  deleteLargeFileHistByJid,
} from "src/services/largeFileService";

const $q = useQuasar();

const props = defineProps({
  docTitle: {},
});

const table_cols = [
  { name: "jId", label: "Job ID", field: "jId", align: "center" },
  { name: "file", label: "File Details", field: "file", align: "center" },
  {
    name: "cost",
    label: "Cost",
    field: "cost",
    align: "center",
    sortable: true,
  },
  {
    name: "configs",
    label: "Configurations",
    field: "configs",
    align: "center",
  },
  {
    name: "uploadOn",
    label: "Uploaded On",
    sortable: true,
    sortOrder: "da",
    field: "uploadOn",
    align: "center",
  },
  {
    name: "lastUpdated",
    label: "Last Updated",
    sortable: true,
    field: "lastUpdated",
    align: "center",
  },
  {
    name: "state",
    label: "State",
    field: "state",
    align: "center",
    sortable: true,
  },
  {
    name: "outputUrl",
    label: "Output URL",
    field: "outputUrl",
    align: "center",
  },
  { name: "actions", label: "Actions", field: "jId", align: "center" },
];

const currLgFileJobHist = computed(() => {
  if (!props.docTitle) return null;

  const _hist = largeFileJobHistory.value?.[props.docTitle];
  if (!_hist) return null;

  return _hist;
});

const table_rows = computed(() => {
  const rows = [];

  if (!currLgFileJobHist.value) return [];

  for (const [jId, jItem] of Object.entries(currLgFileJobHist.value)) {
    let configs;

    try {
      configs = JSON.parse(jItem["Configurations"]);
    } catch (err) {
      configs = jItem?.["Configurations"] || "No Configurations";
    }

    const rowElem = {
      jId: jId,
      file: { name: jItem["File Name"], size: jItem["File Size"] },
      configs: configs,
      uploadOn: jItem["Upload On"],
      lastUpdated: jItem["Last Updated"] || null,
      state: jItem["State"] || "No state yet",
      outputUrl: jItem["Output URL"] || null,
      cost: jItem?.["Cost"] || "null",
    };
    // console.log(rowElem);
    rows.push(rowElem);
  }

  return rows;
});

const showLargeFileResPreview = ref(false);
const largeFileResUrl = ref("");

const openLargeFileResPreview = (url) => {
  console.log("usePreviewResUrl", url);
  largeFileResUrl.value = url;
  showLargeFileResPreview.value = true;
};

const closeLargeFileResPreview = () => {
  largeFileResUrl.value = "";
  showLargeFileResPreview.value = false;
};

const copy = (text) => {
  copyToClipboard(text)
    .then(() => {
      $q.notify(`${text} copied to clipboard.`);
    })
    .catch(() => {
      $q.notify({
        message: "For some reason, text is not copied.",
        color: "orange-7",
      });
    });
};

onMounted(() => {
  if (currLgFileJobHist.value) {
    Object.keys(currLgFileJobHist.value).forEach((jId) => {
      if (currLgFileJobHist.value[jId]["State"] !== "Successfully Processed") {
        getLargeFileStatusByJid(jId);
      }
    });
  }
});
</script>

<style lang="scss" scoped></style>
