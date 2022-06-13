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
  const re = new RegExp(
    "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"
  );
  return re.test(str);
};

export { deepCopy, isBase64 };
