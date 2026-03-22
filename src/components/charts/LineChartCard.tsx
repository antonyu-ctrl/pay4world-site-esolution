'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';

interface LineChartCardProps {
  data: { name: string; [key: string]: string | number }[];
  lines: { dataKey: string; name: string; color: string; type?: 'line' | 'area'; yAxisId?: string }[];
  height?: number;
  dualAxis?: boolean;
  yAxisFormatter?: (value: number) => string;
  rightYAxisFormatter?: (value: number) => string;
}

export default function LineChartCard({ data, lines, height = 320, dualAxis, yAxisFormatter, rightYAxisFormatter }: LineChartCardProps) {
  const defaultFormatter = (value: number) => {
    if (value >= 100000000) return `${(value / 100000000).toFixed(1)}억`;
    if (value >= 10000) return `${(value / 10000).toFixed(0)}만`;
    return value.toLocaleString();
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 13 }} axisLine={false} tickLine={false} />
        <YAxis
          yAxisId="left"
          tick={{ fill: '#6B7280', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={yAxisFormatter || defaultFormatter}
        />
        {dualAxis && (
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={rightYAxisFormatter || defaultFormatter}
          />
        )}
        <Tooltip
          formatter={(value: unknown, name: unknown) => [defaultFormatter(Number(value)), String(name)]}
          contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
        />
        <Legend wrapperStyle={{ paddingTop: 12, fontSize: 13 }} />
        {lines.map((line) =>
          line.type === 'area' ? (
            <Area
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              fill={line.color}
              fillOpacity={0.1}
              strokeWidth={2}
              yAxisId={line.yAxisId || 'left'}
            />
          ) : (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={2.5}
              dot={{ r: 4, fill: line.color }}
              activeDot={{ r: 6 }}
              yAxisId={line.yAxisId || 'left'}
            />
          )
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
