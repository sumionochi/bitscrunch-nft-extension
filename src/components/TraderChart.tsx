import React, { useState } from 'react';

interface TraderChartProps {
  data: {
    date: string;
    traders: number;
    buyers: number;
    sellers: number;
  }[];
}

const TraderChart: React.FC<TraderChartProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Calculate max values for scaling
  const maxValue = Math.max(
    ...data.map(d => Math.max(d.traders, d.buyers, d.sellers))
  );
  const chartHeight = 300;
  const chartWidth = 500;
  const padding = 40;
  const bottomPadding = 60; // Increased bottom padding for date labels
  const availableHeight = chartHeight - (padding + bottomPadding); // Adjusted to account for bottom padding
  const availableWidth = chartWidth - (2 * padding);
  const barWidth = Math.min((availableWidth / data.length) / 5, 20);

  // Scale values to fit chart height
  const scaleValue = (value: number) => {
    return (value / maxValue) * availableHeight;
  };

  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; values: { traders: number; buyers: number; sellers: number } } | null>(null);

  const handleMouseEnter = (event: React.MouseEvent<SVGGElement>, item: typeof data[0]) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY - 80,
      date: item.date,
      values: {
        traders: item.traders,
        buyers: item.buyers,
        sellers: item.sellers
      }
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
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
            return (
              <g 
                key={item.date} 
                onMouseEnter={(e) => handleMouseEnter(e, item)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Traders bar */}
                <rect
                  x={x}
                  y={chartHeight - padding - scaleValue(item.traders)}
                  width={barWidth}
                  height={scaleValue(item.traders)}
                  fill="#6366f1"
                  stroke="#000"
                  strokeWidth="2"
                />
                {/* Buyers bar */}
                <rect
                  x={x + barWidth}
                  y={chartHeight - padding - scaleValue(item.buyers)}
                  width={barWidth}
                  height={scaleValue(item.buyers)}
                  fill="#10b981"
                  stroke="#000"
                  strokeWidth="2"
                />
                {/* Sellers bar */}
                <rect
                  x={x + (2 * barWidth)}
                  y={chartHeight - padding - scaleValue(item.sellers)}
                  width={barWidth}
                  height={scaleValue(item.sellers)}
                  fill="#ef4444"
                  stroke="#000"
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>

        {/* X-axis dates */}
        {/* <div className="absolute -bottom-12 left-0 right-0 flex justify-between text-sm font-bold"> 
          {data.map((item) => {
            const date = new Date(item.date);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`; 
            return (
              <div key={item.date} className="transform -rotate-45 origin-top-left whitespace-nowrap px-1 bg-white border border-black ml-2">
                {formattedDate}
              </div>
            );
          })}
        </div> */}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div 
          className="fixed z-50 bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm font-bold"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <p className="mb-2">{tooltip.date}</p>
          <div className="space-y-1">
            <p className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#6366f1] border-2 border-black"></span>
              Traders: {tooltip.values.traders}
            </p>
            <p className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#10b981] border-2 border-black"></span>
              Buyers: {tooltip.values.buyers}
            </p>
            <p className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#ef4444] border-2 border-black"></span>
              Sellers: {tooltip.values.sellers}
            </p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#6366f1] border-2 border-black" />
          <span className="text-sm font-bold">Traders</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#10b981] border-2 border-black" />
          <span className="text-sm font-bold">Buyers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#ef4444] border-2 border-black" />
          <span className="text-sm font-bold">Sellers</span>
        </div>
      </div>
    </div>
  );
};

export default TraderChart;