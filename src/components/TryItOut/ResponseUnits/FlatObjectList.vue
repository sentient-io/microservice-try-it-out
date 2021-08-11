<template>
  <div>
    <q-list separator bordered class="q-mb-md q-mt-sm">
      <q-item v-for="(item, idx) in Object.keys(data)" :key="idx">
        <q-item-section>
          <q-expansion-item
            dense
            :default-opened="idx === 0"
            :label="`${item} (${
              data[item].length
                ? data[item].length
                : Object.keys(data[item]).length
            })`"
            v-if="data[item] && typeof data[item] === 'object'"
          >
            <q-item-label>
              <div
                v-for="(subItem, subidx) in data[item]"
                :key="'sub' + subidx"
              >
                <FlatObjectList
                  :data="subItem"
                  v-if="typeof subItem === 'object'"
                />

                <!-- 
                For the last layer of result, with out belo list, 
                string will be recognise as object by v-for  
                -->
                <q-list v-else eparator bordered class="q-mb-md q-mt-sm">
                  <!-- <q-item-label caption>{{ item }}</q-item-label> -->
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>
                        {{ subidx }}
                      </q-item-label>
                      <q-item-label style="word-break: break-all">
                        {{ subItem }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </q-item-label>
          </q-expansion-item>

          <!-- <q-item-label caption>{{ item }}</q-item-label> -->

          <q-item-label v-else-if="checkAudioBase64String(data[item])">
            <q-item-label caption>{{ item }}</q-item-label>
            <audio controls>
              <source :src="`data:audio/wav;base64,${data[item]}`" type="" />
            </audio>
          </q-item-label>

          <q-item-label v-else style="word-break: break-all">
            <q-item-label caption>{{ item }}</q-item-label>
            {{ data[item] }}</q-item-label
          >
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { tryItOutService } from '../../../services/TryItOut/TryItOut_service';

export default {
  name: 'FlatObjectList',
  props: { data: { type: Object as unknown } },
  setup() {
    const { checkAudioBase64String } = tryItOutService();
    return { checkAudioBase64String };
  },
};
</script>

<style lang="scss" scoped></style>
