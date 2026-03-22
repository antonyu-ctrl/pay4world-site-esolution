'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface PieChartCardProps {
  data: { name: string; value: number; color: string }[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
}

export default function PieChartCard({ data, height = 280, innerRadius = 60, outerRadius = 100, showLegend = true }: PieChartCardProps) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: unknown, name: unknown) => [`${value}%`, String(name)]}
            contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
          />
        </PieChart>
      </ResponsiveContainer>
      {showLegend && (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-1.5 text-sm text-gray-600">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
              {entry.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
