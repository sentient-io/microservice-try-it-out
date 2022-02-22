export default () => {
  function getFileDetail(fileObj) {
    // Get details fron the file object
    const fileName = fileObj.name;
    const fileSize = fileObj.size;
    const contentType = fileObj.type;
    return { fileName, fileSize, contentType };
  }
  return { getFileDetail };
};
