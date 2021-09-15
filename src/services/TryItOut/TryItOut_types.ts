export interface tryItOutServiceInterface {
  validApiDoc: boolean;
}

export interface inputPropertiesInterface {
  [key: string]: inputPropertyInterface;
}

export interface schemaInterface {
  type: string;
}

export interface inputPropertyInterface {
  [key: string]: string | number | schemaInterface;
  type: string;
  example: string | number;
  maskedValue: string;
  name: string;
  ['x-name']: string;
  schema: schemaInterface;
}

export interface docInterface {
  // Ignore the poor typing for this doc interface, for now just clear all the warning messages
  servers: [{ url: string }];
  paths: {
    [key: string]: {
      post: {
        tags: [];
        requestBody: { content: { [key: string]: { schema: string } } };
      };
      get: {
        parameters: inputPropertyInterface;
        requestBody: { content: { [key: string]: { schema: string } } };
      };
    };
  };
  components: { schemas: { input: { properties: string; required: [] } } };
}

export interface apiResponseInterface {
  status: string;
  statusDescription: string;
  response: unknown;
}
