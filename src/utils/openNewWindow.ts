import mime from "mime";

export const isImage = (path: string) => {
  return mime.getType(path)?.startsWith("image") ?? false;
};
