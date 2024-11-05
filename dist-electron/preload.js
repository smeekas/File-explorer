"use strict";
const electron = require("electron");
var Events = /* @__PURE__ */ ((Events2) => {
  Events2["GET_DIRS"] = "dirs";
  Events2["GET_DIRS_RESULT"] = "getDirs";
  Events2["GET_DIR_INFO"] = "dirInfo";
  Events2["GET_DIR_INFO_RESULT"] = "dirInfoResult";
  Events2["GET_FILE_INFO"] = "fileInfo";
  Events2["GET_FILE_INFO_RESULT"] = "fileInfoResult";
  Events2["START_DIR_ANALYSIS"] = "dirAnalysis";
  Events2["DIR_ANALYSIS_RESULT"] = "dirAnalysisResult";
  Events2["GET_HOME_DIR"] = "getHomeDir";
  Events2["GET_HOME_DIR_RESULT"] = "getHomeDirResult";
  Events2["FREE_SPACE"] = "freeSpace";
  Events2["FREE_SPACE_RESULT"] = "freeSpaceResult";
  Events2["GET_IMAGE"] = "getImage";
  Events2["GET_IMAGE_RESULT"] = "getImageResult";
  Events2["PROCESS"] = "process";
  Events2["PROCESS_RESULT"] = "processResult";
  return Events2;
})(Events || {});
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(
      channel,
      (event, ...args2) => listener(event, ...args2)
    );
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
});
electron.contextBridge.exposeInMainWorld("api", {
  [Events.GET_DIRS]: (path) => {
    electron.ipcRenderer.send(Events.GET_DIRS, path);
  },
  [Events.GET_DIR_INFO]: (path) => {
    electron.ipcRenderer.send(Events.GET_DIR_INFO, path);
  }
});
