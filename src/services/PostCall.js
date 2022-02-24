export default ({
  endpoint,
  contentType = 'application/json',
  data,
  apiKey,
}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);

    xhr.onreadystatechange = function () {
      if (this.readyState === this.DONE) {
        console.log(xhr);
        resolve(xhr.response);
        if (false) {
          // TODO add in error catcher
          reject('error');
        }
      }
    };

    xhr.setRequestHeader('x-api-key', apiKey);

    if (contentType === 'multipart/form-data') {
      xhr.send();
    } else {
      /**
       * For multipart/form-data, DO NOT set the Request Header, else will
       * keep getting error. Refer to :
       * https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects
       * Middle of the page, there is a warning message
       */
      xhr.setRequestHeader('Content-Type', contentType);
      // console.log({
      //   endpoint,
      //   contentType,
      //   data,
      //   apiKey,
      // });
      xhr.send(data);
    }
  });
};
