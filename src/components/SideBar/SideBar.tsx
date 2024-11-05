import { SideBarStyled } from "./SideBar.styled";
import { Events } from "../../utils/constants";
import useCommand from "../../hooks/useCommand";
import { FreeSpaceResult } from "../../types/freeSpace.types";
import Apex from "react-apexcharts";
import { useMemo } from "react";

function SideBar() {
  const { data, loading } = useCommand<FreeSpaceResult>({
    eventKey: Events.FREE_SPACE,
    resultKey: Events.FREE_SPACE_RESULT,
  });

  const series: ApexNonAxisChartSeries = useMemo(
    () =>
      data
        ? [+data.free.toFixed(2), +data.used.toFixed(2)]
        : ([] as ApexNonAxisChartSeries),
    [data]
  );

  return (
    <SideBarStyled>
      {loading && <p>loading....</p>}
      {!loading && series.length > 0 && (
        <div>
          <Apex
            type="pie"
            series={series}
            options={{
              series,
              labels: ["Free", "Used"],
              tooltip: { followCursor: true, enabled: false },
              dataLabels: {
                formatter(_, opt) {
                  return `${opt.w.config.series[opt.seriesIndex]} GB`;
                },
                dropShadow: { enabled: false },
                background: { foreColor: "black", enabled: true, opacity: 0 },
              },
              legend: {
                formatter(legendName) {
                  return `${legendName} Space`;
                },
                position: "bottom",
              },
              chart: {
                animations: {
                  enabled: true,
                },
              },
            }}
          />
        </div>
      )}
    </SideBarStyled>
  );
}

export default SideBar;
