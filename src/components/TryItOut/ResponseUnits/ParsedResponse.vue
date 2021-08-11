<template>
  <div>
    <p class="q-mb-md">
      {{ $t('tryItOut.response.parsedResponse.description') }}
    </p>

    <q-expansion-item header-class="bg-grey-2" label="Input Data Reference:">
      <JsonDataInput disable />
    </q-expansion-item>

    <div class="q-mt-md">
      <b :class="apiResponse.status[0] === '2' ? 'text-green-8' : 'text-red'"
        >{{ $t('terms.response_code') }} : {{ apiResponse.status }} -
        {{ apiResponse.statusText }}
      </b>
    </div>

    <!-- 
      Below for all parsed response components, 
      rendered based on response content type 
    -->
    <div class="q-mt-sm">
      <FlatObjectList :data="processResponse(apiResponse)" />
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */

import FlatObjectList from './FlatObjectList.vue';

import { tryItOutResService } from '../../../services/TryItOut/TryItOutResponse_service';
import { apiResponseInterface } from '../../../services/TryItOut/TryItOut_types';
import JsonDataInput from '../InputUnits/JsonDataInput.vue';

export default {
  components: {
    FlatObjectList,
    JsonDataInput,
  },
  props: {
    apiResponse: { type: Object as () => apiResponseInterface, required: true },
  },
  setup() {
    const { processResponse } = tryItOutResService();

    return { processResponse };
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars

// const op = {
//   processResponse(_response: _responseInterface) {
//     let resType, response;

//     /** Always assign input to response as an object */
//     typeof _response.response == 'object'
//       ? (response = _response.response)
//       : (response = JSON.parse(_response.response));

//     const nestedResults = response.results;
//     nestedResults ? (response = nestedResults) : null;

//     /** Loop through the results and identify value type */
//     const typeIsString = Object.values(response).every((val) => {
//       console.log(typeof val);
//       typeof val === 'string';
//     });

//     typeIsString ? (resType = 'string') : (resType = 'not detected');

//     return { resType, response };
//   },
// };
</script>

<style lang="scss" scoped></style>
