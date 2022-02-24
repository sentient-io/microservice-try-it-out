import largeFileAPICallers from './largeFileAPICallers';
// import largeFileFormatter from './largeFileFormatter';
import { tryItOutService } from 'src/services/TryItOut/TryItOut_service';
import yamlDocHelper from 'src/services/yamlDocHelper';

// const { getFileDetail } = largeFileFormatter();
const { getUploadPolicy, uploadLargeFile } = largeFileAPICallers();

/**
 * !!! Important !!!
 * If in future the endpoint text chagne, this INDICATOR
 * will be the logic to modify in  order to  target  the
 * first api call for large files.
 */
const FIRST_API_INDICATOR = '/getuploadurl';
const SECOND_API_INDICATOR = '/upload';

const { rawDocRef } = tryItOutService();
const { get$ref } = yamlDocHelper();

function findDocByIndicator(INDICATOR) {
  /** Find the first post call api doc */
  const path = Object.keys(rawDocRef.value.paths).find((k) =>
    k.includes(INDICATOR)
  );
  const url = rawDocRef.value.servers[0].url;
  const method = Object.keys(rawDocRef.value.paths[path]).includes('post')
    ? 'post'
    : 'get';
  const requestBody = rawDocRef.value.paths[path][method].requestBody;
  const contentType = Object.keys(requestBody.content)[0];
  rawDocRef.value.paths[path].post.requestBody.content;
  const requestBodySchema = get$ref(
    rawDocRef.value,
    requestBody.content[contentType].schema.$ref
  );
  return {
    doc: rawDocRef.value.paths[path],
    requestBodySchema,
    reqBodyProp: requestBodySchema.properties,
    endpoint: url + path,
    contentType,
  };
}

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
  const properties = findDocByIndicator(FIRST_API_INDICATOR).reqBodyProp;
  Object.keys(properties).forEach((property) => {
    // !!! Hard coded to ignore the additional_param
    if (property == 'additional_param') return;
    fileData[property] = mapFileProperty(file, property);
  });
  // !!!! This need to have a logic, shouldn't be alwasy string format, where to get the content-type???
  return JSON.stringify(fileData);
}

function fmtFormDataForApiCall(fileObj, fields) {
  const properties = findDocByIndicator(SECOND_API_INDICATOR).reqBodyProp;

  const formData = new FormData();

  Object.keys(properties).forEach((property) => {
    /**
     * Here we assuming the policy ref and request schemas
     * shares the same key value.
     */
    if (property == 'filePath') {
      formData.append(property, fileObj);
    } else {
      formData.append(property, fields[property]);
    }
  });

  return formData;
}

async function requestUploadingPolicy(fileObj) {
  // Prepare data and trigger 1st api call
  const fileData = fmtFileDataForApiCall(fileObj);
  // const fileDetail = getFileDetail(fileObj);
  const endpoint = findDocByIndicator(FIRST_API_INDICATOR).endpoint;
  const policy = await getUploadPolicy(fileData, endpoint);
  return policy;
}

function useUploadLargeFile(fileObj, policyRef) {
  // Prepare data and trigger 2nd api call
  const formData = fmtFormDataForApiCall(fileObj, policyRef.fields);
  const contentType = findDocByIndicator(SECOND_API_INDICATOR).contentType;
  // Hard coded url, assume each time policy return the valid url to upload
  void uploadLargeFile(formData, policyRef.url, contentType);
  return;
}

export default () => {
  return { requestUploadingPolicy, useUploadLargeFile };
};
