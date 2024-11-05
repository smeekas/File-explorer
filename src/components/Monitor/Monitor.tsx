import { useEffect, useState } from "react";
import useCommand from "../../hooks/useCommand";
import { Events } from "../../utils/constants";
import { CPUUsage } from "../../types/monitor.types";
import Apex from "react-apexcharts";

function Monitor() {
  const [allPoints, setAllPoints] = useState<CPUUsage[]>([]);
  const { data, loading } = useCommand<CPUUsage>({
    eventKey: Events.PROCESS,
    resultKey: Events.PROCESS_RESULT,
  });
  console.log(data);
  useEffect(() => {
    if (loading || data === null) return;
    setAllPoints((prev) => {
      const newData = [...prev, data];
      if (newData.length > 10) {
        newData.shift();
      }
      return newData;
    });
    // ApexChart.exec("realtime", "updateSeries", [
    //   {
    //     data: data,
    //   },
    // ]);
  }, [data, loading]);
  const series = allPoints.map((series) => +series.usage);

  return (
    <>
      <Apex
        height={200}
        series={[{ data: series }]}
        options={{
          yaxis: {
            max: 100,
            min: 0,
            seriesName: "usage",
            title: { text: "usage" },
          },

          dataLabels: {
            enabled: false,
          },
          chart: {
            id: "realtime",
            type: "line",
            animations: {
              enabled: false,
              dynamicAnimation: {
                speed: 1000,
              },
            },
            zoom: {
              enabled: false,
            },
          },
          markers: {
            size: 0,
          },

          title: {
            text: "CPU Usage (updated every second)",
            align: "left",
          },
          legend: {
            show: false,
          },
          stroke: {
            curve: "smooth",
            width: 2,
          },
        }}
      />
    </>
  );
}

export default Monitor;
