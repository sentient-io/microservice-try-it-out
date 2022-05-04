import axios from 'axios';
import { ref, reactive } from 'vue';
import yaml from 'js-yaml';

import { formatterService } from '../formatter_service';

import { dataFormatter } from './data-formatter';
import { postApiService } from './post-api_service';

import DocClass from 'src/services/DocClass';

const { anythingToString } = formatterService();

/** Check if the page opened in iframe */
const isInIframe = window.location !== window.parent.location;

/** DO NOT mutate or change this rawDocRef */
const rawDocRef = ref({});

/** Any user input or update goes to  here */
const userDocRef = ref({});

/** New doc class to replace other doc parsing functions */
let docClass = ref({});

const apiResponse = reactive({
  status: '',
  statusDescription: '',
  response: '',
  counter: 0, // Counter to trigger reactive (for repeating API Call)
});

const apiKey = ref('');
if (localStorage.getItem('sentientApiKey')) {
  apiKey.value = localStorage.getItem('sentientApiKey');
}

const stopEditingNotifyMessage = {
  base64str: `<span style='font-size:1.1rem'>It seems you are trying to edit data contains <b>base64 string</b>.\
  As this page is for demo and explore puspe only.\ 
  To edit the heavy content, please use provided media/file uploader under \ 
  <b>Fields Input</b> mode to update data instead of directly editing here.</span>`,
  binaryFile: `This JSON format data contains uploaded binary file, edit on this page may cause data format error.
  Please edit with Fields Input mode instead.`,
};

const tryItOutService = () => {
  function setApiKey(theKey) {
    console.log(theKey);
    localStorage.setItem('sentientApiKey', theKey);
    apiKey.value = theKey;
  }

  function updateJsonToInputProperties(jsonStr, inputProperties) {
    let parsedStr;
    try {
      // Below code disabled on 2022-Mar-24, to solve JSON formatting issue
      // parsedStr = JSON.parse(reverseFormatJsonString(jsonStr));
      parsedStr = JSON.parse(jsonStr);
    } catch (err) {
      console.log(err);
      throw err.message; // For bad formatted jsong string
    }
    Object.keys(parsedStr).forEach((key) => {
      /**
       * From inputProperties find the x-name value equals to Json
       * input key, then update input value to example.
       */
      if (checkPropertyKeyExistance(inputProperties, key)) {
        let propertyToUpdate =
          inputProperties[key] ??
          Object.values(inputProperties).find((property) => {
            let theKey = property['x-name'] ?? property.name;
            return theKey === key;
          });
        propertyToUpdate.example = parsedStr[key];
      } else {
        throw `
          Fields "${key}" doesn't belong to the input data schemas. 
          Please double check the spelling. 
          Alternately, you can use the Fields Input mode for a more user friendly experience.`;
      }
    });
    updateUserDeletedInputProperty(parsedStr, inputProperties);
    return inputProperties;
  }

  function checkPropertyKeyExistance(inputProperties, keyToCheck) {
    let keyExist = false;
    Object.keys(inputProperties).forEach((key) => {
      let propertyKey =
        inputProperties[key]['x-name'] ?? inputProperties[key].name ?? key;
      if (propertyKey === keyToCheck) {
        keyExist = true;
      }
    });
    return keyExist;
  }

  function updateUserDeletedInputProperty(newInputProps, currentInputProps) {
    Object.keys(currentInputProps).forEach((key) => {
      let currentKey =
        currentInputProps[key]['x-name'] ?? currentInputProps[key].name ?? key;
      if (!checkPropertyKeyExistance(newInputProps, currentKey)) {
        let currentProp = currentInputProps[currentKey];
        currentProp.example = '';
        checkRequiredValue(currentProp, listOfRequiredValues(rawDocRef.value));
      }
    });
  }

  function validateInputProperties(
    inputProperties = getInputProperties(userDocRef)
  ) {
    try {
      Object.keys(inputProperties).forEach((propertyKey) => {
        const property = inputProperties[propertyKey];
        checkRequiredValue({ [propertyKey]: property });
      });
    } catch (err) {
      return err;
    }
    return '';
  }

  function checkRequiredValue(
    property = getInputProperties(userDocRef) /* Object */,
    requiredValues = listOfRequiredValues(userDocRef) /* List */
  ) {
    let propertyKey =
      property['x-name'] ?? property.name ?? Object.keys(property)[0];
    if (
      requiredValues.includes(propertyKey) &&
      !property[propertyKey].example
    ) {
      throw `Fields "${propertyKey}" is required with valid value.`;
    }
    return true;
  }

  function listOfRequiredValues(apiDocRef) {
    const apiDoc = apiDocRef.value ?? apiDocRef;
    return apiDoc?.components?.schemas?.input?.required || [];
  }

  function fetchApiDoc(path) {
    return new Promise((resolve, reject) => {
      axios
        .get(path)
        .then((res) => {
          rawDocRef.value = JSON.parse(
            JSON.stringify(yaml.load(res.data, { json: true }))
          );
          /**
           * 2022 Mar - going to move all doc functison to DocClass
           */
          docClass.value = new DocClass(
            JSON.parse(JSON.stringify(yaml.load(res.data, { json: true })))
          );
          // console.log(docClass.value)
          initUserDocRef();
          resolve('ApiDoc Fetched');
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  function initUserDocRef() {
    /** Duplicate and remove the reactivity of doc object */
    userDocRef.value = JSON.parse(JSON.stringify(rawDocRef.value));
    resetApiResponse();
  }

  const resetApiResponse = () => {
    apiResponse.status = '';
    apiResponse.statusDescription = '';
    apiResponse.response = {};
    apiResponse.counter = 0;
  };

  function validApiDoc(apiDoc) {
    let valid = true;
    if (!apiDoc.paths) {
      valid = false;
    }
    return valid;
  }

  function inputTypeByApi(apiDoc) {
    let inputType = 'jsonDataInput';
    let apiType;
    if (validApiDoc(apiDoc)) {
      apiType = Object.keys(Object.values(apiDoc.paths)[0])[0];
    }
    if (apiType === 'get') {
      inputType = 'queryStringInput';
    }
    return inputType;
  }

  const { getInputProperties, addMaskedValueToInputProperties } =
    dataFormatter();

  function inputPropertiesToJsonString(inputProperties) {
    const jsonInput = {};
    Object.keys(inputProperties).forEach((propertyKey) => {
      let property = inputProperties[propertyKey];
      let key = property.name || property['x-name'] || propertyKey;
      let value = property.maskedValue || property.example;

      if (value?.name && value?.size && value?.type) {
        value = value.name;
      }
      Object.assign(jsonInput, {
        [key]: value,
      });
    });
    return JSON.stringify(jsonInput);
  }

  function inputPropertiesContainMaskedValue(inputProperties) {
    let hasMaskedValue = false;
    Object.values(inputProperties).forEach((property) => {
      if (property.maskedValue) {
        hasMaskedValue = true;
      }
    });
    return hasMaskedValue;
  }

  function inputPropertiesContainBinaryFile(inputProperties) {
    let hasBinaryFile = false;
    Object.values(inputProperties).forEach((property) => {
      if (
        property.example.name &&
        property.example.size &&
        property.example.type
      ) {
        hasBinaryFile = true;
      }
    });
    return hasBinaryFile;
  }

  function formatJsonString(jsonString, removeEmptyValue = false) {
    let splittedJsonStr = splitJsonStringIntoLines(jsonString);
    let tempArr = splittedJsonStr.split('\n');
    let formattedStr = '';
    let indent = '';
    tempArr.forEach((str) => {
      str.includes('}') ? (indent = indent.replace('    ', '')) : null;
      formattedStr += indent + str + '\n';
      str.includes('{') ? (indent += '    ') : null;
    });

    if (removeEmptyValue) {
      /** Remove empty value */
      formattedStr = formattedStr.replace(/".+":""(,\n)?/g, '');
    }

    formattedStr = formattedStr
      .replace(/\\\"/g, '"')
      .replace(/\"\{/g, '{')
      .replace(/\}\"/g, '}');
    return formattedStr;
  }

  function reverseFormatJsonString(jsonString) {
    let reverseFormattedStr = jsonString.replace(/\n/g, '').replace(/\s/g, '');

    return reverseFormattedStr;
  }

  function splitJsonStringIntoLines(jsonString) {
    let formattedStr = jsonString
      .replace(/\{/g, '{\n') // Move all start "{" to next line
      .replace(/\}/g, '\n}') // Move all end "{" to next line
      .replace(/\,\"/g, ',\n"') // Move all string after comma ',' to new line
      .replace(/,\s*\n\}/g, '\n}');
    return formattedStr;
  }

  function editingHeavyContentAlert() {
    window.alert(stopEditingNotifyMessage.base64str);
  }

  function editingBinaryFileContentAlert() {
    window.alert(stopEditingNotifyMessage.binaryFile);
  }

  function getInputFieldLabel(inputProperty, name, idx) {
    /**
     * idx and name are fall backs:, some case the property doesn't
     * contain x-name and name, but the key itself is the name
     */
    let label = null;
    label = inputProperty['x-name'] || inputProperty.name || name || idx;
    // console.log(label, inputProperty);
    label += ` (${inputProperty.type || inputProperty.schema.type})`;
    return label;
  }

  function checkJsonAlikeString(str) {
    const jsonValidator =
      /[{\[]{1}([,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]|".*?")+[}\]]{1}/;
    return jsonValidator.test(str);
  }

  function parseInputPropertiesToQueryStr(inputPropertiesRef) {
    let queryStr = '';

    if (!inputPropertiesRef) {
      return queryStr;
    }

    inputPropertiesRef.forEach((property) => {
      if (property.example) {
        queryStr += `${property.name}=${property.example}&`;
      }
    });

    queryStr = queryStr.replace(/\\\"/g, '"');
    queryStr = `?${encodeURI(queryStr)}`;
    queryStr = queryStr.replace(/\&$/, '');
    return queryStr;
  }

  function getApiCallMethod(docRef) {
    const doc = docRef.value ?? docRef;
    const method = Object.keys(Object.values(doc.paths)[0])[0];
    return method;
  }

  function getEndPoint(docRef) {
    const doc = docRef.value ?? docRef;
    const server = doc.servers[0]['url'];
    const path = Object.keys(doc.paths)[0];
    return `${server}${path}`;
  }

  const { postApiCall } = postApiService();

  async function makePostApiCall() {
    const _userDocRef = docClass.value.getUserDoc();
    const res = await postApiCall(_userDocRef, apiKey);
    console.log(res);
    apiResponse.status = res?.status?.toString() || '';
    /**
     * Trying to get the correct status description from the documentation,
     * The response doesn't contain the description test, so  have  to  get
     * from the documentation iteself.
     * */
    apiResponse.statusDescription =
      Object.values(rawDocRef.value.paths)[0]?.post?.responses[
        res?.status?.toString()
      ]?.description || '';
    apiResponse.response =
      typeof res.response == 'object' ? JSON.parse(res.response) : res.response;
    apiResponse.counter += 1;
    return res;
  }

  function makeGetApiCall() {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open(
        'GET',
        getEndPoint(userDocRef) +
          parseInputPropertiesToQueryStr(getInputProperties(userDocRef))
      );

      console.log(
        parseInputPropertiesToQueryStr(getInputProperties(userDocRef))
      );
      console.log(getInputProperties(userDocRef));

      xhr.onreadystatechange = function () {
        if (this.readyState === this.DONE) {
          apiResponse.status = xhr.status.toString();
          apiResponse.statusDescription = xhr.statusText;
          apiResponse.response = JSON.parse(xhr.response);
          apiResponse.counter += 1;
          console.log(xhr);
          resolve(xhr.response);
        }
      };
      xhr.setRequestHeader('x-api-key', apiKey.value);
      xhr.send(null);
    });
  }

  function checkAudioBase64String(base64String) {
    if (typeof base64String == 'string' && base64String.includes('UklGR')) {
      return true;
    }
    return false;
  }

  function getInputDataType(inputProperty) {
    switch (inputProperty.type) {
      case 'float':
      case 'number':
        return 'number';
        break;
      default:
        return 'textarea';
        break;
    }
  }

  function updateInputPropertyExampleValue(inputProperty, exampleValue) {
    const inputPropertyType = inputProperty.type ?? inputProperty.schema.type;
    if (exampleValue === '') {
      // If user input empty value, don't perform any data modification
      inputProperty.example = exampleValue;
      return;
    }
    try {
      switch (inputPropertyType) {
        case 'float':
          inputProperty.example = parseFloat(exampleValue);
          break;
        case 'string':
          inputProperty.example = anythingToString(exampleValue);
          // inputProperty.example = JSON.stringify(exampleValue);
          break;
        case 'number':
          inputProperty.example = +exampleValue;
          break;
        default:
          inputProperty.example = exampleValue;
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }

  function testing() {
    return 'test';
  }

  return {
    testing,
    fetchApiDoc,
    initUserDocRef,
    inputTypeByApi,
    isInIframe,

    validApiDoc,
    validateInputProperties,
    checkRequiredValue,
    checkJsonAlikeString,
    checkAudioBase64String,

    setApiKey,
    addMaskedValueToInputProperties,

    getInputProperties,
    getApiCallMethod,
    getInputFieldLabel,
    getEndPoint,
    getInputDataType,

    inputPropertiesToJsonString,
    inputPropertiesContainMaskedValue,
    inputPropertiesContainBinaryFile,
    parseInputPropertiesToQueryStr,
    formatJsonString,
    reverseFormatJsonString,

    updateJsonToInputProperties,
    updateInputPropertyExampleValue,

    listOfRequiredValues,

    editingHeavyContentAlert,
    editingBinaryFileContentAlert,
    stopEditingNotifyMessage,

    makePostApiCall,
    makeGetApiCall,
    apiKey,
    rawDocRef,
    userDocRef,
    apiResponse,
    docClass,
  };
};

export { tryItOutService };
