import { DirInfo } from "../types/analysis.types";

function combineTwo(curr: DirInfo, newResult: DirInfo) {
  const allKeys = Object.keys(curr);
  for (const key of allKeys) {
    const newKey = key as keyof DirInfo;
    curr[newKey] += newResult[newKey];
  }
}

export default combineTwo;
