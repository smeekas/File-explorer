import Apex from "react-apexcharts";
import { ChartContainerStyled } from "./ChartContainer.styled";
type RealTimeChartProps = {
  yaxisName: string;
  title: string;
  series: number[];
};
function RealTimeChart({ series, title, yaxisName }: RealTimeChartProps) {
  return (
    <ChartContainerStyled>
      <Apex
        height={'100%'}
        series={[{ data: series }]}
        options={{
          yaxis: {
            max: 100,
            min: 0,
            seriesName: yaxisName,
            title: { text: yaxisName },
          },
          xaxis: {
            axisTicks: { show: false },
            labels: { show: false },
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
            text: title,
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
    </ChartContainerStyled>
  );
}

export default RealTimeChart;
