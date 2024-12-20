export type Usage = {
  usage: number;
  free: number;
};
export type Time = {
  time: string;
};
export type UsageWithTime = Time & Usage;
export type UsageDataForChart = Omit<Time & Usage, 'free'|'usage'> & { data: number };
