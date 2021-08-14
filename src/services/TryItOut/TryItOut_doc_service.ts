import { docInterface } from './TryItOut_types';

const tryItOutDocService = () => {
  function getImgBase64FromDocRef(docRef: docInterface) {
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
