import largeFileAPICallers from './largeFileAPICallers';
import { tryItOutService } from 'src/services/TryItOut/TryItOut_service';

const { getUploadPolicy, uploadLargeFile, fetchLargeFileStatus } =
  largeFileAPICallers();

/**
 * !!! Important !!!
 * If in future the endpoint text chagne, this INDICATOR
 * will be the logic to modify in  order to  target  the
 * first api call for large files.
 */
const FIRST_API_INDICATOR = '/getuploadurl';
const SECOND_API_INDICATOR = '/upload';
const FETCH_STATUS_API_INDICATOR = '/getstatus';

const { rawDocRef, docClass } = tryItOutService();

function mapFileProperty(file, property) {
  /**
   * Map API request body property with file object properties
   * this part have to be hard coded.
   */
  const map = {
    content_type: 'type',
    file_name: 'name',
    file_size: 'size',
  };
  try {
    return file[map[property]];
  } catch {
    console.error(
      'Property ' +
        property +
        ' is not mapped, please contact person in charge with a screenshot of this error message.'
    );
  }
}

function fmtFileDataForApiCall(file) {
  /**
   * Prepare user uploaded file to make it suitable for first
   * get upload url api call
   */
  const fileData = {};
  const requestBody = docClass.value.findRequestBody(FIRST_API_INDICATOR);
  Object.keys(requestBody.properties).forEach((property) => {
    // !!! Hard coded to ignore the additional_param
    if (property == 'additional_param') return;
    fileData[property] = mapFileProperty(file, property);
  });
  // !!!! This need to have a logic, shouldn't be alwasy string format, where to get the content-type???
  return JSON.stringify(fileData);
}

function fmtFormDataForApiCall(fileObj, fields) {
  console.log(fileObj, fields);

  const requestBody = docClass.value.findRequestBody(SECOND_API_INDICATOR);
  console.log(requestBody.properties);

  const formData = new FormData();

  Object.keys(requestBody.properties).forEach((property) => {
    /**
     * Here we assuming the policy ref and request schemas
     * shares the same key value.
     */
    // !IMPORTANT! Hard coded file key
    if (property == 'file') {
      // Skip file element, because of the form data order
    } else if (property == 'content-type') {
      console.log('Content-Type', fields[property]);
      formData.append('content-type', fields[property]);
    } else {
      formData.append(property, fields[property]);
    }
  });
  // !IMPORTANT! Hard coded remind engineer team to add this to api
  formData.append('file', fileObj);
  return formData;
}

function setLocalStorageJID(jID) {
  // Store job id to local storage together with the current time
  const storage = window.localStorage;
  const timestamp = new Date(Date.now()).toLocaleString();
  const msTitle = rawDocRef.value.info.title;
  const storageMsItem = storage.getItem(msTitle);
  // const storageMsItem = storage.removeItem(msTitle); // Testing purpose
  // return
  let jIDList;
  if (storageMsItem) {
    jIDList = JSON.parse(storageMsItem);
    const hasJID = Boolean(jIDList.find((e) => e.jID == jID));
    if (!hasJID) {
      // Only append jID if there is no existing jID
      jIDList.push({ jID, timestamp });
    }
  } else {
    // Init new array of jids
    jIDList = [{ jID, timestamp }];
  }

  storage.setItem(msTitle, JSON.stringify(jIDList));
  console.log(storage.getItem(msTitle));
}

function getLocalStorageJID() {
  const storage = window.localStorage;
  const msTitle = rawDocRef.value.info.title;
  const storageMsItem = storage.getItem(msTitle);
  const jIDList = JSON.parse(storageMsItem);
  return jIDList;
}

async function useFetchLargeFileStatus(jID) {
  const endpoint = docClass.value.findEndpoint(FETCH_STATUS_API_INDICATOR);
  const status = await fetchLargeFileStatus(jID, endpoint)
  return status;
}

async function requestUploadingPolicy(fileObj) {
  // Prepare data and trigger 1st api call
  const fileData = fmtFileDataForApiCall(fileObj);
  const endpoint = docClass.value.findEndpoint(FIRST_API_INDICATOR);
  const policy = await getUploadPolicy(fileData, endpoint);
  setLocalStorageJID(policy.jid);
  return policy;
}

function useUploadLargeFile(fileObj, policyRef) {
  // Prepare data and trigger 2nd api call
  const formData = fmtFormDataForApiCall(fileObj, policyRef.fields);

  const contentType = docClass.value.findContentType(SECOND_API_INDICATOR);
  // Hard coded url, assume each time policy return the valid url to upload
  void uploadLargeFile(formData, policyRef.url, contentType);
  return;
}

export default () => {
  return {
    requestUploadingPolicy,
    useUploadLargeFile,
    getLocalStorageJID,
    useFetchLargeFileStatus,
  };
};
