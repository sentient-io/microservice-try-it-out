import axios from 'axios';
import { tryItOutService } from 'src/services/TryItOut/TryItOut_service';

const { apiKey } = tryItOutService();

async function getUploadPolicy(fileData, endpoint) {
  // return DUMMY_POLICY.results
  const headers = {
    'x-api-key': apiKey.value,
    'content-type': 'application/json',
  };
  const response = await axios.post(endpoint, fileData, { headers });
  // const response = await PostCall({
  //   endpoint,
  //   data: fileData,
  //   apiKey: apiKey.value,
  // });
  try {
    console.log(response);
    return response.data.results;
  } catch (err) {
    // Todo, catch the case for failed api call
    console.error(err);
  }
}

async function uploadLargeFile(data, endpoint, contentType) {
  // 2nd call is a multy-form data (for now) so add in content type
  console.log(data, endpoint, contentType);
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'content-type': 'multipart/form-data',
  };
  const response = await axios.post(endpoint, data, { headers });
  // const response = await PostCall({
  //   endpoint,
  //   data,
  //   apiKey: apiKey.value,
  //   contentType,
  // });
  console.log(response);
  return response;
}

export default () => {
  return {
    getUploadPolicy,
    uploadLargeFile,
  };
};

const DUMMY_POLICY = {
  message: 'Successfully Processed',
  results: {
    fields: {
      'content-type': 'application/pdf',
      key: '3068/3303/lp-textsummarisation/input/test-large-text_ec3f8149ad9343159941986980907ab8.pdf',
      policy:
        'eyJjb25kaXRpb25zIjpbWyJlcSIsIiRDb250ZW50LVR5cGUiLCJhcHBsaWNhdGlvbi9wZGYiXSxbImNvbnRlbnQtbGVuZ3RoLXJhbmdlIiwwLDEzOTgxMDAxMV0seyJjb250ZW50LXR5cGUiOiJhcHBsaWNhdGlvbi9wZGYifSx7IngtZ29vZy1tZXRhLWFkZGl0aW9uYWxfcGFyYW0iOiJOb25lIn0seyJ4LWdvb2ctbWV0YS1vaWQiOiIzMDY4In0seyJ4LWdvb2ctbWV0YS11aWQiOiIzMzAzIn0seyJ4LWdvb2ctbWV0YS11cGxvYWRlciI6IjYzYzUxYWMxOTc3MjRhMTZhNzkzZDE2ZDk3ZWNhNWVjIn0seyJ4LWdvb2ctbWV0YS11dWlkIjoiZWMzZjgxNDlhZDkzNDMxNTk5NDE5ODY5ODA5MDdhYjgifSx7ImJ1Y2tldCI6ImxwX3VzZXJfc3BhY2VfcHJvZCJ9LHsia2V5IjoiMzA2OC8zMzAzL2xwLXRleHRzdW1tYXJpc2F0aW9uL2lucHV0L3Rlc3QtbGFyZ2UtdGV4dF9lYzNmODE0OWFkOTM0MzE1OTk0MTk4Njk4MDkwN2FiOC5wZGYifSx7IngtZ29vZy1kYXRlIjoiMjAyMjAzMDdUMDg1MDQ1WiJ9LHsieC1nb29nLWNyZWRlbnRpYWwiOiJzZW50aWVudC1iaWdxdWVyeUBzZW50aWVudC0yMzE1MDkuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20vMjAyMjAzMDcvYXV0by9zdG9yYWdlL2dvb2c0X3JlcXVlc3QifSx7IngtZ29vZy1hbGdvcml0aG0iOiJHT09HNC1SU0EtU0hBMjU2In1dLCJleHBpcmF0aW9uIjoiMjAyMi0wMy0wN1QwOTo1MDo0NS44OTY3NjZaIn0=',
      'x-goog-algorithm': 'GOOG4-RSA-SHA256',
      'x-goog-credential':
        'sentient-bigquery@sentient-231509.iam.gserviceaccount.com/20220307/auto/storage/goog4_request',
      'x-goog-date': '20220307T085045Z',
      'x-goog-meta-additional_param': 'None',
      'x-goog-meta-oid': '3068',
      'x-goog-meta-uid': '3303',
      'x-goog-meta-uploader': '63c51ac197724a16a793d16d97eca5ec',
      'x-goog-meta-uuid': 'ec3f8149ad9343159941986980907ab8',
      'x-goog-signature':
        'c1864d78dc1b3639258a2238b0907a0afdc2f28a65eea35bedc6d69550bdcdf58daecd30f1d939a4bd0a5cf7ef91f86d46224b6c02158ebb4988347403e9f2690f255973f692c434de6c15cca50dc886fb87852faa3db5ff3fbfabf77956d37b33d3f79ec0783759b5c187d154d269eb724a2ef164af9e133e7309579377774356dc02b9ab658e21d057090e86478477003e2370f694761cd195cfc24f0384cdc27d628ec6b7c7d5fa4ae3d04829995b072f2a91bedc638e6364e03bc995ba773580253e716186da4e6624cefc264b648264748055a13884921e24812847cfd1dde8d4e7b3f1878d8660e1dc6a96a2d8b60f7a130823afc78b0491a6e7c3ceb0',
    },
    jid: 'ec3f8149ad9343159941986980907ab8',
    request_cost: 2.1866,
    url: 'https://storage.googleapis.com/lp_user_space_prod/',
  },
  status: 'Success',
};
