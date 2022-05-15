<template>
  <div>
    <!-- <pre>{{ editedProperty }}</pre> -->
    <div class="row items-start">
      <!-- <div v-if="property.type == 'object'">
        <q-expansion-item>
          <template #header>
            <q-input v-model="editedField" dense outlined />
            <span class="q-mx-sm"> : </span>
            <span class="text-grey-5">(Expand to edit child elements)</span>
          </template>
          <div
            v-for="(childProperty, childField) in property['properties']"
            :key="childField"
          >
            <JsonFieldsInput :property="childProperty" :field="childField" />
          </div>
        </q-expansion-item>
      </div> -->

      <!-- <div v-else class="row">
        <q-input v-model="editedField" dense outlined />
        <span class="q-mx-sm"> : </span>
        <q-input v-model="editedExample" dense outlined />
        <q-btn flat icon="mdi-format-indent-increase" />
        <q-btn flat icon="mdi-format-indent-decrease" />
        <q-btn flat icon="mdi-playlist-plus" />
        <q-btn
          flat
          icon="mdi-trash-can-outline"
          @click="deleteField(editedField)"
        />
      </div> -->
    </div>
    <q-btn label="Test update example" @click="update()" />
  </div>
</template>

<script>
/**
 * Takes json request body schema propertie in open API style
 * allow user to modify the example value,  and emit out the
 * updated request body schema propertie.
 */

import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'JsonFieldsInput',
  components: {},
  props: {
    property: { required: true },
    field: { required: true },
  },
  setup(props, { emit }) {
    const editedProperty = ref();
    const editedField = ref();
    const editedExample = ref();

    const init = () => {
      editedProperty.value = props.property;
      editedField.value = props.field;
      if (props.property.example) {
        editedExample.value = props.property.example;
      } else {
        initExample();
      }
    };

    const initExample = () => {
      /**
       * This component relay on the example field of the input
       * property, if there is no example, this function  helps
       * to extract an example object from the given properties
       */
      const example = {};
      Object.keys(props.property.properties).forEach((key) => {
        example[key] = props.property.properties[key].example || '';
      });
      editedExample.value = example;
      update();
    };

    const deleteField = (fieldToDelete) => {
      console.log('Delete field:');
      console.log(fieldToDelete);
      console.log(editedField.value);
      // emit('test', fieldToDelete);
    };

    const update = () => {
      emit('update', editedExample.value);
    };

    onMounted(() => {
      init();
    });

    return { editedProperty, editedField, editedExample, deleteField, update };
  },
});
</script>

<style lang="scss" scoped></style>
