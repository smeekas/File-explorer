import { useEffect, useState } from "react";
import { Events } from "../utils/constants";
import useCommand from "./useCommand";
import { Usage } from "../types/monitor.types";

function useMemoryUsage() {
  const [allPoints, setAllPoints] = useState<Usage[]>([]);
  const { data, loading } = useCommand<Usage>({
    eventKey: Events.MEMORY,
    resultKey: Events.MEMORY_RESULT,
    poll: { millis: 2000 },
  });
  useEffect(() => {
    if (loading || data === null) return;
    setAllPoints((prev) => {
      const newData = [...prev, data];
      if (newData.length > 10) {
        newData.shift();
      }
      return newData;
    });
  }, [data, loading]);
  const series = allPoints.map((series) => +series.usage);
  return {
    series,
    loading,
  };
}

export default useMemoryUsage;
