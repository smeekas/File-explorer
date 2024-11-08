import RealTimeChart from "../Charts/RealTimeChart";
import useCpuUsage from "../../hooks/useCpuUsage";
import useMemoryUsage from "../../hooks/useMemoryUsage";
import { MonitorStyled } from "./Monitor.styled";

function Monitor() {
  const { series } = useCpuUsage();
  const { series: memorySeries } = useMemoryUsage();
  return (
    <MonitorStyled>
      <RealTimeChart
        yaxisName="Usage"
        series={series}
        title="CPU Usage (updated every 2 second)"
      />

      <RealTimeChart
        yaxisName="Usage"
        series={memorySeries}
        title="Memory Usage (updated every 2 second)"
      />
    </MonitorStyled>
  );
}

export default Monitor;
