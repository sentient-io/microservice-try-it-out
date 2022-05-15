class DocClass {
  constructor(doc) {
    this.userDoc = JSON.parse(JSON.stringify(doc));
    this.rawDoc = JSON.parse(JSON.stringify(doc));
    this.url = doc.servers[0].url;
  }

  /**
   * Any method ends with Doc mearning extract raw data from the doc
   * Any method ends with Obj mearning extract processed data
   */

  get$ref(refStr) {
    const refArr = refStr.split('/');
    let result = this.userDoc;
    refArr.forEach((key) => {
      // Not very sure what is the #, ignoring it for now
      if (key === '#') return;
      result = result[key];
    });
    return result;
  }

  set$ref(refStr, newVal) {
    const refArr = refStr.split('/');
    let result = this.userDoc;
    result;
    newVal;
    console.log(refArr);
    // refArr.forEach((key) => {
    //   // Not very sure what is the #, ignoring it for now
    //   if (key === '#') return;
    //   result = result[key];
    // });
    // return result;
  }

  searchSchema$ref(schemaRef) {
    let schema;
    if (schemaRef.$ref) {
      schema = this.get$ref(schemaRef.$ref);
    } else {
      schema = schemaRef;
    }
    return schema;
  }

  findRequestBodyDoc(INDICATOR) {
    const path = this.findPath(INDICATOR);
    console.log(path);
    const method = this.findMethodByPath(path);
    const requestBody = method.requestBody;

    return requestBody;
  }

  findContentType(INDICATOR) {
    let contentType;
    const path = this.findPath(INDICATOR);
    const methodVerb = this.findMethodVerbByPath(path);

    if (methodVerb == 'get') {
      contentType = 'query';
    }

    if (methodVerb == 'post') {
      const method = this.findMethodByPath(path);
      const requestBody = method.requestBody;
      contentType = Object.keys(requestBody.content)[0];
    }

    return contentType;
  }

  findEndpoint(INDICATOR) {
    const path = this.findPath(INDICATOR);
    const method = this.findMethodByPath(path);
    // If there is no server override, return normal endpoint
    let endpoint = this.url + path;
    if (method?.servers?.[0]?.url) {
      // For server override, return the override endpoint
      endpoint = method.servers[0].url;
    }
    return endpoint;
  }

  findPath(INDICATOR) {
    let path;
    if (INDICATOR) {
      path = Object.keys(this.userDoc.paths).find((k) => k.includes(INDICATOR));
    } else {
      // If no indicator provided, return the first path
      path = Object.keys(this.userDoc.paths)[0];
    }
    return path;
  }

  findPaths() {
    const paths = Object.keys(this.rawDoc.paths);
    return paths;
  }

  findPathObj(INDICATOR) {
    let path;
    if (INDICATOR) {
      path = Object.keys(this.userDoc.paths).find((k) => k.includes(INDICATOR));
    } else {
      // If no indicator provided, return the first path
      path = Object.keys(this.userDoc.paths)[0];
    }
    return this.userDoc.paths[path];
  }

  findRequestBodySchema(INDICATOR = null) {
    const requestBody = this.findRequestBodyDoc(INDICATOR);
    const contentType = this.findContentType(INDICATOR);
    const schemaRef = requestBody.content[contentType].schema;

    let schema;
    if (schemaRef.$ref) {
      schema = this.get$ref(schemaRef.$ref);
    } else {
      schema = schemaRef;
    }
    return schema;
  }

  setRequestBodySchema(INDICATOR, newSchema) {
    const contentType = this.findContentType(INDICATOR);
    const requestBody = this.findRequestBodyDoc(INDICATOR);
    const schemaRef = requestBody.content[contentType].schema;
    this.set$ref(schemaRef.$ref, newSchema);
  }

  getRequestBodyPropertiesBy(INDICATOR) {
    const path = this.findPath(INDICATOR);
    const methodVerb = this.findMethodVerbByPath(path);

    if (methodVerb == 'post') {
      const schema = this.findRequestBodySchema(INDICATOR);
      const properties = this.maskExampleLongStrings(schema.properties);
      return properties;
    }

    if (methodVerb == 'get') {
      const pathObj = this.findPathObj(INDICATOR);
      return pathObj.get.parameters;
    }
  }

  maskExampleLongStrings(propertries) {
    const TRIM = 5000;
    Object.values(propertries).forEach((property) => {
      if (property.example && property.example.length > TRIM) {
        property.maskedValue = `${property.example.slice(0, TRIM)}
          ...(${property.example.length - TRIM} characters been clipped)`;
      }
    });
    return propertries;
  }

  getRequestBodyObjBy(INDICATOR) {
    const requestBodyObj = {};
    const properties = this.getRequestBodyPropertiesBy(INDICATOR);
    for (const [key, value] of Object.entries(properties)) {
      requestBodyObj[key] = value.example;
    }
    return requestBodyObj;
  }

  findMethodByPath(path) {
    const methodVerb = this.findMethodVerbByPath(path);
    const method = this.userDoc.paths[path][methodVerb];
    return method;
  }

  findMethodVerbByPath(_path) {
    /**
     * !!Assuming only one method under each endpoint.
     * !!Assuming either post and get methods
     */
    let path = '';

    if (_path) {
      path = _path;
    } else {
      path = this.findPath(null);
    }

    const isPost = Object.keys(this.userDoc.paths[path]).includes('post');
    if (isPost) return 'post';
    return 'get';
  }

  resetUserDoc() {
    this.userDoc = JSON.parse(JSON.stringify(this.rawDoc));
  }

  isSingleEndpoint() {
    if (!this.isValidOpenApiDoc()) return false;

    const endpoints = Object.keys(this.userDoc.paths);
    if (endpoints.length != 1) {
      return false;
    }
    return true;
  }

  isSentientLargeFile() {
    if (!this.isValidOpenApiDoc()) return false;

    const paths = this.findPaths();
    /**
     * !IMPORTANT! Assuming all large files microservice
     * !will have and only have 3 end points.
     * */
    if (paths.length !== 3) return false;

    /**
     * !IMPORTANT! Assuming the 3 endpoints matches
     * !below INDICATORS exactly
     * */
    const INDICATORS = ['getuploadurl', 'getstatus', 'upload'];
    paths.forEach((path) => {
      const containsIndicator = INDICATORS.some((INDICATOR) => {
        path.includes(INDICATOR);
      });
      if (!containsIndicator) {
        return false;
      }
    });

    return true;
  }

  getUserDoc(){
    return this.userDoc
  }

  isValidOpenApiDoc() {
    if (!this.userDoc.openapi) {
      return false;
    }
    return true;
  }
}

export default DocClass;
