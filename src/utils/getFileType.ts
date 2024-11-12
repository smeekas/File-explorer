import { DirInfo } from "../types/analysis.types";
import fs from "fs";
import {
  applicationExtensions,
  audioExtensions,
  compressedExtensions,
  imageExtensions,
  textExtensions,
  videoExtensions,
} from "./fileExts";

function getFileType(path: string): DirInfo {
  const ext = path.split(".").pop();

  const result: DirInfo = {
    pdf: 0,
    compressed: 0,
    images: 0,
    videos: 0,
    audio: 0,
    application: 0,
    text: 0,
    other: 0,
    size: 0,
  };
  if (ext == undefined) result.other++;
  else if (ext === "pdf") result.pdf++;
  else if (compressedExtensions.has(ext)) result.compressed++;
  else if (imageExtensions.has(ext)) result.images++;
  else if (videoExtensions.has(ext)) result.videos++;
  else if (audioExtensions.has(ext)) result.audio++;
  else if (applicationExtensions.has(ext)) result.application++;
  else if (textExtensions.has(ext)) result.text++;
  else result.other++;
  result.size += fs.statSync(path).size;
  return result;
}

export default getFileType;
