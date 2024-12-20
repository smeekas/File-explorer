import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { ChartContainerStyled } from './ChartContainer.style';
import { LinearProgress } from '@mui/material';
import { EChartsType, init, EChartsOption } from 'echarts';
import { UsageDataForChart } from '../../types/monitor.types';
import { MAX_VALUES_IN_CHART } from '../monitor.constant';
type RealTimeChartProps = {
  yaxisName: string;
  title: string;
  series: UsageDataForChart[];
  loading: boolean;
};

export default memo(function RealTimeChart({
  series,
  title,
  loading,
}: RealTimeChartProps) {
  const id = useMemo(() => `real-${title}`, [title]);
  const ref = useRef<EChartsType | null>(null);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    if (!load) return;
    const chartDom = document.getElementById(id);
    console.log('here');
    if (chartDom) {
      ref.current = init(chartDom);
    }
  }, [id, load]);
  useEffect(() => {
    setLoad(true);
  }, []);
  useEffect(() => {
    if (!load) return;
    const option: EChartsOption = {
      animation:false,
      title: {
        text: title,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false,
        },
      },
      xAxis: {
        type: 'time',

      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        max: 100,
        min: 0,
      },
      series: [
        {
          name: 'CPU Usage',
          type: 'line',
          showSymbol: true,
        },
      ],
    };
    console.log('1st', option);
    ref.current?.setOption(option);
  }, [title, load]);
  useEffect(() => {
    if (!load) return;
    const start = series.length - MAX_VALUES_IN_CHART;
    const dataSource = series.slice(start < 0 ? 0 : start);
    console.log(dataSource.length);

    console.log(dataSource.length);
    const option: EChartsOption = {
      dataset: {
        source: dataSource.map((seriesItem) => [
          seriesItem.time,
          seriesItem.data,
        ]),
        dimensions: ['timestamp', 'usage'],
      },
      series: [
        {
          encode: {
            x: 'timestamp',
            y: 'usage',
          },
        },
      ],
    };
    console.log(option);
    ref.current?.setOption(option);
  }, [load, series]);
  return (
    <ChartContainerStyled>
      {loading && <LinearProgress />}
      <div className='real-time' id={id}></div>
    </ChartContainerStyled>
  );
});

// export default React.memo(RealTimeChart) as RealT;
