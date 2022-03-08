class DocClass {
  constructor(doc) {
    this.userDoc = doc;
    this.rawDoc = doc;
    this.url = doc.servers[0].url;
    console.log(this.rawDoc);
  }

  get$ref(refStr) {
    const refArr = refStr.split('/');
    let result = this.rawDoc;
    refArr.forEach((key) => {
      // Not very sure what is the #, ignoring it for now
      if (key === '#') return;
      result = result[key];
    });
    return result;
  }

  findRequestBody(INDICATOR) {
    const path = this.findPath(INDICATOR);
    const method = this.findMethodByPath(path);
    const requestBody = method.requestBody;
    const contentType = Object.keys(requestBody.content)[0];
    const schemaRef = requestBody.content[contentType].schema;

    if (schemaRef.$ref) {
      return this.get$ref(schemaRef.$ref);
    }
    return schemaRef;
  }

  findContentType(INDICATOR) {
    const path = this.findPath(INDICATOR);
    const method = this.findMethodByPath(path);
    const requestBody = method.requestBody;
    const contentType = Object.keys(requestBody.content)[0];
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
    const path = Object.keys(this.rawDoc.paths).find((k) =>
      k.includes(INDICATOR)
    );
    return path;
  }

  findMethodByPath(path) {
    const methodVerb = this.findMethodVerbByPath(path);
    const method = this.rawDoc.paths[path][methodVerb];
    return method;
  }

  findMethodVerbByPath(path) {
    /**
     * !!Assuming only one method under each endpoint.
     * !!Assuming only post and get methods
     */
    const isPost = Object.keys(this.rawDoc.paths[path]).includes('post');
    if (isPost) return 'post';
    return 'get';
  }
}

export default DocClass;
