// import { inputPropertyInterface, docInterface } from './TryItOut_types';
// import { Ref } from 'vue';

// import { tryItOutService } from 'src/services/TryItOut/TryItOut_service';

const dataFormatter = () => {
  function addMaskedValueToInputProperties(inputProperties) {
    const trim = 5000;
    Object.values(inputProperties).forEach((property) => {
      if (property.example.length > trim) {
        property.maskedValue = `${property.example.slice(0, trim)}
          ...(${property.example.length - trim} characters been clipped)`;
      }
    });
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

  function getInputProperties(apiDocRef) {
    // const { docClass } = tryItOutService();
    const apiDoc = apiDocRef.value ?? apiDocRef;
    let inputProperties = '';
    try {
      inputProperties = apiDoc.components.schemas.input.properties;
      // inputProperties = docClass.value.getInputProperties();
      addMaskedValueToInputProperties(inputProperties);
    } catch (err) {
      // console.log(err);
    }

    try {
      inputProperties = Object.values(apiDoc.paths)[0].get.parameters;
    } catch (err) {
      // console.log(err);
    }
    return inputProperties;
  }

  function rawInputPropertiesToDataForm(inputProperties) {
    const data = new FormData();

    Object.keys(inputProperties).forEach((propertyKey) => {
      const property = inputProperties[propertyKey];
      const key = property.name || property['x-name'] || propertyKey;
      const value = property.example;
      if (value) {
        data.append(`${key}`, value);
      }
    });

    return data;
  }

  function validValue(value) {
    /**
     * Validate value, because the value can be multiple type
     * for each type need to treate differentely.
     */
    if (value) return true;
    if (value === 0) return true;
    if (typeof value === 'boolean') return true;
    return false;
  }

  function rawInputPropertiesToJsonString(inputProperties) {
    /** Ignores masked value and empty value */

    const jsonInput = {};
    Object.keys(inputProperties).forEach((propertyKey) => {
      const property = inputProperties[propertyKey];
      const key = property.name || property['x-name'] || propertyKey;
      const value = property.example;
      console.log('*** test ***');
      console.log(key, property.type);
      console.log('*** end test ***');
      if (validValue(value)) {
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
