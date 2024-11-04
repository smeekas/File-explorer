export const getFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} Bytes`;
  }
  size /= 1000;
  if (size < 1000) {
    return `${size.toFixed(2)} KB`;
  }
  size /= 1000;
  if (size < 1000) {
    return `${size.toFixed(2)} MB`;
  }
  size /= 1000;
  if (size < 1000) {
    return `${size.toFixed(2)} GB`;
  }
  return 0;
};
