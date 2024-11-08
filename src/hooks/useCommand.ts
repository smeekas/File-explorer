import { useCallback, useEffect, useState } from "react";
import { Events } from "../utils/constants";

type useCommandProps = {
  eventKey: Events;
  resultKey: Events;
  reqBody?: unknown;
  poll?: {
    millis: number;
  };
};
function useCommand<T>({
  eventKey,
  resultKey,
  reqBody,
  poll,
}: useCommandProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    window.ipcRenderer.on(resultKey, (_, result) => {
      setData(result);
      setLoading(false);
    });
  }, [loaded, resultKey]);
  const sendRequest = useCallback(() => {
    window.ipcRenderer.send(eventKey, reqBody);
    setLoading(true);
  }, [eventKey, reqBody]);
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (poll) {
      interval = setInterval(() => {
        sendRequest();
      }, poll.millis);
    }
    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [poll, sendRequest]);
  useEffect(() => {
    sendRequest();
  }, [sendRequest]);
  return {
    loading,
    data,
  };
}

export default useCommand;
