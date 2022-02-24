import { tryItOutService } from 'src/services/TryItOut/TryItOut_service';
import PostCall from '../PostCall';

const { apiKey } = tryItOutService();

async function getUploadPolicy(fileData, endpoint) {
  return dummyPolicy.results
  const response = await PostCall({
    endpoint,
    data: fileData,
    apiKey: apiKey.value,
  });
  try {
    console.log(response)
    return response.results;
  } catch (err) {
    // Todo, catch the case for failed api call
    console.error(err);
  }
}

async function uploadLargeFile(data, endpoint, contentType) {
  // 2nd call is a multy-form data (for now) so add in content type
  console.log(data, endpoint, contentType)
  const response = await PostCall({
    endpoint,
    data,
    apiKey: apiKey.value,
    contentType,
  });
  console.log(response)
  return response;
}

export default () => {
  return {
    getUploadPolicy,
    uploadLargeFile,
  };
};

const dummyPolicy = {
  message: 'Successfully Processed',
  results: {
    fields: {
      'content-type': 'application/pdf',
      key: '267/434/lp-textsummarisation/input/test-large-text_2055a04bbe65485d80773b9e920309ba.pdf',
      policy:
        'eyJjb25kaXRpb25zIjpbWyJlcSIsIiRDb250ZW50LVR5cGUiLCJhcHBsaWNhdGlvbi9wZGYiXSxbImNvbnRlbnQtbGVuZ3RoLXJhbmdlIiwwLDEzOTgxMDAxMV0seyJjb250ZW50LXR5cGUiOiJhcHBsaWNhdGlvbi9wZGYifSx7IngtZ29vZy1tZXRhLWFkZGl0aW9uYWxfcGFyYW0iOiJOb25lIn0seyJ4LWdvb2ctbWV0YS1vaWQiOiIyNjcifSx7IngtZ29vZy1tZXRhLXVpZCI6IjQzNCJ9LHsieC1nb29nLW1ldGEtdXBsb2FkZXIiOiIzOTc0YWJhZDg1MmU0ZTMzYTU4MGE1Y2U4OTk4NWEzMSJ9LHsieC1nb29nLW1ldGEtdXVpZCI6IjIwNTVhMDRiYmU2NTQ4NWQ4MDc3M2I5ZTkyMDMwOWJhIn0seyJidWNrZXQiOiJscF91c2VyX3NwYWNlX3Byb2QifSx7ImtleSI6IjI2Ny80MzQvbHAtdGV4dHN1bW1hcmlzYXRpb24vaW5wdXQvdGVzdC1sYXJnZS10ZXh0XzIwNTVhMDRiYmU2NTQ4NWQ4MDc3M2I5ZTkyMDMwOWJhLnBkZiJ9LHsieC1nb29nLWRhdGUiOiIyMDIyMDIyM1QxNTU4NDZaIn0seyJ4LWdvb2ctY3JlZGVudGlhbCI6InNlbnRpZW50LWJpZ3F1ZXJ5QHNlbnRpZW50LTIzMTUwOS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbS8yMDIyMDIyMy9hdXRvL3N0b3JhZ2UvZ29vZzRfcmVxdWVzdCJ9LHsieC1nb29nLWFsZ29yaXRobSI6IkdPT0c0LVJTQS1TSEEyNTYifV0sImV4cGlyYXRpb24iOiIyMDIyLTAyLTIzVDE2OjU4OjQ2Ljg0MDM3NVoifQ==',
      'x-goog-algorithm': 'GOOG4-RSA-SHA256',
      'x-goog-credential':
        'sentient-bigquery@sentient-231509.iam.gserviceaccount.com/20220223/auto/storage/goog4_request',
      'x-goog-date': '20220223T155846Z',
      'x-goog-meta-additional_param': 'None',
      'x-goog-meta-oid': '267',
      'x-goog-meta-uid': '434',
      'x-goog-meta-uploader': '3974abad852e4e33a580a5ce89985a31',
      'x-goog-meta-uuid': '2055a04bbe65485d80773b9e920309ba',
      'x-goog-signature':
        '31827dc66d8231720a72146af61c120bcba2606a5661cdfbe3df3a5e073602a108250be018db89145469c19b8df46fc195f11f5fb279c97ff24af4bce79513f5f9215c137445aa2c5f6732d2a0b0d80485706391d98113234ca9dfdd2490f4e2e0149ea6faf3e79bd69792ad329b76de6cf2aebd948357930188a7203e505dc57d1fe7db4832837a784cc39970991def8fb2df23a065214259e2e1733ed91258ed0e814098781f96bbcdf2da4a383be743c7a901455d209d10962d5c1f75d4bd283eb05609e918dd9e157c01503c904e1c33de5d8bbb543fb842ee4bfbb6782f7bfd935ba3124249508d6fe24808b8bbcb6d54018f8130c1fea29b4fd15a4412',
    },
    jid: '2055a04bbe65485d80773b9e920309ba',
    request_cost: 2.1866,
    url: 'https://storage.googleapis.com/lp_user_space_prod/',
  },
  status: 'Success',
};
