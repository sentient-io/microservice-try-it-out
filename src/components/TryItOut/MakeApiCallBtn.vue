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

    const loading = {
      message: [
        'We are processing your data ...',
        'Use utility microservices to save time during your app development',
        "Have a microservice you're looking for but can't find? Write in to us enquiry@sentient.io",
        "Need help with implementing the APIs? Click the 'Help' button at the bottom of the screen to reach out to our support team.",
        'The APIs on our platform are curated carefully to ensure reliability for deploymen',
        'Usage discounts are automatically applied as the number of API calls made reaches the next tier',
      ],
      msgCount: 0,
      interval: null,
      show: function () {
        $q.loading.setDefaults({
          spinnerColor: 'green-6',
          messageColor: 'grey-8',
          backgroundColor: 'white',
          customClass: 'n-spinner',
        });
        $q.loading.show({ message: this.message[this.msgCount] });
        this.interval = setInterval(() => {
          $q.loading.hide();
          this.msgCount = Math.floor(Math.random() * this.message.length);
          $q.loading.show({ message: this.message[this.msgCount] });
        }, 4000);
      },
      hide: function () {
        $q.loading.hide();
        clearInterval(this.interval);
      },
    };

    function makeApiCall() {
      getApiCallMethod(userDocRef);

      loading.show();

      switch (getApiCallMethod(userDocRef)) {
        case 'get':
          makeGetApiCall().finally(() => {
            loading.hide();
          });
          break;
        case 'post':
          makePostApiCall().finally(() => {
            loading.hide();
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

<style lang="scss">
.n-spinner {
  background-color: hsla(0, 100%, 100%, 0.5);
  backdrop-filter: blur(5px);
  font-size: 1rem;
}
</style>
