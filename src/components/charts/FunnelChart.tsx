'use client';

interface FunnelStage {
  label: string;
  value: number;
  rate: number;
  color: string;
}

interface FunnelChartProps {
  stages: FunnelStage[];
}

export default function FunnelChart({ stages }: FunnelChartProps) {
  const maxValue = stages[0]?.value || 1;

  return (
    <div className="space-y-3">
      {stages.map((stage, index) => {
        const widthPercent = Math.max((stage.value / maxValue) * 100, 20);
        return (
          <div key={index} className="flex items-center gap-3">
            <div className="w-24 text-sm text-gray-600 text-right shrink-0">{stage.label}</div>
            <div className="flex-1 relative">
              <div
                className="h-10 rounded-xl flex items-center px-4 transition-all duration-500"
                style={{ width: `${widthPercent}%`, backgroundColor: stage.color }}
              >
                <span className="text-white text-sm font-semibold whitespace-nowrap">
                  {stage.value.toLocaleString()}
                </span>
              </div>
            </div>
            {index > 0 && (
              <div className="w-14 text-sm font-medium text-gray-500 shrink-0">
                {stage.rate}%
              </div>
            )}
            {index === 0 && <div className="w-14 shrink-0" />}
          </div>
        );
      })}
    </div>
  );
}
