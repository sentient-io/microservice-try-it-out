export default () => {
  /**
   * Loop through each element in the object, if any string longer than the
   * clipAt valie, clip the string and return the processed JSON object.
   * @param {JSON} jsonObj
   * @param {Object} options
   * @returns JSON Object
   */
  const clipLongStringInJsonObj = (jsonObj, options = { clipAt: 1000 }) => {
    const clippedJsonObj = {};
    const clipAt = options.clipAt;
    Object.keys(jsonObj).forEach((key) => {
      const val = jsonObj[key];
      let clippedVal;
      if (typeof val === 'string' && val.length > clipAt) {
        clippedVal = `${val.slice(0, clipAt)}...(${
          val.length - clipAt
        } characters been clipped)`;
      } else {
        clippedVal = val;
      }
      clippedJsonObj[key] = clippedVal;
    });
    return clippedJsonObj;
  };

  const isContainsLongString = (jsonObj, options = { limit: 1000 }) => {
    let containsLongString = false;
    const limit = options.limit;
    Object.values(jsonObj).forEach((val) => {
      if (typeof val === 'string' && val.length > limit)
        containsLongString = true;
    });
    return containsLongString;
  };

  return { clipLongStringInJsonObj, isContainsLongString };
};
