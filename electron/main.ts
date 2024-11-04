import { app, BrowserWindow, ipcMain, shell } from "electron";
import path from "node:path";
import fs from "fs/promises";
import mime from "mime/lite";

import os from "os";
import { Events } from "../src/utils/constants";
import { DirectoryInfo, MyDir, MyFile } from "../src/types/directories";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FreeSpaceResult } from "../src/types/freeSpace.types";
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
      return new Promise<{ file: MyFile } | { dir: MyDir }>(
        (resolve, reject) => {
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
              .catch(reject);
          } else {
            fs.readdir(path.join(fileItem.path, fileItem.name))
              .then((dirData) => {
                fs.stat(path.join(fileItem.path, fileItem.name)).then(
                  (dirInfo) => {
                    resolve({
                      dir: {
                        name: fileItem.name,
                        path: path.join(fileItem.path, fileItem.name),
                        isHidden: fileItem.name.startsWith("."),
                        size: dirData.length,
                        modified: dayjs(dirInfo.mtime).fromNow(),
                      },
                    });
                  }
                );
              })
              .catch(reject);
          }
        }
      );
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
    free: (data.bavail * data.bsize) / Math.pow(1000, 2),
    used: ((data.blocks - data.bavail) * data.bsize) / Math.pow(1000, 2),
  };

  win?.webContents.send(Events.FREE_SPACE_RESULT, response);
});

ipcMain.on("open", (_, path: string) => {
  shell.openPath(path);
});

app.whenReady().then(createWindow);
