import axios from 'axios';
import { tryItOutService } from 'src/services/TryItOut/TryItOut_service';
import { Loading, Notify } from 'quasar';

const { apiKey } = tryItOutService();

async function getUploadPolicy(fileData, endpoint) {
  // return DUMMY_POLICY.results;
  const headers = {
    'x-api-key': apiKey.value,
    'content-type': 'application/json',
  };
  Loading.show();
  const response = await axios.post(endpoint, fileData, { headers });
  Loading.hide();
  try {
    console.log(response);
    return response.data.results;
  } catch (err) {
    // Todo, catch the case for failed api call
    console.error(err);
  }
}

async function fetchLargeFileStatus(jID, endpoint) {
  const queryUrl = `${endpoint}?jid=${encodeURIComponent(jID)}`;
  const headers = {
    'x-api-key': apiKey.value,
    'content-type': 'application/json',
  };
  const response = await axios.get(queryUrl, { headers }).catch((err) => {
    return err.message;
  });
  return response;
}

async function uploadLargeFile(data, endpoint) {
  // 2nd call is a multy-form data (for now) so add in content type
  const headers = {
    'content-type': 'multipart/form-data',
  };

  Loading.show();

  const response = await axios
    .post(endpoint, data, headers)
    .catch((err) => {
      Notify.create(err);
      console.log(err);
    })
    .finally(() => {
      Loading.hide();
    });

  return response;
}

async function fetchLargeFileResult(resultUrl) {
  const res = await axios.get(resultUrl);
  return res;
}

export default () => {
  return {
    getUploadPolicy,
    uploadLargeFile,
    fetchLargeFileStatus,
    fetchLargeFileResult,
  };
};
