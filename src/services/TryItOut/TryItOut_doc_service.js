/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

const tryItOutDocService = () => {
  function getImgBase64FromDocRef(docRef) {
    console.log(docRef);
    const inputProperties = docRef.components.schemas.input.properties;
    if ('image_base64' in Object.keys(inputProperties)) {
      return inputProperties['image_base64'].example;
    } else {
      return '';
    }
  }

  return { getImgBase64FromDocRef };
};

export { tryItOutDocService };
