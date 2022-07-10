const base64UriHeaderRe = new RegExp("data:([a-zA-Z]*)/([a-zA-Z]*);base64,");
const base64Re = new RegExp(
  "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"
);

const deepCopy = (obj) => {
  // console.log(obj);
  /**
   * To remive the trialing line break at end of a string.
   * !! This may cause some error
   */
  const copy = JSON.parse(JSON.stringify(obj).replace(/\\n\"/g, '"'));
  // console.log(copy);
  return copy;
};

const isBase64 = (str) => {
  let strIsBase64 = false;
  if (str == null) return false;
  if (str.length === 0) return false;
  // console.log("isBase64", base64Re.test(str), str);
  if (base64Re.test(str) && str.length > 500) {
    strIsBase64 = true;
  }
  if (base64Re.test(str) && str.length < 500) {
    console.warn(
      `Detected base64-alike string - ${str}, \n But length of string is sort, doesn't seems like base64 media string, will not parse it for pretty response.`
    );
  }
  return strIsBase64;
};

const hasUriHeader = (str) => {
  return base64UriHeaderRe.test(str);
};

const getUriHeader = (str) => {
  if (base64UriHeaderRe.test(str)) {
    return str.match(base64UriHeaderRe)[0];
  } else {
    return null;
  }
};

const getMediaTypeFromUriHeader = (uriHeader) => {
  try {
    return uriHeader.match(base64UriHeaderRe)[1];
  } catch (err) {
    console.err("Invalid base64 media uri header.");
    console.error(err);
  }
};

export {
  deepCopy,
  isBase64,
  hasUriHeader,
  getUriHeader,
  getMediaTypeFromUriHeader,
};
