<template>
  <div>
    <pre>{{ schema }}</pre>
    <div v-for="(property, field) in properties" :key="field">
      <JsonFieldsInput
        :property="property"
        :field="field"
        v-if="property.type == 'object'"
        @update="(example) => updateFieldExample(field, example)"
      />
      <PrimitiveFieldsInput :property="property" :field="field" v-else />
    </div>
  </div>
</template>

<script>
/**
 * @author zq
 * @lastUpdate 2022-Apr-26
 *
 * A vue.js component that takes request body schema in open API
 * style, allow user to modify the schema detail with various of
 * input format.
 *
 * Request body schema refer to this:
 * https://swagger.io/specification/#request-body-object
 *
 * @depencencies []
 *
 * @props property: description
 *
 * @emits events: description
 */

import { defineComponent, ref, watch, onMounted } from 'vue';

import PrimitiveFieldsInput from './PrimitiveFieldsInput.vue';
import JsonFieldsInput from './JsonFieldsInput.vue';

export default defineComponent({
  components: {
    PrimitiveFieldsInput,
    JsonFieldsInput,
  },
  props: {
    schema: { required: true },
  },
  setup(props, ) {
    const PRIMITIVE_TYPE = ['string', 'boolean', 'number', 'float'];
    const properties = ref();
    const editedSchema = ref();

    const init = () => {
      if (props.schema) {
        editedSchema.value = props.schema;
        properties.value = props.schema.properties;
      }
    };

    watch(props, () => {
      init();
    });

    onMounted(() => {
      init();
    });

    const updateFieldExample = () => {
      // properties.value[field].example = example;
      // emit('update', editedSchema.value);
    };

    const update = () => {
      editedSchema.value.properties = properties.value;
    };

    return {
      properties,
      PRIMITIVE_TYPE,
      updateFieldExample,
      update,
    };
  },
});
</script>

<style lang="scss" scoped></style>
