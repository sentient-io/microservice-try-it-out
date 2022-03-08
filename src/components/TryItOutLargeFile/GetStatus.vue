<template>
  <div>
    Get Status
    <q-table v-if="tableRows[0]" :columns="tableColumns" :rows="tableRows" />
    <div v-else>
      no job is processing (if you used different computer, please input jid for
      query)
    </div>
    <!-- <div v-for="jIDItem in jIDList" :key="jIDItem.jid"></div> -->
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import largeFileService from 'src/services/LargeFile/largeFileService';
const { getLocalStorageJID, useFetchLargeFileStatus } = largeFileService();
export default defineComponent({
  setup() {
    const tableColumns = [
      { name: 'jID', field: 'jID', label: 'Job ID' },
      { name: 'timestamp', field: 'timestamp', label: 'Upload Time' },
      { name: 'status', field: 'status', label: 'Status' },
    ];
    const tableRows = ref([]);

    const getLargeFileStatus = async (jID) => {
      const target = tableRows.value.find((elem) => {
        return elem.jID == jID;
      });
      const status = await useFetchLargeFileStatus(jID);
      target.status = String(status);
    };

    const jIDList = getLocalStorageJID();
    if (jIDList[0]) {
      jIDList.forEach((jIDItem) => {
        tableRows.value.push({
          jID: jIDItem.jID,
          timestamp: jIDItem.timestamp,
          status: 'loading...',
        });
        void getLargeFileStatus(jIDItem.jID);
      });
    }

    return {
      tableColumns,
      tableRows,
    };
  },
});
</script>

<style lang="scss" scoped></style>
