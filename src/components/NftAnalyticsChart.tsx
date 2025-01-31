import React, { useState } from 'react';

interface NftAnalyticsChartProps {
  data: {
    timestamp: string;
    performance: number;
    market_activity: number;
    price: number;
    volume: number;
  }[];
  metric: string;
}

const NftAnalyticsChart: React.FC<NftAnalyticsChartProps> = ({ data, metric }) => {
  if (!data || data.length === 0) return null;

  // Calculate max values for scaling
  const maxValue = Math.max(
    ...data.map(d => d[metric as keyof typeof d] as number)
  );
  const chartHeight = 300;
  const chartWidth = 500;
  const padding = 40;
  const bottomPadding = 60;
  const availableHeight = chartHeight - (padding + bottomPadding);
  const availableWidth = chartWidth - (2 * padding);
  const barWidth = Math.min((availableWidth / data.length) / 3, 20);

  // Scale values to fit chart height
  const scaleValue = (value: number) => {
    return (value / maxValue) * availableHeight;
  };

  const [tooltip, setTooltip] = useState<{ x: number; y: number; timestamp: string; value: number } | null>(null);

  const handleMouseEnter = (event: React.MouseEvent<SVGGElement>, item: typeof data[0]) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY - 80,
      timestamp: item.timestamp,
      value: item[metric as keyof typeof item] as number
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  const getMetricColor = () => {
    switch (metric) {
      case 'performance':
        return '#6366f1';
      case 'market_activity':
        return '#10b981';
      case 'price':
        return '#ef4444';
      case 'volume':
        return '#f59e0b';
      default:
        return '#6366f1';
    }
  };

  return (
    <div className="relative h-[260px]">
      {/* Y-axis */}
      <div className="absolute left-0 h-full w-12 flex flex-col justify-between text-sm font-bold">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
        <span>0%</span>
      </div>

      {/* Chart area */}
      <div className="ml-12 h-full relative">
        <svg width={chartWidth} height={chartHeight}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
            <line
              key={tick}
              x1={padding}
              y1={padding + (availableHeight * tick)}
              x2={chartWidth - padding}
              y2={padding + (availableHeight * tick)}
              stroke="#000"
              strokeWidth="1"
              strokeDasharray="4"
            />
          ))}

          {/* Bars */}
          {data.map((item, index) => {
            const x = padding + (index * (availableWidth / data.length));
            const value = item[metric as keyof typeof item] as number;
            return (
              <g
                key={item.timestamp}
                onMouseEnter={(e) => handleMouseEnter(e, item)}
                onMouseLeave={handleMouseLeave}
              >
                <rect
                  x={x}
                  y={chartHeight - padding - scaleValue(value)}
                  width={barWidth}
                  height={scaleValue(value)}
                  fill={getMetricColor()}
                  stroke="#000"
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm font-bold"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <p className="mb-2">{tooltip.timestamp}</p>
          <div className="space-y-1">
            <p className="flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-black" style={{ backgroundColor: getMetricColor() }}></span>
              {metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}: {tooltip.value.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-black" style={{ backgroundColor: getMetricColor() }} />
          <span className="text-sm font-bold">
            {metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NftAnalyticsChart;