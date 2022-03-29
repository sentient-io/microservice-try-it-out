const checkers = () => {
  const isInIframe = window.location !== window.parent.location;

  function isLargeFile(doc) {
    /**
     * Created 2022 Feb. we'll check if there are more than one endpoint
     * if there are multiple endpoints,  we consider it as large payload
     */
    let paths = [];
    if (doc.value.paths) {
      paths = Object.keys(doc.value.paths);
    }
    return paths.length > 1;
  }
  return { isLargeFile, isInIframe };
};

export { checkers };
