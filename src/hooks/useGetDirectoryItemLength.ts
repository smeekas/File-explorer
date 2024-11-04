import { useCallback, useEffect, useState } from "react";
import { Events } from "../utils/constants";
import { FileFolderPathName } from "../types/directories";

function useGetDirectoryItemLength() {
  const [selectedDir, setSelectedDir] = useState<FileFolderPathName | null>(
    null
  );
  const [numberOfFiles, setNumberOfFiles] = useState<null | number>(null);
  const onClick = (path: string, name: string) => {
    setSelectedDir({ name, path });
  };
  useEffect(() => {
    if (selectedDir) {
      window.api[Events.GET_DIR_INFO](selectedDir.path);
      window.ipcRenderer.on(Events.GET_DIR_INFO_RESULT, (_, d) =>
        setNumberOfFiles(d)
      );
    }
  }, [selectedDir]);
  const resetDirState = useCallback(() => {
    setSelectedDir(null);
    setNumberOfFiles(null);
  }, []);
  return {
    onClick,
    selectedDir,
    numberOfFiles,
    resetDirState,
  };
}

export default useGetDirectoryItemLength;
