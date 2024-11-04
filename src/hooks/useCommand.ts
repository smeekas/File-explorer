import { useCallback, useEffect, useState } from "react";
import { Events } from "../utils/constants";

type useCommandProps = {
  eventKey: Events;
  resultKey: Events;
  reqBody?: unknown;
};
function useCommand<T>({ eventKey, resultKey, reqBody }: useCommandProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const sendRequest = useCallback(() => {
    window.ipcRenderer.send(eventKey, reqBody);
    setLoading(true);
    window.ipcRenderer.on(resultKey, (_, result) => {
      setData(result);
      setLoading(false);
    });
  }, [eventKey, reqBody, resultKey]);
  useEffect(() => {
    sendRequest();
  }, [sendRequest]);
  return {
    loading,
    data,
    refetch: sendRequest,
  };
}

export default useCommand;
