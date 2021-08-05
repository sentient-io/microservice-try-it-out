export default {
  layoutHeader: {
    title: 'API Documentation',
    lang: 'EN',
  },

  /** Below for Try It Out section */
  tryItOut: {
    header: 'Try It Out',

    description: `You can test the input / output of Sentient.io API 
    with the tool we provided below. Simply input your subscribed 
    API key, and you’ll be able to test the input with the fields and 
    check the output below.`,

    apiKey: 'API Key',

    beforeYouStart: `Before you start, please make sure you have subscribed 
    this microservice, and paste your api key in the field below.`,

    apiKeyTooltip: `To find your API key, log in to <a class='s-link' href='https://platform.sentient.io' target="_blank">Sentient.io Platform</a>, check if you
    have subscribe this microservice. If you already subscribed the microservice, you api 
    key will be at top section of the miroservice page.`,

    apiKeyErrMsg: 'Please input your API key before continue',

    goToMicroservicePage: 'Sentient.io Platform',

    resetUserInput: 'Reset All Inputs',

    fieldsInput: 'Fields Input',
    queryStringInput: 'Query String Input',
    jsonDataInput: 'JSON Data Input',

    parsedResponse: 'Parsed Response',
    rawResponse: 'Raw Response',

    inputWith: 'Input with:',

    doesNotRequireInput: `This API doesn't require inputs. You can click "Make API Call" button to
    continue.`,

    editJsonDataInput: 'Edit your input data in JSON format:',

    editQueryInput:
      'Edit query string in JSON format and preview the URL friendly query string:',

    queryString: 'Parsed query string preview:',

    displayAs: 'Display as:',

    endPoint: 'Endpoint:',

    response: {
      parsedResponse: {
        description: `For your convenience, we have processed the api response. There are many
      other different ways to process the result, here we just demo several
      possibilities about what possibly can be done.`,
      },
      rawResponse: {
        description:
          'Here is the original response from the Try Out api call you just made.',
      },
    },
  },

  /** All generic terms been used */
  terms: {
    response_code: 'Response Code',
    description: 'Description',
  },
};
