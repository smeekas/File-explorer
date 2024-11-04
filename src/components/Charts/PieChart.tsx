import { Pie } from "react-chartjs-2";
import { ChartData, Chart, Tooltip } from "chart.js";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(Tooltip);
Chart.register(ChartDataLabels);
type PieChartProps = {
  data: ChartData<"pie">;
};
function PieChart({ data }: PieChartProps) {
  return (
    <Pie
      data={data}
      options={{
        plugins: {
          datalabels: {
            formatter(value) {
              return `${value} GB`;
            },
            color: "white",
          },
          tooltip: {
            enabled: false,
            callbacks: {
              label(tooltipItem) {
                return `${tooltipItem.formattedValue} GB`;
              },
            },
          },

          legend: {
            position: "bottom",
          },
        },
      }}
    />
  );
}

export default PieChart;
