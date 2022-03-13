<template>
  <div>
    <q-table v-if="tableRows[0]" :columns="tableColumns" :rows="tableRows">
      <template v-slot:body-cell-status="scope">
        <td class="text-center">
          <span
            class="text-orange-8"
            v-if="scope.row.status['status'] !== 'Success'"
          >
            <!-- Handle all none success case -->
            {{ scope.row.status['message'] || scope.row.status }}
          </span>
          <div v-else>
            <!-- Handle success case -->
            <span class="text-green-8">{{ scope.row.status['message'] }}</span>
            <q-btn
              size="sm"
              dense
              class="q-mx-sm"
              color="green-8"
              label="Show Result"
              @click="handleDisplayResult(scope.row.status['output_url'])"
            />
          </div>
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

const { getJobLocalStorage, useFetchLargeFileStatus } = largeFileService();
export default defineComponent({
  setup(_, { emit }) {
    const tableColumns = [
      {
        name: 'fileName',
        field: 'fileName',
        label: 'File Name',
        align: 'center',
      },
      { name: 'cost', field: 'cost', label: 'Cost', align: 'center' },
      { name: 'jID', field: 'jID', label: 'Job ID', align: 'center' },
      {
        name: 'timestamp',
        field: 'timestamp',
        label: 'Upload Time',
        align: 'center',
      },
      { name: 'status', field: 'status', label: 'Status', align: 'center' },
    ];
    const tableRows = ref([]);

    const getLargeFileStatus = async (jID) => {
      const target = tableRows.value.find((elem) => {
        return elem.jID == jID;
      });
      const status = await useFetchLargeFileStatus(jID);
      target.status = status;
    };

    const jobList = getJobLocalStorage();

    if (jobList?.[0]) {
      jobList.forEach((jobItem) => {
        tableRows.value.push({
          fileName: jobItem.fileName,
          cost: jobItem.cost,
          jID: jobItem.jID,
          timestamp: jobItem.timestamp,
          status: 'loading...',
        });
        void getLargeFileStatus(jobItem.jID);
      });
    }

    const handleDisplayResult = (url) => {
      emit('handleDisplayResult', url);
    };

    return {
      tableColumns,
      tableRows,
      handleDisplayResult,
    };
  },
});
</script>

<style lang="scss" scoped></style>
