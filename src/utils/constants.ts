export enum Events {
  GET_DIRS = "dirs",
  GET_DIRS_RESULT = "getDirs",
  GET_DIR_INFO = "dirInfo",
  GET_DIR_INFO_RESULT = "dirInfoResult",
  GET_FILE_INFO = "fileInfo",
  GET_FILE_INFO_RESULT = "fileInfoResult",
  START_DIR_ANALYSIS = "dirAnalysis",
  DIR_ANALYSIS_RESULT = "dirAnalysisResult",
  GET_HOME_DIR = "getHomeDir",
  GET_HOME_DIR_RESULT = "getHomeDirResult",
  FREE_SPACE = "freeSpace",
  FREE_SPACE_RESULT = "freeSpaceResult",
  GET_IMAGE = "getImage",
  GET_IMAGE_RESULT = "getImageResult",
  PROCESS = "process",
  PROCESS_RESULT = "processResult",
}

export const InvalidSearchKeys = [
  "ArrowDown",
  "ArrowUp",
  "ArrowLeft",
  "ArrowRight",
  "Tab",
];
export const FILES_ROUTE = "dirs-list";
