import FolderIcon from "../icons/FolderIcon";
import ImageIcon from "../icons/ImageIcon";
import VideoIcon from "../icons/VideoIcon";
import AudioIcon from "../icons/AudioIcon";
import PdfIcon from "../icons/PdfIcon";
import CompressedIcon from "../icons/CompressedIcon";
import FileIcon from "../icons/FileIcon";
import TextIcon from "../icons/TextIcon";
import {
  audioExtensions,
  compressedExtensions,
  imageExtensions,
  textExtensions,
  videoExtensions,
} from "./fileExts";

export const getIcon = (path: string, isFile: boolean) => {
  if (!isFile) {
    return <FolderIcon />;
  } else {
    const ext = path.split(".").pop();
    if (!ext) return <FileIcon />;
    const isImage = imageExtensions.has(ext);
    const isVideo = videoExtensions.has(ext);
    const isAudio = audioExtensions.has(ext);
    const isPdf = ext == "pdf";
    const isText = textExtensions.has(ext);

    const isCompressed = compressedExtensions.has(ext);
    if (isImage) return <ImageIcon />;
    if (isVideo) return <VideoIcon />;
    if (isAudio) return <AudioIcon />;
    if (isPdf) return <PdfIcon />;
    if (isCompressed) return <CompressedIcon />;
    if (isText) return <TextIcon />;
    return <FileIcon />;
  }
};
