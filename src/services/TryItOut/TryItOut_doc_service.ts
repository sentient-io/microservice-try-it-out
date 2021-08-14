import { docInterface } from './TryItOut_types';

const tryItOutDocService = () => {
  function getImgBase64FromDocRef(docRef: docInterface) {
    console.log(docRef);
    return '';
  }

  return { getImgBase64FromDocRef };
};

export { tryItOutDocService };
