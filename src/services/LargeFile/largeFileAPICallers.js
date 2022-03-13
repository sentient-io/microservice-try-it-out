import axios from 'axios';
import { tryItOutService } from 'src/services/TryItOut/TryItOut_service';
import { Loading } from 'quasar';

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
    'Access-Control-Allow-Origin': '*',
    'content-type': 'multipart/form-data',
  };
  Loading.show();
  const response = await axios.post(endpoint, data, { headers });
  Loading.hide();
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

const DUMMY_POLICY = {
  message: 'Successfully Processed',
  results: {
    fields: {
      'content-type': 'application/pdf',
      key: '3068/3303/lp-textsummarisation/input/test-large-text_7cdc69a490e549e791eae781a84310b6.pdf',
      policy:
        'eyJjb25kaXRpb25zIjpbWyJlcSIsIiRDb250ZW50LVR5cGUiLCJhcHBsaWNhdGlvbi9wZGYiXSxbImNvbnRlbnQtbGVuZ3RoLXJhbmdlIiwwLDEzOTgxMDAxMV0seyJjb250ZW50LXR5cGUiOiJhcHBsaWNhdGlvbi9wZGYifSx7IngtZ29vZy1tZXRhLWFkZGl0aW9uYWxfcGFyYW0iOiJOb25lIn0seyJ4LWdvb2ctbWV0YS1vaWQiOiIzMDY4In0seyJ4LWdvb2ctbWV0YS11aWQiOiIzMzAzIn0seyJ4LWdvb2ctbWV0YS11cGxvYWRlciI6ImQ2YTBjMGVlMDBjMTQxM2FiOTZjOGI1MDgwOWE3N2Q0In0seyJ4LWdvb2ctbWV0YS11dWlkIjoiN2NkYzY5YTQ5MGU1NDllNzkxZWFlNzgxYTg0MzEwYjYifSx7ImJ1Y2tldCI6ImxwX3VzZXJfc3BhY2VfcHJvZCJ9LHsia2V5IjoiMzA2OC8zMzAzL2xwLXRleHRzdW1tYXJpc2F0aW9uL2lucHV0L3Rlc3QtbGFyZ2UtdGV4dF83Y2RjNjlhNDkwZTU0OWU3OTFlYWU3ODFhODQzMTBiNi5wZGYifSx7IngtZ29vZy1kYXRlIjoiMjAyMjAzMDhUMDgwNzIzWiJ9LHsieC1nb29nLWNyZWRlbnRpYWwiOiJzZW50aWVudC1iaWdxdWVyeUBzZW50aWVudC0yMzE1MDkuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20vMjAyMjAzMDgvYXV0by9zdG9yYWdlL2dvb2c0X3JlcXVlc3QifSx7IngtZ29vZy1hbGdvcml0aG0iOiJHT09HNC1SU0EtU0hBMjU2In1dLCJleHBpcmF0aW9uIjoiMjAyMi0wMy0wOFQwOTowNzoyMy40NDMwNzNaIn0=',
      'x-goog-algorithm': 'GOOG4-RSA-SHA256',
      'x-goog-credential':
        'sentient-bigquery@sentient-231509.iam.gserviceaccount.com/20220308/auto/storage/goog4_request',
      'x-goog-date': '20220308T080723Z',
      'x-goog-meta-additional_param': 'None',
      'x-goog-meta-oid': '3068',
      'x-goog-meta-uid': '3303',
      'x-goog-meta-uploader': 'd6a0c0ee00c1413ab96c8b50809a77d4',
      'x-goog-meta-uuid': '7cdc69a490e549e791eae781a84310b6',
      'x-goog-signature':
        '8eb04f8b6ee09dac189618ce783c09a090a0abd25ea7058aec79b559f53c0dde70e52e09153a25b36ce2f3882271092dd2ed304428dbb3207e145f2477e6853fed7086bf680e10d6d63e9c4d4e53756122443b25a5db191ba38d6517e3eb3766aee9e3cf80314acbcd5ab748d7c885a50a4b53a7fb0ffbff92d070e63a9b09f5102a270ab0a06ea97b4eb6e8a6fe574e97f30c241391dcf3aa851d9cb4d6beb0ab0a5b39cb42b381b141140ed0ec0ba269f1423f96f3efaba9876bd9b0f7d26f06d55012587e525bf936b1a242cd561b109dee5672115d85d40b77590d66a6590eec0b1f009175b359f0ac7d671b9e7ebff3a4d031fd8013d3e02b44bf193c24',
    },
    jid: '7cdc69a490e549e791eae781a84310b6',
    request_cost: 2.1866,
    url: 'https://storage.googleapis.com/lp_user_space_prod/',
  },
  status: 'Success',
};
