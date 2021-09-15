/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { dataFormatter } from './data-formatter';

import { docInterface } from './TryItOut_types';

import { Ref } from 'vue';

const {
  getInputProperties,
  rawInputPropertiesToDataForm,
  rawInputPropertiesToJsonString,
} = dataFormatter();

const postApiService = () => {
  function getEndPoint(doc: docInterface) {
    const server = doc.servers[0]['url'];
    const path = Object.keys(doc.paths)[0];
    return `${server}${path}`;
  }

  function getContentType(doc: docInterface) {
    const contentType = Object.keys(
      Object.values(Object.values(doc.paths)[0])[0].requestBody.content
    )[0];
    return contentType;
  }

  function postApiCall(userDocRef: Ref<docInterface>, apiKey: Ref<string>) {
    const doc = userDocRef.value ?? userDocRef;
    console.log('making post api call');
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      const contentType = getContentType(doc);

      xhr.open('POST', getEndPoint(doc));

      xhr.onreadystatechange = function () {
        if (this.readyState === this.DONE) {
          console.log(xhr);
          resolve(xhr);
        }
      };

      xhr.setRequestHeader('x-api-key', apiKey.value);

      if (contentType === 'multipart/form-data') {
        xhr.send(rawInputPropertiesToDataForm(getInputProperties(userDocRef)));
      } else {
        /**
         * For multipart/form-data, DO NOT set the Request Header, else will
         * keep getting error. Refer to :
         * https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects
         * Middle of the page, there is a warning message
         */
        xhr.setRequestHeader('Content-Type', contentType);
        xhr.send(
          rawInputPropertiesToJsonString(getInputProperties(userDocRef))
        );
      }

      console.log(
        rawInputPropertiesToDataForm(getInputProperties(userDocRef)).get(
          'filePath'
        )
      );
    });
  }

  return {
    postApiCall,
  };
};

export { postApiService };
