import { DirInfo } from "../src/types/analysis.types";
import { parentPort } from "worker_threads";
import path from "path";
import getFileType from "../src/utils/getFileType";
import combineTwo from "../src/utils/combineTwo";
import { getDirsWithReadAccess, isDirectory } from "./electronUtils";
const result: DirInfo = {
  images: 0,
  other: 0,
  pdf: 0,
  text: 0,
  videos: 0,
  size: 0,
  application: 0,
  audio: 0,
  compressed: 0,
};
const reset = () => {
  Object.keys(result).forEach(
    (keyItem) => (result[keyItem as keyof DirInfo] = 0)
  );
};
const processDirectory = async (dirPath: string) => {
  const dirInfo = await getDirsWithReadAccess(dirPath);
  for (const child of dirInfo) {
    if (child.isFile()) {
      combineTwo(result, getFileType(path.join(dirPath, child.name)));
    } else if (isDirectory(child)) {
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
