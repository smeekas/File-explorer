import { DirInfo } from "../types/analysis.types";
// import fss from "fs";
import fs from "fs/promises";

import path from "path";
import mime from "mime";
const result: DirInfo = {
  images: 0,
  other: 0,
  pdf: 0,
  text: 0,
  videos: 0,
};
const reset = () => {
  result.images = 0;
  result.other = 0;
  result.pdf = 0;
  result.text = 0;
  result.videos = 0;
};
const processDirectory = async (dirPath: string) => {
  const dirInfo = await fs.readdir(dirPath, { withFileTypes: true });
  for (const child of dirInfo) {
    if (child.isFile()) {
      const type = mime.getType(path.join(dirPath, child.name));
      const isImage = type?.startsWith("image");
      const isVideo = type?.startsWith("video");
      const isPdf = type == "application/pdf";
      const isText = type?.startsWith("text");
      if (isImage) result.images++;
      else if (isVideo) result.videos++;
      else if (isPdf) result.pdf++;
      else if (isText) result.text++;
      else result.other++;
    } else {
      await processDirectory(path.join(dirPath, child.name));
    }
  }
};
const startIteration = async (
  paths: string[],
  startIndex: number,
  endIndex: number
) => {
  for (let i = startIndex; i <= endIndex; i++) {
    await processDirectory(paths[i]);
  }
};

self.onmessage = async (e) => {
  reset();
  const len = e.data.dirPaths.length;
  const workerIndex = e.data.id;
  const totalWorker = e.data.threads;
  const perWorkerDirs = +Math.floor(len / totalWorker).toFixed(0);
  if (perWorkerDirs > 0) {
    const startIndex =
      workerIndex == e.data.threads - 1
        ? workerIndex * perWorkerDirs
        : workerIndex * perWorkerDirs;
    const endIndex =
      workerIndex == e.data.threads - 1
        ? e.data.threads - 1
        : startIndex + perWorkerDirs - 1;
    startIteration(e.data.dirPaths, startIndex, endIndex)
      .then(() => {
        self.postMessage({ result, id: e.data.id });
      })
      .catch((err) => {
        self.postMessage({ err });
      });
  } else {
    const startIndex = workerIndex;
    const endIndex = workerIndex;
    if (workerIndex >= e.data.threads) {
      self.postMessage({ result, id: e.data.id });
    } else {
      startIteration(e.data.dirPaths, startIndex, endIndex)
        .then(() => {
          self.postMessage({ result, id: e.data.id });
        })
        .catch((err) => {
          self.postMessage({ err });
        });
    }
  }
};
