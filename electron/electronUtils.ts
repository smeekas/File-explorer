import { Dirent } from "fs";
import fs from "fs/promises";

export async function getDirsWithReadAccess(dirPath: string) {
  try {
    await fs.access(dirPath, fs.constants.R_OK);
    const dirInfo = await fs.readdir(dirPath, { withFileTypes: true });
    return dirInfo;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack, "name-->", err.name, "getFiles");
    }
    return [];
  }
}

export function isDirectory(fileObj: Dirent) {
  return fileObj.isDirectory() && !fileObj.isSymbolicLink();
}
