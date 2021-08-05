<template>
  <div>
    <q-list separator bordered class="q-mb-md q-mt-sm">
      <q-item v-for="(item, idx) in Object.keys(data)" :key="idx">
        <q-item-section>
          <q-item-label>{{ item }}</q-item-label>
          <q-item-label v-if="data[item] && typeof data[item][0] === 'object'">
            <FlatObjectList
              v-for="(subItem, subidx) in data[item]"
              :key="'sub' + subidx"
              :data="subItem"
            />
          </q-item-label>
          <q-item-label v-else-if="checkAudioBase64String(data[item])">
            <audio controls>
              <source :src="`data:audio/wav;base64,${data[item]}`" type="" />
            </audio>
          </q-item-label>
          <q-item-label v-else caption style="word-break: break-all">{{
            data[item]
          }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { tryItOutService } from '../../../services/TryItOut/TryItOut_service';

export default {
  name: 'FlatObjectList',
  props: { data: {} },
  setup() {
    const { checkAudioBase64String } = tryItOutService();
    return { checkAudioBase64String };
  },
};
</script>

<style lang="scss" scoped></style>
