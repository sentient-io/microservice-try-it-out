/**
 * This helper perform frequent formatting functions to modify
 * yaml documentation, e.g. get the $ref value
 */

function get$ref(doc, ref) {
  /**
   * Find the value of $ref in yaml file
   */
  let result = doc;
  const refArr = ref.split('/');
  refArr.forEach((key) => {
    // Not very sure what is the #, ignoring it for now
    if (key === '#') return;
    result = result[key];
  });
  return result;
}

export default () => {
  return { get$ref };
};
