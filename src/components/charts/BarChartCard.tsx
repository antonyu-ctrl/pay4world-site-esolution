'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartCardProps {
  data: { name: string; [key: string]: string | number }[];
  bars: { dataKey: string; name: string; color: string }[];
  height?: number;
  yAxisFormatter?: (value: number) => string;
}

export default function BarChartCard({ data, bars, height = 320, yAxisFormatter }: BarChartCardProps) {
  const defaultFormatter = (value: number) => {
    if (value >= 10000) return `${(value / 10000).toFixed(0)}만`;
    return value.toLocaleString();
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 13 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={yAxisFormatter || defaultFormatter} />
        <Tooltip
          formatter={(value: unknown) => [Number(value).toLocaleString() + '원', '']}
          contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
        />
        <Legend wrapperStyle={{ paddingTop: 12, fontSize: 13 }} />
        {bars.map((bar) => (
          <Bar key={bar.dataKey} dataKey={bar.dataKey} name={bar.name} fill={bar.color} radius={[6, 6, 0, 0]} barSize={28} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
