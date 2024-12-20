import RealTimeChart from '../Charts/RealTimeChart';
import useCpuUsage from '../../hooks/useCpuUsage';
import useMemoryUsage from '../../hooks/useMemoryUsage';
import { MonitorStyled } from './Monitor.styled';

function Monitor() {
  const { series, loading } = useCpuUsage();
  const { series: memorySeries, loading: memoryLoading } = useMemoryUsage();
  return (
    <MonitorStyled>
      <RealTimeChart
        yaxisName='Usage'
        series={series}
        loading={loading}
        title='CPU Usage (updated every 2 second)'
      />

      <RealTimeChart
        yaxisName='Usage'
        series={memorySeries}
        loading={memoryLoading}
        title='Memory Usage (updated every 2 second)'
      />
    </MonitorStyled>
  );
}

export default Monitor;
