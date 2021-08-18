/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */

import axios from 'axios';
import { ref, reactive } from 'vue';
import yaml from 'js-yaml';

/** DO NOT mutate or change this rawDocRef */
const rawDocRef = ref({});

/** Any user input or update goes to  here */
const userDocRef = ref({});

const apiResponse = reactive({
  status: '',
  statusText: '',
  response: '',
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
  binaryFile: `This JSON format data contains uploaded binary file, eidting on this page may cause data format error.
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
      parsedStr = JSON.parse(reverseFormatJsonString(jsonStr));
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
    axios.get(path).then((res) => {
      rawDocRef.value = JSON.parse(
        JSON.stringify(yaml.load(res.data, { json: true }))
      );
      initUserDocRef();
    });
  }

  function initUserDocRef() {
    /** Duplicate and remove the reactivity of doc object */
    userDocRef.value = JSON.parse(JSON.stringify(rawDocRef.value));
    apiResponse.status = '';
    apiResponse.statusText = '';
    apiResponse.response = {};
  }

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

  function getInputProperties(apiDocRef) {
    let apiDoc = apiDocRef.value ?? apiDocRef;
    let inputProperties = '';
    try {
      inputProperties = apiDoc.components.schemas.input.properties;
      addMaskedValueToInputProperties(inputProperties);
    } catch (err) {}
    try {
      inputProperties = Object.values(apiDoc.paths)[0].get.parameters;
    } catch (err) {}
    return inputProperties;
  }

  function addMaskedValueToInputProperties(inputProperties) {
    const trim = 5000;
    Object.values(inputProperties).forEach((property) => {
      if (property.example.length > trim) {
        property.maskedValue = `${property.example.slice(0, trim)}
          ...(${property.example.length - trim} characters been clipped)`;
      }
    });
  }

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

  function rawInputPropertiesToJsonString(inputProperties) {
    /** Ignores masked value and empty value */
    const jsonInput = {};
    Object.keys(inputProperties).forEach((propertyKey) => {
      let property = inputProperties[propertyKey];
      let key = property.name || property['x-name'] || propertyKey;
      let value = property.example;
      if (value) {
        Object.assign(jsonInput, {
          [key]: modifyValueByType(value, property.type),
        });
      }
    });

    return JSON.stringify(jsonInput);
  }

  function rawInputPropertiesToDataForm(inputProperties) {
    var data = new FormData();

    Object.keys(inputProperties).forEach((propertyKey) => {
      let property = inputProperties[propertyKey];
      let key = property.name || property['x-name'] || propertyKey;
      let value = property.example;
      if (value) {
        data.append(`${key}`, value);
      }
    });

    return data;
  }

  function modifyValueByType(value, type) {
    let modifiedValue = value;
    switch (type) {
      case 'array':
        typeof value !== 'object' ? (modifiedValue = JSON.parse(value)) : null;
        break;

      default:
        break;
    }
    return modifiedValue;
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
    let reverseFormattedStr = jsonString.replace(/\n/g, '');

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

  function getContentType(docRef) {
    const doc = docRef.value ?? docRef;
    console.log(doc);
    const contentType = Object.keys(
      Object.values(Object.values(doc.paths)[0])[0].requestBody.content
    )[0];
    return contentType;
  }

  function makePostApiCall() {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      const contentType = getContentType(userDocRef);

      xhr.open('POST', getEndPoint(userDocRef));

      xhr.onreadystatechange = function () {
        if (this.readyState === this.DONE) {
          apiResponse.status = xhr.status.toString();
          apiResponse.statusText = xhr.statusText;
          apiResponse.response = JSON.parse(xhr.response);
          console.log(xhr);
          resolve(xhr.response);
        }
      };

      xhr.setRequestHeader('x-api-key', apiKey.value);

      if (contentType === 'multipart/form-data') {
        xhr.send(rawInputPropertiesToDataForm(getInputProperties(userDocRef)));
      } else {
        /**
         * For multipart/form-data, DO NOT set the Request Header, else will
         * keep getting error. Refer to :
         * https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects
         * Middle of the page, there is a warning message
         */
        xhr.setRequestHeader('Content-Type', contentType);
        xhr.send(
          rawInputPropertiesToJsonString(getInputProperties(userDocRef))
        );
      }

      console.log(
        rawInputPropertiesToDataForm(getInputProperties(userDocRef)).get(
          'filePath'
        )
      );
    });
  }

  function makeGetApiCall() {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open(
        'GET',
        getEndPoint(userDocRef) +
          parseInputPropertiesToQueryStr(getInputProperties(userDocRef))
      );

      xhr.onreadystatechange = function () {
        if (this.readyState === this.DONE) {
          apiResponse.status = xhr.status.toString();
          apiResponse.statusText = xhr.statusText;
          apiResponse.response = JSON.parse(xhr.response);
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
    console.log(exampleValue);
    try {
      switch (inputProperty.type) {
        case 'float':
          inputProperty.example = parseFloat(exampleValue);
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
  };
};

export { tryItOutService };
