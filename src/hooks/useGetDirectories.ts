import { useEffect, useState } from "react";
import { DirectoryInfo } from "../types/directories";
import { Events } from "../utils/constants";

export default function useGetDirectories(
  path: string,
  enabled: boolean = true
) {
  const [directories, setDirectories] = useState<DirectoryInfo | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!enabled) return;
    window.api[Events.GET_DIRS](path);
    window.ipcRenderer.on(Events.GET_DIRS_RESULT, (_, d) => setDirectories(d));
    setLoading(false);
  }, [enabled, path]);

  return { directories, loading };
}
