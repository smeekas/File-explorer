import { DirInfo } from "../src/types/analysis.types";
// import fss from "fs";
import fs from "fs/promises";
import { parentPort } from "worker_threads";
import path from "path";
import mime from "mime";
const result: DirInfo = {
  images: 0,
  other: 0,
  pdf: 0,
  text: 0,
  videos: 0,
  size: 0,
};
const reset = () => {
  result.images = 0;
  result.other = 0;
  result.pdf = 0;
  result.text = 0;
  result.videos = 0;
  result.size = 0;
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
      const fileInfo = await fs.lstat(path.join(dirPath, child.name));
      result.size += fileInfo.size;
    } else if (!child.isSymbolicLink() && child.isDirectory()) {
      await processDirectory(path.join(dirPath, child.name));
    } else {
      result.other++;
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

parentPort?.on("message", async (e) => {
  reset();

  const len = e.dirPaths.length;
  const workerIndex = e.id;
  const totalWorker = e.threads;
  const perWorkerDirs = +Math.floor(len / totalWorker).toFixed(0);
  if (perWorkerDirs > 0) {
    const startIndex =
      workerIndex == e.threads - 1
        ? workerIndex * perWorkerDirs
        : workerIndex * perWorkerDirs;
    const endIndex =
      workerIndex == e.threads - 1 ? len - 1 : startIndex + perWorkerDirs - 1;
    startIteration(e.dirPaths, startIndex, endIndex)
      .then(() => {
        parentPort?.postMessage({ result, id: e.id });
      })
      .catch((err) => {
        // console.log(err);
        parentPort?.postMessage({ err });
      });
  } else {
    // console.log(perWorkerDirs);
    const startIndex = workerIndex;
    const endIndex = workerIndex;
    // console.log(e.id, startIndex, endIndex, perWorkerDirs, totalWorker, len);
    if (workerIndex >= len) {
      parentPort?.postMessage({ result, id: e.id });
    } else {
      startIteration(e.dirPaths, startIndex, endIndex)
        .then(() => {
          parentPort?.postMessage({ result, id: e.id });
        })
        .catch((err) => {
          // console.log(err);
          parentPort?.postMessage({ err });
        });
    }
  }
});
