import largeFileAPICallers from './largeFileAPICallers';
import { tryItOutService } from 'src/services/TryItOut/TryItOut_service';

import { Notify } from 'quasar';

export default () => {
  const {
    getUploadPolicy,
    uploadLargeFile,
    fetchLargeFileStatus,
    fetchLargeFileResult,
  } = largeFileAPICallers();

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

  function fmtFileDataForApiCall(file, additionalParam) {
    /**
     * Prepare user uploaded file to make it suitable for first
     * get upload url api call
     */
    const fileData = {};
    const requestBody =
      docClass.value.findRequestBodySchema(FIRST_API_INDICATOR);
    Object.keys(requestBody.properties).forEach((property) => {
      // !!! Hard coded to ignore the additional_param
      if (property == 'additional_param') {
        fileData[property] = additionalParam;
        // console.log(property, JSON.stringify(additionalParam));
      } else {
        fileData[property] = mapFileProperty(file, property);
      }
    });
    // !!!! This need to have a logic, shouldn't be alwasy string format, where to get the content-type???
    return JSON.stringify(fileData);
  }

  function fmtFormDataForApiCall(fileObj, fields) {
    console.log(fileObj, fields);
    const requestBody =
      docClass.value.findRequestBodySchema(SECOND_API_INDICATOR);
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
        formData.append('Content-Type', fields[property]);
      } else {
        formData.append(property, fields[property]);
      }
    });

    formData.append('file', fileObj);
    return formData;
  }

  function setJobLocalStorage(policy, fileObj) {
    // Store job id to local storage together with the current time
    const storage = window.localStorage;
    const timestamp = new Date(Date.now()).toLocaleString();
    const msTitle = rawDocRef.value.info.title;
    // !IMPORTANT hard coded value from policy
    const jID = policy['jid'];
    const jobItem = {
      fileName: fileObj.name,
      size: fileObj.size,
      cost: policy['request_cost'],
      additionalParam: policy['fields']['x-goog-meta-additional_param'] || '',
      jID,
      timestamp,
    };
    let jobList = getJobLocalStorage();

    if (jobList) {
      console.log(jobList);
      const hasJID = Boolean(jobList.find((e) => e.jID == jID));
      if (!hasJID) {
        // Only append jID if there is no existing jID
        jobList.push(jobItem);
      }
    } else {
      // Init new array of jids
      jobList = [jobItem];
    }

    storage.setItem(msTitle, JSON.stringify(jobList));

    // console.log(getJobLocalStorage());
  }

  function clearJobLocalStorage() {
    const storage = window.localStorage;
    const msTitle = rawDocRef.value.info.title;

    Notify.create({
      message:
        'Fro try it out purpose, all Job ID are sotred in local storage, by clicking CLEAR button, all sotred Job ID and Status will be removed permanently. Please marke sure your testing process have completely finished before clear the table.',
      color: 'red',
      multiLine: true,
      icon: 'warning',
      timeout: 0,
      actions: [
        {
          label: 'Clear',
          color: 'white',
          handler: () => {
            storage.removeItem(msTitle); // Testing purpose, clean local storage
          },
        },
        {
          label: 'Cancel',
          color: 'white',
          handler: () => {
            /* ... */
          },
        },
      ],
    });
  }

  function getJobLocalStorage() {
    const storage = window.localStorage;
    const msTitle = rawDocRef.value.info.title;
    const storageMsItem = storage.getItem(msTitle);
    const jobList = JSON.parse(storageMsItem);
    return jobList;
  }

  async function useFetchLargeFileStatus(jID) {
    const endpoint = docClass.value.findEndpoint(FETCH_STATUS_API_INDICATOR);
    const res = await fetchLargeFileStatus(jID, endpoint);
    if (res.data) {
      return res.data;
    }
    return res;
  }

  async function requestUploadingPolicy(fileObj, additionalParam) {
    // Prepare data and trigger 1st api call
    const fileData = fmtFileDataForApiCall(fileObj, additionalParam);
    const endpoint = docClass.value.findEndpoint(FIRST_API_INDICATOR);
    const policy = await getUploadPolicy(fileData, endpoint);
    console.log(policy);

    return policy;
  }

  async function useUploadLargeFile(fileObj, policyRef) {
    // Prepare data and trigger 2nd api call
    const formData = fmtFormDataForApiCall(fileObj, policyRef.fields);

    const contentType = docClass.value.findContentType(SECOND_API_INDICATOR);
    // Hard coded url, assume each time policy return the valid url to upload
    const endpoint = policyRef.url;
    await uploadLargeFile(formData, endpoint, contentType)
      .then(() => {
        setJobLocalStorage(policyRef, fileObj);
      })
      .catch((err) => {
        console.log(err);
      });

    return;
  }

  async function useFetchLargeFileResult(resultUrl) {
    const res = await fetchLargeFileResult(resultUrl);
    return res.data;
  }

  function getInputSchema() {
    const schema = docClass.value.findRequestBodySchema(FIRST_API_INDICATOR);
    return schema;
  }

  return {
    requestUploadingPolicy,
    useUploadLargeFile,
    getJobLocalStorage,
    useFetchLargeFileStatus,
    useFetchLargeFileResult,
    getInputSchema,
    clearJobLocalStorage,
  };
};
