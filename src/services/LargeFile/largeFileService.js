import largeFileAPICallers from './largeFileAPICallers';
// import largeFileFormatter from './largeFileFormatter';
import { tryItOutService } from 'src/services/TryItOut/TryItOut_service';
import yamlDocHelper from 'src/services/yamlDocHelper';

// const { getFileDetail } = largeFileFormatter();
const { getUploadUrl } = largeFileAPICallers();

/**
 * !!! Important !!!
 * If in future the endpoint text chagne, this INDICATOR
 * will be the logic to modify in  order to  target  the
 * first api call for large files.
 */
const INDICATOR = '/getuploadurl';

const { rawDocRef } = tryItOutService();
const { get$ref } = yamlDocHelper();

function findGetUploadUrlDoc() {
  /** Find the first post call api doc */
  const path = Object.keys(rawDocRef.value.paths).find((k) =>
    k.includes(INDICATOR)
  );
  const url = rawDocRef.value.servers[0].url;
  const requestBodySchema = get$ref(
    rawDocRef.value,
    '#/components/schemas/input'
  );
  return {
    doc: rawDocRef.value.paths[path],
    requestBodySchema,
    endpoint: url + path,
  };
}

function mapFileProperty(file, p) {
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
    return file[map[p]];
  } catch {
    console.error(
      'Property ' +
        p +
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
  const schema = findGetUploadUrlDoc().requestBodySchema;
  const properties = schema.properties;
  Object.keys(properties).forEach((k) => {
    if (k == 'additional_param') return;
    fileData[k] = mapFileProperty(file, k);
  });
  console.log(schema);
  // !!!! This need to have a logic, shouldn't be alwasy string format, where to get the content-type???
  return JSON.stringify(fileData);
}

function processFile(fileObj) {
  const fileData = fmtFileDataForApiCall(fileObj);
  // const fileDetail = getFileDetail(fileObj);
  const endpoint = findGetUploadUrlDoc().endpoint;
  getUploadUrl(fileData, endpoint);
}

export default () => {
  return { processFile };
};
