/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

const tryOutResService = () => {
  function processResponse(response) {
    let processedResponse = toObject(response);
    if (processedResponse.response) {
      processedResponse = toObject(processedResponse.response);
    }
    if (processedResponse.results) {
      processedResponse = toObject(processedResponse.results);
    }
    return processedResponse;
  }

  return { processResponse };
};

export { tryOutResService };

function toObject(someValue) {
  let theObject = someValue;
  if (typeof someValue !== 'object') {
    try {
      theObject = JSON.parse(someValue);
      if (typeof theObject === 'number') {
        /** Force non-object-alike number to object */
        theObject = { '': someValue };
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        /** Force non-object-alike string to object */
        theObject = { '': someValue };
      }
    }
  }

  return theObject;
}
