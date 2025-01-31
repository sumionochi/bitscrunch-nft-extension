import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "./ui/card";
import { format } from "date-fns";
import TraderChart from "./TraderChart";

interface TraderMetrics {
  blockchain: string;
  chain_id: number;
  contract_address: string;
  token_id: string;
  traders: number;
  traders_buyers: number;
  traders_buyers_change: number | null;
  traders_change: number | null;
  traders_sellers: number;
  traders_sellers_change: number | null;
  updated_at: string;
}

interface NftTradersProps {
  blockchain: string;
  contractAddress: string;
  tokenId: string;
  timeRange: string;
  apiKey: string;
}

const NftTraders: React.FC<NftTradersProps> = ({
  blockchain,
  contractAddress,
  tokenId,
  timeRange,
  apiKey,
}) => {
  const [traderMetrics, setTraderMetrics] = useState<TraderMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("traders");
  const [chartData, setChartData] = useState<{ date: string; traders: number; buyers: number; sellers: number }[]>([]);
  const [showChart, setShowChart] = useState(false);

  const sortOptions = [
    { value: "traders", label: "Total Traders" },
    { value: "traders_change", label: "Traders Change" },
    { value: "traders_buyers", label: "Buyers" },
    { value: "traders_buyers_change", label: "Buyers Change" },
    { value: "traders_sellers", label: "Sellers" },
    { value: "traders_sellers_change", label: "Sellers Change" },
    { value: "traders_ratio", label: "Traders Ratio" },
    { value: "traders_ratio_change", label: "Traders Ratio Change" }
  ];

  useEffect(() => {
    const fetchTraderMetrics = async () => {
      if (!blockchain || !contractAddress || !tokenId) return;
      
      setIsLoading(true);
      setError(null);

      try {
        const [metricsResponse, historyResponse] = await Promise.all([
          axios.get("https://api.unleashnfts.com/api/v2/nft/traders", {
            params: {
              blockchain,
              contract_address: contractAddress,
              token_id: tokenId,
              time_range: timeRange,
              sort_by: sortBy
            },
            headers: {
              "x-api-key": apiKey,
            },
          }),
          axios.get("https://api.unleashnfts.com/api/v2/nft/market-insights/traders", {
            params: {
              blockchain,
              contract_address: contractAddress,
              token_id: tokenId,
              time_range: timeRange,
            },
            headers: {
              "x-api-key": apiKey,
            },
          })
        ]);

        const metricsData = Array.isArray(metricsResponse.data.data)
          ? metricsResponse.data.data[0]
          : metricsResponse.data.data;

        setTraderMetrics(metricsData);

        const historyData = historyResponse.data.data[0];
        const formattedChartData = historyData.block_dates.map((date: string, index: number) => ({
          date: format(new Date(date), "MMM dd, yyyy HH:mm"),
          traders: historyData.traders_trend[index],
          buyers: historyData.traders_buyers_trend[index],
          sellers: historyData.traders_sellers_trend[index],
        }));
        
        setChartData(formattedChartData);
      } catch (error) {
        console.error("Error fetching trader metrics:", error);
        setError("Failed to fetch trader metrics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTraderMetrics();
  }, [blockchain, contractAddress, tokenId, apiKey, sortBy]);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <div className="h-16 bg-gray-200 animate-pulse rounded border-4 border-black" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border-4 border-black text-black font-bold">
        {error}
      </div>
    );
  }

  if (!traderMetrics) {
    return (
      <div className="p-4 bg-yellow-100 border-4 border-black text-black font-bold">
        No trader metrics available for this NFT.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="w-full bg-white p-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex justify-between items-center gap-4 mb-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 h-12 text-sm bg-white font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all p-2 cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value} className="font-bold">
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowChart(!showChart)}
            className={`px-6 py-2 font-bold text-sm ${showChart ? 'bg-orange-200' : 'bg-blue-200'} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all`}
          >
            {showChart ? 'Hide Chart' : 'Show Chart'}
          </button>
        </div>
        {showChart && chartData.length > 0 && (
          <div className="mt-4 border-4 border-black p-4">
            <TraderChart data={chartData} />
          </div>
        )}
      </div>

      <Card className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2 bg-blue-100 p-4 border-4 border-black">
              <h3 className="font-black text-lg">Total Traders</h3>
              <p className="text-3xl font-black">{traderMetrics?.traders}</p>
              {traderMetrics?.traders_change !== null && (
                <p className={`text-sm font-bold ${traderMetrics?.traders_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(traderMetrics?.traders_change * 100).toFixed(2)}% change
                </p>
              )}
            </div>

            <div className="space-y-2 bg-green-100 p-4 border-4 border-black">
              <h3 className="font-black text-lg">Buyers</h3>
              <p className="text-3xl font-black">{traderMetrics?.traders_buyers}</p>
              {traderMetrics?.traders_buyers_change !== null && (
                <p className={`text-sm font-bold ${traderMetrics?.traders_buyers_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(traderMetrics?.traders_buyers_change * 100).toFixed(2)}% change
                </p>
              )}
            </div>

            <div className="space-y-2 bg-red-100 p-4 border-4 border-black">
              <h3 className="font-black text-lg">Sellers</h3>
              <p className="text-3xl font-black">{traderMetrics?.traders_sellers}</p>
              {traderMetrics?.traders_sellers_change !== null && (
                <p className={`text-sm font-bold ${traderMetrics?.traders_sellers_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(traderMetrics?.traders_sellers_change * 100).toFixed(2)}% change
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-100 border-4 border-black">
            <p className="text-sm font-bold">
              Last Updated: {traderMetrics && new Date(traderMetrics.updated_at).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NftTraders;