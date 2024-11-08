import { LinearProgress } from "@mui/material";
import useCommand from "../../hooks/useCommand";
import { DirInfo } from "../../types/analysis.types";
import { Events } from "../../utils/constants";
import Apex from "react-apexcharts";
type DirAnalysisProps = {
  dirPath: string;
};
function DirAnalysis({ dirPath }: DirAnalysisProps) {
  const { data, loading } = useCommand<DirInfo>({
    eventKey: Events.START_DIR_ANALYSIS,
    resultKey: Events.DIR_ANALYSIS_RESULT,
    reqBody: dirPath,
  });
  if (loading) {
    return <LinearProgress />;
  }
  const series = [
    {
      data: [
        { x: "Images", y: data?.images },
        { x: "Videos", y: data?.videos },
        { x: "Text", y: data?.text },
        { x: "PDFs", y: data?.pdf },
        { x: "Others", y: data?.other },
      ],
    },
  ];
  return (
    <Apex
      type="bar"
      series={series}
      options={{
        series,
        dataLabels: { enabled: false },
        tooltip: {
          custom(options) {
            console.log(options);
            return `count: ${options.series[0][options.dataPointIndex]}`;
          },
        },
      }}
    />
  );
}

export default DirAnalysis;
