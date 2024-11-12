import { LinearProgress } from "@mui/material";
import useCommand from "../../hooks/useCommand";
import { DirInfo } from "../../types/analysis.types";
import { Events } from "../../utils/constants";
import Apex from "react-apexcharts";
import { getFileSize } from "../../utils/getFileSize";
type DirAnalysisProps = {
  dirPath: string;
};
function DirAnalysis({ dirPath }: DirAnalysisProps) {
  const { data, loading } = useCommand<DirInfo & { time: number }>({
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
        { x: "Audio", y: data?.audio },
        { x: "Text", y: data?.text },
        { x: "Compressed", y: data?.compressed },
        { x: "PDFs", y: data?.pdf },
        { x: "Executables", y: data?.application },
        { x: "Others", y: data?.other },
      ],
    },
  ];
  return (
    <>
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
      {data && <div>Time Taken: {data.time}s</div>}
      {data && <div>Total Size: {getFileSize(data.size)} {data.size}</div>}
      {data && (
        <div>
          Total File Count:{" "}
          {data.application +
            data.audio +
            data.compressed +
            data.images +
            data.other +
            data.pdf +
            data.videos +
            data.text}
        </div>
      )}
    </>
  );
}

export default DirAnalysis;
