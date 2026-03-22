'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface AreaChartCardProps {
  data: { name: string; value: number; projected?: boolean }[];
  height?: number;
  color?: string;
  projectedColor?: string;
  yAxisFormatter?: (value: number) => string;
  projectedStartIndex?: number;
}

export default function AreaChartCard({
  data,
  height = 280,
  color = '#3B82F6',
  projectedColor = '#93C5FD',
  yAxisFormatter,
  projectedStartIndex,
}: AreaChartCardProps) {
  const defaultFormatter = (value: number) => {
    if (value >= 10000) return `${(value / 10000).toFixed(0)}만`;
    return value.toLocaleString();
  };

  const actualData = data.map((d, i) => ({
    ...d,
    actual: projectedStartIndex && i >= projectedStartIndex ? undefined : d.value,
    projected: projectedStartIndex && i >= projectedStartIndex - 1 ? d.value : undefined,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={actualData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 13 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={yAxisFormatter || defaultFormatter} />
        <Tooltip
          formatter={(value: unknown) => [(yAxisFormatter || defaultFormatter)(Number(value)), '']}
          contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
        />
        {projectedStartIndex && (
          <ReferenceLine
            x={data[projectedStartIndex - 1]?.name}
            stroke="#9CA3AF"
            strokeDasharray="5 5"
            label={{ value: '예측', fill: '#9CA3AF', fontSize: 12 }}
          />
        )}
        <Area
          type="monotone"
          dataKey="actual"
          stroke={color}
          fill={color}
          fillOpacity={0.15}
          strokeWidth={2}
          dot={{ r: 3, fill: color }}
        />
        {projectedStartIndex && (
          <Area
            type="monotone"
            dataKey="projected"
            stroke={projectedColor}
            fill={projectedColor}
            fillOpacity={0.1}
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={{ r: 3, fill: projectedColor }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
