import { app, BrowserWindow, ipcMain, shell } from "electron";
import path from "node:path";
import fs from "fs/promises";
import mime from "mime";
import { Worker } from "worker_threads";
import os from "os";
import { Events } from "../src/utils/constants";
import { DirectoryInfo, MyDir, MyFile } from "../src/types/directories";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FreeSpaceResult } from "../src/types/freeSpace.types";
import { DirInfo } from "../src/types/analysis.types";
import combineTwo from "../src/utils/combineTwo";
import getFileType from "../src/utils/getFileType";
import { getDirsWithReadAccess, isDirectory } from "./electronUtils";
dayjs.extend(relativeTime);

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "explorer.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegrationInWorker: true,
    },
    minWidth: 250,
    minHeight: 250,
  });
  // win.setMenu(null);
  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  ipcMain.on("open-new-window", (_, data) => {
    const secondWindow = new BrowserWindow({
      width: 600,
      height: 400,
      parent: win ?? undefined,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        contextIsolation: false,
      },
    });

    // Load the same React app but with a different route
    if (VITE_DEV_SERVER_URL) {
      secondWindow.loadURL(`${VITE_DEV_SERVER_URL}/dir-files`);
    } else {
      secondWindow.loadURL(
        `${path.join(RENDERER_DIST, "index.html")}/dir-files`
      );
    }
    // secondWindow.loadURL(
    //   isDev
    //     ? "http://localhost:3000/#/second-window" // Using hash router
    //     : `file://${path.join(__dirname, "../build/index.html")}#/second-window`
    // );

    // Wait for window to load before sending data
    secondWindow.webContents.on("did-finish-load", () => {
      secondWindow.webContents.send("window-data", data);
    });
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
ipcMain.on(Events.GET_DIRS, async (_, dirPath) => {
  try {
    const homedir = os.homedir();
    const actualPath = dirPath === "home" ? homedir : dirPath;
    const files = await fs.readdir(actualPath, { withFileTypes: true });
    const fileData = files.map((fileItem) => {
      return new Promise<{ file: MyFile } | { dir: MyDir }>((resolve) => {
        if (fileItem.isFile()) {
          fs.stat(path.join(fileItem.path, fileItem.name))
            .then((fileState) => {
              const fileInfo: { file: MyFile } = {
                file: {
                  name: fileItem.name,
                  path: path.join(fileItem.path, fileItem.name),
                  size: fileState.size,
                  modified: dayjs(fileState.mtime).fromNow(),
                  mime: mime.getType(fileItem.name),
                },
              };
              resolve(fileInfo);
            })
            .catch(() => {
              const fileInfo: { file: MyFile } = {
                file: {
                  name: fileItem.name,
                  path: path.join(fileItem.path, fileItem.name),
                  size: 0,
                  modified: "",
                  mime: mime.getType(fileItem.name),
                },
              };
              resolve(fileInfo);
            });
        } else {
          fs.readdir(path.join(fileItem.path, fileItem.name))
            .then((dirData) => {
              fs.stat(path.join(fileItem.path, fileItem.name))
                .then((dirInfo) => {
                  resolve({
                    dir: {
                      name: fileItem.name,
                      path: path.join(fileItem.path, fileItem.name),
                      isHidden: fileItem.name.startsWith("."),
                      size: dirData.length,
                      modified: dayjs(dirInfo.mtime).fromNow(),
                    },
                  });
                })
                .catch((err) => {
                  console.log(err, "151");
                  resolve({
                    dir: {
                      name: fileItem.name,
                      path: path.join(fileItem.path, fileItem.name),
                      isHidden: fileItem.name.startsWith("."),
                      size: dirData.length,
                      modified: "",
                    },
                  });
                });
            })
            .catch((err) => {
              console.log(err, "163");
              resolve({
                dir: {
                  name: fileItem.name,
                  path: path.join(fileItem.path, fileItem.name),
                  isHidden: fileItem.name.startsWith("."),
                  size: 0,
                  modified: "",
                },
              });
            });
        }
      });
    });
    const dirDataWithFileSize = (await Promise.all(
      fileData
    )) as DirectoryInfo["items"];

    const dirInfo: DirectoryInfo = {
      items: dirDataWithFileSize,
      numberOfDirs: files.filter((fileItem) => fileItem.isDirectory()).length,
      numberOfFiles: files.filter((fileItem) => fileItem.isFile()).length,
    };
    win?.webContents.send(Events.GET_DIRS_RESULT, dirInfo);
  } catch (err) {
    // err
    console.log(err);
  }
});

ipcMain.on(Events.GET_DIR_INFO, async (_, dirPath) => {
  const files = await fs.readdir(dirPath);
  win?.webContents.send(Events.GET_DIR_INFO_RESULT, files.length);
});

ipcMain.on(Events.GET_FILE_INFO, async (_, filePath) => {
  const file = await fs.stat(filePath);

  win?.webContents.send(Events.GET_FILE_INFO_RESULT, file);
});
ipcMain.on(Events.GET_HOME_DIR, () => {
  win?.webContents.send(Events.GET_HOME_DIR_RESULT, os.homedir());
});

ipcMain.on(Events.FREE_SPACE, async () => {
  const data = await fs.statfs(os.homedir());
  const response: FreeSpaceResult = {
    free: (data.bavail * data.bsize) / Math.pow(1000, 3),
    used: ((data.blocks - data.bavail) * data.bsize) / Math.pow(1000, 3),
  };

  win?.webContents.send(Events.FREE_SPACE_RESULT, response);
});

function getCPUInfo() {
  const cpus = os.cpus();

  let totalUser = 0;
  let totalNice = 0;
  let totalSys = 0;
  let totalIdle = 0;
  let totalIrq = 0;

  cpus.forEach((cpu) => {
    totalUser += cpu.times.user;
    totalNice += cpu.times.nice;
    totalSys += cpu.times.sys;
    totalIdle += cpu.times.idle;
    totalIrq += cpu.times.irq;
  });

  return { totalUser, totalNice, totalSys, totalIdle, totalIrq };
}

let prev = getCPUInfo();
ipcMain.on(Events.PROCESS, () => {
  // setInterval(() => {
  const curr = getCPUInfo();
  const user = curr.totalUser - prev.totalUser;
  const nice = curr.totalNice - prev.totalNice;
  const sys = curr.totalSys - prev.totalSys;
  const idle = curr.totalIdle - prev.totalIdle;
  const irq = curr.totalIrq - prev.totalIrq;

  const total = user + nice + sys + idle + irq;

  win?.webContents.send(Events.PROCESS_RESULT, {
    usage: (((user + sys + irq + nice) / total) * 100).toFixed(2),
    idle: ((idle / total) * 100).toFixed(2),
  });
  prev = curr;
  // }, 1000);
});
ipcMain.on(Events.MEMORY, () => {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;

  // // Convert to GB for readability
  // const total = (totalMemory / (1024 * 1024 * 1024)).toFixed(2);
  // const used = (usedMemory / (1024 * 1024 * 1024)).toFixed(2);
  // const free = (freeMemory / (1024 * 1024 * 1024)).toFixed(2);

  win?.webContents.send(Events.MEMORY_RESULT, {
    usage: +((usedMemory / totalMemory) * 100).toFixed(2),
    idle: +((freeMemory / totalMemory) * 100).toFixed(2),
  });
});
ipcMain.on(Events.START_DIR_ANALYSIS, async (_, dirPath: string) => {
  const dira = DirAnalyzer.getInstance(dirPath);
  fs.statfs(dirPath).then((res) => console.log(res));
  if (!dira.running) {
    const date = Date.now();
    await dira.analyze();

    win?.webContents.send(Events.DIR_ANALYSIS_RESULT, {
      ...dira.stats,
      time: (Date.now() - date) / 1000,
    });
  }
});

ipcMain.on("open", (_, path: string) => {
  shell.openPath(path);
});

app.whenReady().then(createWindow);

type ProgressCb = (progress: number) => void;
class DirAnalyzer {
  threads: number;
  path: string;
  stats: DirInfo;
  threadResult: DirInfo[];
  running: boolean;
  static getInstance(path: string) {
    return new DirAnalyzer(path);
  }
  progressCb: ProgressCb | null;
  private constructor(path: string) {
    this.threads = os.availableParallelism();
    this.path = path;
    this.progressCb = null;
    this.stats = this.getInitialStats();
    this.threadResult = [];
    this.running = false;
  }
  async analyze() {
    this.running = true;
    const topLevelDirs = await this._getTopLevelDirs(this.path);
    const promises: Promise<DirInfo>[] = [];

    for (let i = 0; i < this.threads; i++) {
      const worker = new Worker(path.join(__dirname, "work.js"));
      const promise = new Promise<DirInfo>((resolve, reject) => {
        worker.on("message", (event) => {
          if (event.err) {
            reject(event.err);
          } else {
            resolve(event.result);
          }
        });
        worker.postMessage({
          dirPaths: topLevelDirs,
          id: i,
          threads: this.threads,
        });
      });
      promises.push(promise);
    }
    await Promise.all(promises)
      .then((result) => {
        result.forEach((item) => {
          combineTwo(this.stats, item);
        });
      })
      .catch(console.log);
    this.running = false;
  }
  async _getTopLevelDirs(dirPath: string) {
    try {
      const dirs = await getDirsWithReadAccess(dirPath);

      const allFiles = dirs.filter((dirItem) => dirItem.isFile());

      for (const file of allFiles) {
        const result = getFileType(path.join(dirPath, file.name));
        combineTwo(this.stats, result);
      }

      return dirs
        .filter((dirItem) => isDirectory(dirItem))
        .map((dirItem) => path.join(dirPath, dirItem.name));
    } catch (err) {
      console.log(err, "err");
      return [];
    }
  }

  inform(cb: ProgressCb) {
    this.progressCb = cb;
  }
  getInitialStats(): DirInfo {
    return {
      audio: 0,
      videos: 0,
      images: 0,
      text: 0,
      pdf: 0,
      other: 0,
      size: 0,
      application: 0,
      compressed: 0,
    };
  }
}
