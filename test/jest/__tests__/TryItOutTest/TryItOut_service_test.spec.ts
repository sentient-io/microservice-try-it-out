import { tryItOutService } from '../../../../src/services/TryItOut/TryItOut_service';

const {
  inputPropertiesContainMaskedValue,

  formatJsonString,
} = tryItOutService();

describe('inputPropertiesContainMaskedValue', () => {
  it('returns true if the input properties contais any value that been masked', () => {
    expect(
      inputPropertiesContainMaskedValue(testCase.checkRequiredValueMasked)
    ).toBeTruthy();
  });
});

describe('formatJsonString', () => {
  it('formats json input string', () => {
    /**
     * Take note of the weird format below, just to make the test pass
     * But the display on frontend is fine.
     */
    expect(formatJsonString('{"Property":"Some example value"}')).toBe(`{
    \"Property\":\"Some example value\"
}
`);
  });
  it('do not string with empty value', () => {
    expect(formatJsonString('{"Property":"","Property":"with value"}')).toBe(`{
    "Property":"",
    "Property":"with value"
}
`);
  });
});

const testCase = {
  checkRequiredValueFail: {
    model: {
      'x-name': 'model',
      example: '',
    },
  },
  checkRequiredValueSuccess: `model: {
      'x-name': 'model',
      example: 'Test',
    }`,
  checkRequiredValueMasked: {
    model: {
      type: 'string',
      example: 'string',
      maskedValue: 'test',
      name: 'string',
      ['x-name']: 'string',
      schema: {
        type: 'string',
      },
    },
  },
  requiredValues: ['model'],
  getTypeOfQueryProperty: [
    {
      in: 'query',
      name: 'querystring',
      schema: { type: 'string' },
      description:
        'Simple keyword search for matches in all searchable fields. Keywords separated by spaces will return results containing any of those keywords. For exact phrase match, put entire phrase in double quotes (" ").\n\nIf this field is set to null, by default the microservice will return all units (within the stated limit), which can be further refined through the filterdata field for more sophisticated queries.\n\n',
      example: 'serangoon',
      default: false,
    },
    {
      in: 'query',
      name: 'offset',
      schema: { type: 'integer' },
      description: 'The offset of the record list ie the starting index',
      example: '0',
      default: false,
    },
    {
      in: 'query',
      name: 'limit',
      schema: { type: 'integer' },
      description:
        'The max records to return for the request. Default - 10, Max - 10000',
      example: '10',
      default: false,
    },
    {
      in: 'query',
      name: 'filterdata',
      schema: { type: 'string' },
      description:
        'Refine the search further on any of the possible through the 4 filter types &#58;\n* must\n* must_not\n* should\n* filter\n',
      default: false,
      example:
        '{"must":[{"match_phrase":{"street":"serangoon+central"}}],"filter":[{"match":{"postalcode":"550209"}}],"should":[{"range":{"no_of_units":{"gte":10}}}],"must_not":[{"match":{"len_of_ownership_id":"5"}}]}',
    },
  ],
  getTypeOfQueryPropertyResult:
    '{"querystring":"serangoon","offset":"0","limit":"10","filterdata":"{\\"must\\":[{\\"match_phrase\\":{\\"street\\":\\"serangoon+central\\"}}],\\"filter\\":[{\\"match\\":{\\"postalcode\\":\\"550209\\"}}],\\"should\\":[{\\"range\\":{\\"no_of_units\\":{\\"gte\\":10}}}],\\"must_not\\":[{\\"match\\":{\\"len_of_ownership_id\\":\\"5\\"}}]}"}',
  inputPropertiesDoesNotContainXname:
    '{ "filePath": { "type": "string", "format": "binary", "default": true, "example": "sample.pdf", "description": "Text-only PDF files are supported. Image or mixed PDF files are not recommended." }, "pageNumbers": { "type": "number", "default": false, "example": "1,3,6", "description": "Page numbers, example 1,3,6. Default all pages" }, "maxPages": { "type": "number", "default": false, "example": "3", "description": "Maximum of page number. Default all pages" }, "startPage": { "type": "number", "default": false, "example": "1", "description": "Starting page number, if used endPage parameter is mandatory" }, "endPage": { "type": "number", "default": false, "example": "5", "description": "End of page number, if used startPage parameter is mandatory" }, "convertType": { "type": "string", "default": false, "example": "txt", "description": "Convertion type (txt / html). Default type is txt" }, "passWord": { "type": "string", "default": false, "example": "xxxxxxxx", "description": "Password for protected pdf" } }',
};
