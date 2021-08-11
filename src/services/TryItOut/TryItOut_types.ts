export interface tryItOutServiceInterface {
  validApiDoc: boolean;
}

export interface inputPropertiesInterface {
  [key: string]: inputPropertyInterface;
}

export interface inputPropertyInterface {
  type: string;
  example: string | number;
  maskedValue: string;
  name: string;
  ['x-name']: string;
  schema: {
    type: string;
  };
}

export interface docInterface {
  servers: [{ url: string }];
  paths: {
    [key: string]: {
      post: {
        tags: [];
        requestBody: { content: { [key: string]: { schema: string } } };
      };
      get: { parameters: inputPropertyInterface };
    };
  };
  components: { schemas: { input: { properties: string; required: [] } } };
}

export interface apiResponseInterface {
  status: string;
  statusText: string;
  response: unknown;
}
