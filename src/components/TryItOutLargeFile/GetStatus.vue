<template>
  <div>
    <div class="row justify-between no-wrap items-center full-width">
      <Quote
        content="Please take note, this function is designed for testing and trying out purpose, not for production. All Job IDs are sotred in local storage, you won't be able to access the stored Job ID and status with another browsers, or other devices. Stored Job IDs will also be removed if you testing with private mode or after clened the browser cache."
        class="col-8"
        color="#e1676a"
        icon="warning"
      />
      <q-btn
        label="Clear Table"
        no-caps
        dense
        icon="delete_outline"
        size="sm"
        flat
        color="red"
        @click="useClearJobLocalStorage()"
      />
    </div>
    <q-table
      v-if="tableRows[0]"
      :columns="tableColumns"
      :rows="tableRows"
      virtual-scroll
      :rows-per-page-options="[0]"
      style="height: 400px"
      class="q-mt-md"
    >
      <!-- Customise display for status column with body-cell-[name] slot-->
      <template v-slot:body-cell-status="scope">
        <td
          class="text-center"
          style="max-width: 220px; white-space: normal; text-align: left"
        >
          <span
            class="text-orange-8"
            v-if="scope.row.status['status'] !== 'Success'"
          >
            <!-- Handle all none success case -->
            {{ scope.row.status['message'] || scope.row.status }}
          </span>
          <div v-else class="row no-wrap">
            <!-- Handle success case -->
            <span class="text-green-8">{{ scope.row.status['message'] }}</span>
            <q-btn
              size="sm"
              dense
              class="q-mx-sm"
              color="green-8"
              label="Show Result"
              @click="handleDisplayResult(scope.row)"
            />
          </div>
        </td>
      </template>

      <!-- Customise display for additionalParam column with body-cell-[name] slot-->
      <template v-slot:body-cell-additionalParam="scope">
        <td>
          <pre
            v-if="scope.value"
            style="
              max-width: 300px;
              white-space: normal;
              text-align: left;
              line-break: anywhere;
              max-height: 120px;
              overflow: scroll;
              background: #f8f8f8;
            "
            class="small-scrollbar q-pa-sm"
          >
          <code>
{{ scope.value }}
          </code>
        </pre>
          <span v-else>N.a.</span>
        </td>
      </template>
    </q-table>
    <div v-else>
      No recorded jobs. For trying purpose, your large files jobs will be stored
      in local storage. If you have changed computer or browser, please up load
      files as a new job.
    </div>
    <!-- <div v-for="jIDItem in jIDList" :key="jIDItem.jid"></div> -->
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import largeFileService from 'src/services/LargeFile/largeFileService';
import Quote from 'src/components/Quote.vue';

export default defineComponent({
  components: { Quote },
  setup(_, { emit }) {
    const {
      getJobLocalStorage,
      useFetchLargeFileStatus,
      clearJobLocalStorage,
    } = largeFileService();
    const tableColumns = [
      {
        name: 'fileName',
        field: 'fileName',
        label: 'File Name',
        align: 'center',
        sortable: true,
      },
      {
        name: 'cost',
        field: 'cost',
        label: 'Cost',
        align: 'center',
        sortable: true,
      },
      {
        name: 'jID',
        field: 'jID',
        label: 'Job ID',
        align: 'center',
        sortable: true,
      },
      {
        name: 'additionalParam',
        field: 'additionalParam',
        label: 'Additional Parameters',
        align: 'center',
        sortable: true,
      },
      {
        name: 'timestamp',
        field: 'timestamp',
        label: 'Upload Time',
        align: 'center',
        sortable: true,
      },
      {
        name: 'status',
        field: 'status',
        label: 'Status',
        align: 'center',
        sortable: true,
      },
    ];
    const tableRows = ref([]);

    const getLargeFileStatus = async (jID) => {
      const target = tableRows.value.find((elem) => {
        return elem.jID == jID;
      });
      const status = await useFetchLargeFileStatus(jID);
      target.status = status;

      // Temporarily escape the error 415 case, there will be a few seconds lapse after the file is successfully uploaded.
      console.log(status);
      if (status == 'Request failed with status code 415') {
        target.status =
          'Loading ... please refresh in a few minutes. If you keep seeing this message after 30 minutes, contact sentient.io customer service';
      }
    };

    function updateTable() {
      const jobList = getJobLocalStorage();
      tableRows.value = [];
      if (jobList?.[0]) {
        jobList.forEach((jobItem) => {
          tableRows.value.push({
            fileName: jobItem.fileName,
            cost: jobItem.cost,
            jID: jobItem.jID,
            timestamp: jobItem.timestamp,
            additionalParam: jobItem.additionalParam,
            status: 'loading...',
          });
          void getLargeFileStatus(jobItem.jID);
        });
      }
    }
    updateTable();

    const handleDisplayResult = (statusObj) => {
      emit('handleDisplayResult', statusObj);
    };

    function useClearJobLocalStorage() {
      clearJobLocalStorage();
      updateTable();
    }

    return {
      tableColumns,
      tableRows,
      handleDisplayResult,
      useClearJobLocalStorage,
    };
  },
});
</script>

<style lang="scss" scoped></style>
