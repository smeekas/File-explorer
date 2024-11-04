import  { useEffect, useState } from "react";
import { Events } from "../utils/constants";

function useHomeDir() {
  const [homeDir, setHomeDir] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    window.ipcRenderer.send(Events.GET_HOME_DIR);
    window.ipcRenderer.on(Events.GET_HOME_DIR_RESULT, (_, result) => {
      setHomeDir(result);
      setLoading(false);
    });
  }, []);
  return { homeDir, loading };
}

export default useHomeDir;
