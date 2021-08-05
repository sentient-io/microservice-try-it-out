<template>
  <div>
    <div class="flex row justify-center">
      <q-btn
        label="Make API Call"
        color="green-6"
        no-caps
        class="q-my-md"
        :disable="disable"
        @click="makeApiCall"
      />
    </div>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { tryItOutService } from '../../services/TryItOut/TryItOut_service';
import { useQuasar } from 'quasar';

import { defineComponent } from 'vue';

export default defineComponent({
  props: { disable: {} },
  setup() {
    const { userDocRef, getApiCallMethod, makePostApiCall, makeGetApiCall } =
      tryItOutService();

    const $q = useQuasar();

    function makeApiCall() {
      getApiCallMethod(userDocRef);
      $q.loading.show();

      switch (getApiCallMethod(userDocRef)) {
        case 'get':
          makeGetApiCall().finally(() => {
            $q.loading.hide();
          });
          break;
        case 'post':
          makePostApiCall().finally(() => {
            $q.loading.hide();
          });
        default:
          break;
      }
      // this.$q.loading.show();
      // switch (props.method) {
      //   case "get":
      //     getApiCall(op.getEndpoint(doc), op.renderQueryStr(props.schema))
      //       .then(res => {
      //         console.log(res);
      //       })
      //       .catch(err => {})
      //       .finally(() => {
      //         this.$q.loading.hide();
      //       });
      //     break;

      //   case "post":
      //     postApiCall(
      //       op.getEndpoint(doc),
      //       op.renderJsonBody(props.schema),
      //       op.getContenType(doc)
      //     )
      //       .then(res => {
      //         console.log(res);
      //       })
      //       .catch(err => {})
      //       .finally(() => {
      //         this.$q.loading.hide();
      //       });
      //   default:
      //     break;
      // }
    }

    return {
      makeApiCall,
    };
  },
});

/** All operational functions will be nested inside below object */
// const op = {
//   renderQueryStr(params) {
//     let queryStr = '';
//     if (!params) {
//       /** For api that requred no query string, return as empty  */
//       return queryStr;
//     }
//     params.forEach((param, idx) => {
//       /** Don't add empty value to the query string */
//       if (param.example) {
//         /**
//          * Always end the quert string piece with "&"
//          * later just remove the extra "&" at the end
//          */
//         queryStr += `${param.name}=${param.example}&`;
//       }
//     });
//     /** Add "?" in front and remove the extra "&"  */
//     queryStr = `?${queryStr.replace(/&$/, '')}`;
//     /** Encode the queryStr as URL friendly format */
//     queryStr = encodeURI(queryStr);
//     return queryStr;
//   }
// };
</script>

<style lang="scss" scoped></style>
