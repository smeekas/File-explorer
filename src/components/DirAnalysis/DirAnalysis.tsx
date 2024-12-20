import { LinearProgress } from '@mui/material';
import useCommand from '../../hooks/useCommand';
import { DirInfo } from '../../types/analysis.types';
import { Events } from '../../utils/constants';
import { getFileSize } from '../../utils/getFileSize';
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

  console.log(data);
  return (
    <>
      {data && <div>Time Taken: {data.time}s</div>}
      {data && (
        <div>
          Total Size: {getFileSize(data.size)} {data.size}
        </div>
      )}
      {data && (
        <div>
          Total File Count:{' '}
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
