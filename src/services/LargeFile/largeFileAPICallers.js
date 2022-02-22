import { tryItOutService } from 'src/services/TryItOut/TryItOut_service';
import PostCall from '../PostCall';

const { apiKey } = tryItOutService();

export default () => {
  function getUploadUrl(fileData, endpoint) {
    // const { endpoint, requestBodySchema } = findGetUploadUrlDoc();
    // const data = fmtFileForApiCall(fileDetail, requestBodySchema);
    console.log({ endpoint, data: fileData, apiKey: apiKey.value })
    void PostCall({ endpoint, data: fileData, apiKey: apiKey.value }).then(
      (res) => {
        console.log(res);
      }
    );
    return;
  }

  return {
    getUploadUrl,
  };
};
