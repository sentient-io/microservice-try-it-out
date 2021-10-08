/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { inputPropertyInterface, docInterface } from './TryItOut_types';
import { Ref } from 'vue';

const dataFormatter = () => {
  function addMaskedValueToInputProperties(
    inputProperties: inputPropertyInterface
  ) {
    const trim = 5000;
    Object.values(inputProperties).forEach((property: any) => {
      if (property.example.length > trim) {
        property.maskedValue = `${property.example.slice(0, trim)}
          ...(${property.example.length - trim} characters been clipped)`;
      }
    });
  }

  function modifyValueByType(value: any, type: string) {
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

  function getInputProperties(apiDocRef: Ref<docInterface>) {
    const apiDoc: docInterface = apiDocRef.value ?? apiDocRef;
    let inputProperties: any = '';
    try {
      inputProperties = apiDoc.components.schemas.input.properties;
      addMaskedValueToInputProperties(inputProperties);
    } catch (err) {}
    try {
      inputProperties = Object.values(apiDoc.paths)[0].get.parameters;
    } catch (err) {}
    return inputProperties;
  }

  function rawInputPropertiesToDataForm(
    inputProperties: inputPropertyInterface
  ) {
    const data: FormData = new FormData();

    Object.keys(inputProperties).forEach((propertyKey) => {
      const property: any = inputProperties[propertyKey];
      const key = property.name || property['x-name'] || propertyKey;
      const value = property.example;
      if (value) {
        data.append(`${key}`, value);
      }
    });

    return data;
  }

  function rawInputPropertiesToJsonString(
    inputProperties: inputPropertyInterface
  ) {
    /** Ignores masked value and empty value */

    const jsonInput = {};
    Object.keys(inputProperties).forEach((propertyKey) => {
      const property: any = inputProperties[propertyKey];
      const key = property.name || property['x-name'] || propertyKey;
      const value = property.example;
      console.log(key, value);
      if (value || value === 0) {
        Object.assign(jsonInput, {
          [key]: modifyValueByType(value, property.type),
        });
      }
    });
    return JSON.stringify(jsonInput);
  }

  return {
    getInputProperties,
    rawInputPropertiesToDataForm,
    rawInputPropertiesToJsonString,
    addMaskedValueToInputProperties,
  };
};

export { dataFormatter };
