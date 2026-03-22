'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface HBarChartCardProps {
  data: { name: string; value: number; color?: string }[];
  height?: number;
  color?: string;
  valueFormatter?: (value: number) => string;
}

export default function HBarChartCard({ data, height = 280, color = '#3B82F6', valueFormatter }: HBarChartCardProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
        <XAxis type="number" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={valueFormatter} />
        <YAxis type="category" dataKey="name" tick={{ fill: '#374151', fontSize: 13 }} axisLine={false} tickLine={false} width={50} />
        <Tooltip
          formatter={(value: unknown) => [valueFormatter ? valueFormatter(Number(value)) : Number(value).toLocaleString(), '']}
          contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
        />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color || color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
