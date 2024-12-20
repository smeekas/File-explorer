import { DirInfo } from "../types/analysis.types";
// import fss from "fs";
import fs from "fs/promises";

import path from "path";
import combineTwo from "./combineTwo";
import getFileType from "./getFileType";
const result: DirInfo = {
  images: 0,
  other: 0,
  pdf: 0,
  text: 0,
  videos: 0,
  application: 0,
  audio: 0,
  compressed: 0,
  size: 0,
};
const reset = () => {
  Object.keys(result).forEach((resetKeys) => {
    if (resetKeys in result) {
      result[resetKeys as keyof DirInfo] = 0;
    }
  });
};
const processDirectory = async (dirPath: string) => {
  const dirInfo = await fs.readdir(dirPath, { withFileTypes: true });
  for (const child of dirInfo) {
    if (child.isFile()) {
      combineTwo(result, getFileType(path.join(child.path, child.name)));
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
