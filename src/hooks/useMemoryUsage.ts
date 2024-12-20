import { useEffect, useState } from 'react';
import { Events } from '../utils/constants';
import useCommand from './useCommand';
import {
  Usage,
  UsageDataForChart,
  UsageWithTime,
} from '../types/monitor.types';
import dayjs from 'dayjs';
import { MAX_VALUES_IN_CHART, MONITOR_POLLING_IN_MS } from '../components/monitor.constant';

const initialValue: UsageWithTime[] = Array(MAX_VALUES_IN_CHART)
  .fill(null)
  .map(() => ({ free: 0, time: dayjs().toISOString(), usage: 0 }));
function useMemoryUsage() {
  const [allPoints, setAllPoints] = useState<UsageWithTime[]>(initialValue);
  const { data, loading } = useCommand<Usage>({
    eventKey: Events.MEMORY,
    resultKey: Events.MEMORY_RESULT,
    poll: { millis: MONITOR_POLLING_IN_MS },
  });
  useEffect(() => {
    if (loading || data === null) return;
    setAllPoints((prev) => {
      const newData: UsageWithTime[] = [
        ...prev,
        { ...data, time: dayjs().toISOString() },
      ];
      if (newData.length > 10) {
        newData.shift();
      }
      return newData;
    });
  }, [data, loading]);
  const series: UsageDataForChart[] = allPoints.map((series) => ({
    data: +series.usage,
    time: series.time,
  }));
  return {
    series,
    loading,
  };
}

export default useMemoryUsage;
