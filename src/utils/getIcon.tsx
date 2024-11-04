import mime from "mime";
import FolderIcon from "../icons/FolderIcon";
import ImageIcon from "../icons/ImageIcon";
import VideoIcon from "../icons/VideoIcon";
import AudioIcon from "../icons/AudioIcon";
import PdfIcon from "../icons/PdfIcon";
import CompressedIcon from "../icons/CompressedIcon";
import FileIcon from "../icons/FileIcon";
import TextIcon from "../icons/TextIcon";

export const getIcon = (path: string, isFile: boolean) => {
  if (!isFile) {
    return <FolderIcon />;
  } else {
    const type = mime.getType(path);
    const isImage = type?.startsWith("image");
    const isVideo = type?.startsWith("video");
    const isAudio = type?.startsWith("audio");
    const isPdf = type == "application/pdf";
    const isText = type?.startsWith("text");

    const isCompressed =
      type === "application/vnd.rar" ||
      type === "application/x-rar-compressed" ||
      type === "application/octet-stream" ||
      type === "application/zip" ||
      type === "application/x-zip-compressed" ||
      type === "multipart/x-zip";
    if (isImage) return <ImageIcon />;
    if (isVideo) return <VideoIcon />;
    if (isAudio) return <AudioIcon />;
    if (isPdf) return <PdfIcon />;
    if (isCompressed) return <CompressedIcon />;
    if (isText) return <TextIcon />;
    return <FileIcon />;
  }
};
