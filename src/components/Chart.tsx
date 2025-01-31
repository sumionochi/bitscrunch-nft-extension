import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartProps {
  data: ({
    timestamp: string;
    [key: string]: string | number;
  })[] | undefined;
  metric?: string;
  showTraders?: boolean;
  showWashtrade?: boolean;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
        <p className="font-black uppercase mb-2">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="font-bold" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value.toFixed(2)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Chart: React.FC<ChartProps> = ({ data, metric, showTraders, showWashtrade }) => {
  const [activeTab, setActiveTab] = useState<"volume" | "assets">("volume");
  if (!data) return null;

  return (
    <div className="p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
      {showWashtrade && (
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab("volume")}
            className={`px-4 py-2 font-bold text-sm ${activeTab === "volume" ? "bg-orange-200 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-white border-4 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"}`}
          >
            Washtrade Volume
          </button>
          <button
            onClick={() => setActiveTab("assets")}
            className={`px-4 py-2 font-bold text-sm ${activeTab === "assets" ? "bg-orange-200 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-white border-4 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"}`}
          >
            Assets v/s Suspect Sales
          </button>
        </div>
      )}
      <ResponsiveContainer width={546} height={270}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#000000" strokeWidth={0.5} />
          <XAxis 
            dataKey="timestamp" 
            reversed 
            stroke="#000000"
            strokeWidth={2}
            tick={{ fill: '#000000', fontSize: 12, fontWeight: 'bold' }}
          />
          <YAxis
            label={{ 
              value: showTraders ? 'Count' : '(USD)', 
              angle: -90, 
              position: 'insideLeft',
              fill: '#000000',
              fontWeight: 'bold'
            }}
            tickFormatter={(value) => {
              if (showWashtrade) {
                if (activeTab === "volume") {
                  return `${(value / 1e6).toFixed(1)}M`;
                } else {
                  return value.toLocaleString();
                }
              }
              return `${(value / 1e6).toFixed(1)}M`;
            }}
            domain={['auto', 'auto']}
            stroke="#000000"
            strokeWidth={2}
            tick={{ fill: '#000000', fontSize: 12, fontWeight: 'bold' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{
              fontWeight: 'bold',
              border: '2px solid #000000',
              padding: '8px'
            }}
          />
          {!showTraders && !showWashtrade && metric && (
            <Line 
              type="monotone" 
              dataKey={metric} 
              stroke="#fbbf24" 
              strokeWidth={3}
              dot={{ stroke: '#000000', strokeWidth: 2, r: 4, fill: '#fbbf24' }}
              activeDot={{ stroke: '#000000', strokeWidth: 2, r: 6, fill: '#fbbf24' }}
            />
          )}
          {showTraders && (
            <>
              <Line
                type="monotone"
                dataKey="traders"
                name="Traders"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ stroke: '#000000', strokeWidth: 2, r: 4, fill: '#6366f1' }}
                activeDot={{ stroke: '#000000', strokeWidth: 2, r: 6, fill: '#6366f1' }}
              />
              <Line
                type="monotone"
                dataKey="buyers"
                name="Buyers"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ stroke: '#000000', strokeWidth: 2, r: 4, fill: '#10b981' }}
                activeDot={{ stroke: '#000000', strokeWidth: 2, r: 6, fill: '#10b981' }}
              />
              <Line
                type="monotone"
                dataKey="sellers"
                name="Sellers"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ stroke: '#000000', strokeWidth: 2, r: 4, fill: '#ef4444' }}
                activeDot={{ stroke: '#000000', strokeWidth: 2, r: 6, fill: '#ef4444' }}
              />
            </>
          )}
          {showWashtrade && activeTab === "volume" && (
            <Line
              type="monotone"
              dataKey="washtrade_volume"
              name="Washtrade Volume"
              stroke="#ff7300"
              strokeWidth={3}
              dot={{ stroke: '#000000', strokeWidth: 2, r: 4, fill: '#ff7300' }}
              activeDot={{ stroke: '#000000', strokeWidth: 2, r: 6, fill: '#ff7300' }}
            />
          )}
          {showWashtrade && activeTab === "assets" && (
            <>
              <Line
                type="monotone"
                dataKey="washtrade_assets"
                name="Washtrade Assets"
                stroke="#8884d8"
                strokeWidth={3}
                dot={{ stroke: '#000000', strokeWidth: 2, r: 4, fill: '#8884d8' }}
                activeDot={{ stroke: '#000000', strokeWidth: 2, r: 6, fill: '#8884d8' }}
              />
              <Line
                type="monotone"
                dataKey="washtrade_suspect_sales"
                name="Suspect Sales"
                stroke="#82ca9d"
                strokeWidth={3}
                dot={{ stroke: '#000000', strokeWidth: 2, r: 4, fill: '#82ca9d' }}
                activeDot={{ stroke: '#000000', strokeWidth: 2, r: 6, fill: '#82ca9d' }}
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;