import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from './ui/card';
import { format } from 'date-fns';

interface NftAnalyticsProps {
  blockchain: string;
  contractAddress: string;
  tokenId: string;
  timeRange: string;
  apiKey: string;
}

interface AnalyticsData {
  block_dates: string[];
  performance_trend: number[];
  market_activity_trend: number[];
  price_trend: number[];
  volume_trend: number[];
  assets: number;
  assets_change: number | null;
  sales: number;
  sales_change: number | null;
  transactions: number;
  transactions_change: number | null;
  transfers: number;
  transfers_change: number | null;
  volume: number;
  volume_change: number | null;
  updated_at: string;
}

interface WashtradeData {
  washtrade_assets: string;
  washtrade_assets_change: number | null;
  washtrade_suspect_sales: string;
  washtrade_suspect_sales_change: number | null;
  washtrade_suspect_transactions: string;
  washtrade_suspect_transactions_change: number | null;
  washtrade_volume: number;
  washtrade_volume_change: number | null;
  washtrade_wallets: string;
  washtrade_wallets_change: number | null;
}

interface HoldersData {
  hold_duration: number;
  holders: number;
  holders_change: number;
  past_owners_count: number;
  wallet_holder_new: string[];
  max_date: string;
}

interface ScoresData {
  all_time_low: number;
  estimated_price: number | null;
  max_price: number;
  price: number;
  price_ceiling: number;
  rarity_rank: number;
  rarity_score: number;
  start_price: number;
  washtrade_status: string;
}

const NftAnalytics: React.FC<NftAnalyticsProps> = ({
  blockchain,
  contractAddress,
  tokenId,
  timeRange,
  apiKey,
}) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [washtradeData, setWashtradeData] = useState<WashtradeData | null>(null);
  const [holdersData, setHoldersData] = useState<HoldersData | null>(null);
  const [scoresData, setScoresData] = useState<ScoresData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState<string>('performance');
  const [chartData, setChartData] = useState<{
    timestamp: string;
    performance: number;
    market_activity: number;
    price: number;
    volume: number;
  }[]>([]);

  const metricOptions = [
    { value: 'performance', label: 'Performance' },
    { value: 'market_activity', label: 'Market Activity' },
    { value: 'price', label: 'Price' },
    { value: 'volume', label: 'Volume' }
  ];

  const [sortBy, setSortBy] = useState<string>("sales");

  const sortOptions = [
    { value: 'sales', label: 'Sales' },
    { value: 'sales_change', label: 'Sales Change' },
    { value: 'assets', label: 'Assets' },
    { value: 'assets_change', label: 'Assets Change' },
    { value: 'transactions', label: 'Transactions' },
    { value: 'transactions_change', label: 'Transactions Change' },
    { value: 'transfers', label: 'Transfers' },
    { value: 'transfers_change', label: 'Transfers Change' },
    { value: 'volume', label: 'Volume' },
    { value: 'volume_change', label: 'Volume Change' },
    { value: 'floor_price', label: 'Floor Price' },
    { value: 'floor_price_eth', label: 'Floor Price ETH' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!blockchain || !contractAddress || !tokenId) return;
      
      setIsLoading(true);
      setError(null);

      try {
        const [analyticsResponse, washtradeResponse, holdersResponse, scoresResponse] = await Promise.all([
          axios.get('https://api.unleashnfts.com/api/v2/nft/analytics', {
            params: {
              blockchain,
              contract_address: contractAddress,
              token_id: tokenId,
              time_range: timeRange,
              sort_by: sortBy
            },
            headers: {
              'x-api-key': apiKey
            }
          }),
          axios.get('https://api.unleashnfts.com/api/v2/nft/washtrade', {
            params: {
              blockchain,
              contract_address: contractAddress,
              token_id: tokenId,
              time_range: timeRange,
              sort_by: "washtrade_volume"
            },
            headers: {
              'x-api-key': apiKey
            }
          }),
          axios.get('https://api.unleashnfts.com/api/v2/nft/holders', {
            params: {
              blockchain,
              contract_address: contractAddress,
              token_id: tokenId,
              time_range: timeRange,
              sort_by: "holders"
            },
            headers: {
              'x-api-key': apiKey
            }
          }),
          axios.get('https://api.unleashnfts.com/api/v2/nft/scores', {
            params: {
              blockchain,
              contract_address: contractAddress,
              token_id: tokenId,
              time_range: timeRange,
              sort_by: "price"
            },
            headers: {
              'x-api-key': apiKey
            }
          })
        ]);

        const analyticsData = Array.isArray(analyticsResponse.data.data)
          ? analyticsResponse.data.data[0]
          : analyticsResponse.data.data;

        const washtradeData = Array.isArray(washtradeResponse.data.data)
          ? washtradeResponse.data.data[0]
          : washtradeResponse.data.data;

        const holdersData = Array.isArray(holdersResponse.data.data)
          ? holdersResponse.data.data[0]
          : holdersResponse.data.data;

        const scoresData = Array.isArray(scoresResponse.data.data)
          ? scoresResponse.data.data[0]
          : scoresResponse.data.data;

        // Initialize default trend data if missing
        const defaultTrendData = {
          block_dates: [],
          performance_trend: [],
          market_activity_trend: [],
          price_trend: [],
          volume_trend: [],
          ...analyticsData
        };

        setAnalyticsData(defaultTrendData);
        setWashtradeData(washtradeData);
        setHoldersData(holdersData);
        setScoresData(scoresData);

        // Only create chart data if trend data exists
        if (defaultTrendData.block_dates && defaultTrendData.block_dates.length > 0) {
          const formattedData = defaultTrendData.block_dates.map((date: string, index: number) => ({
            timestamp: format(new Date(date), 'MMM dd, yyyy HH:mm'),
            performance: defaultTrendData.performance_trend[index] || 0,
            market_activity: defaultTrendData.market_activity_trend[index] || 0,
            price: defaultTrendData.price_trend[index] || 0,
            volume: defaultTrendData.volume_trend[index] || 0
          }));
          setChartData(formattedData);
        } else {
          setChartData([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch NFT data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [blockchain, contractAddress, tokenId, timeRange, apiKey, sortBy]);

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

  if (!analyticsData) {
    return (
      <div className="p-4 bg-yellow-100 border-4 border-black text-black font-bold">
        No analytics data available for this NFT.
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
          <select
            value={activeMetric}
            onChange={(e) => setActiveMetric(e.target.value)}
            className="flex-1 h-12 text-sm bg-white font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all p-2 cursor-pointer"
          >
            {metricOptions.map((option) => (
              <option key={option.value} value={option.value} className="font-bold">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Card className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 bg-purple-100 p-4 border-4 border-black">
              <h3 className="font-black text-lg">Trading Volume (USD)</h3>
              <p className="text-3xl font-black">
                {analyticsData.volume_trend && analyticsData.volume_trend.length > 0
                  ? `$${analyticsData.volume_trend[analyticsData.volume_trend.length - 1].toFixed(2)}`
                  : `$${analyticsData.volume?.toFixed(2) || 'N/A'}`}
              </p>
              {analyticsData.volume_change !== null && (
                <p className={`text-sm font-bold ${analyticsData.volume_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(analyticsData.volume_change * 100).toFixed(2)}% change
                </p>
              )}
            </div>

            <div className="space-y-2 bg-pink-100 p-4 border-4 border-black">
              <h3 className="font-black text-lg">Assets</h3>
              <p className="text-3xl font-black">{analyticsData.assets}</p>
              {analyticsData.assets_change !== null && (
                <p className={`text-sm font-bold ${analyticsData.assets_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(analyticsData.assets_change * 100).toFixed(2)}% change
                </p>
              )}
            </div>

            <div className="space-y-2 bg-orange-100 p-4 border-4 border-black">
              <h3 className="font-black text-lg">Sales</h3>
              <p className="text-3xl font-black">{analyticsData.sales}</p>
              {analyticsData.sales_change !== null && (
                <p className={`text-sm font-bold ${analyticsData.sales_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(analyticsData.sales_change * 100).toFixed(2)}% change
                </p>
              )}
            </div>

            <div className="space-y-2 bg-indigo-100 p-4 border-4 border-black">
              <h3 className="font-black text-lg">Transactions</h3>
              <p className="text-3xl font-black">{analyticsData.transactions}</p>
              {analyticsData.transactions_change !== null && (
                <p className={`text-sm font-bold ${analyticsData.transactions_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(analyticsData.transactions_change * 100).toFixed(2)}% change
                </p>
              )}
            </div>

            <div className="space-y-2 bg-teal-100 p-4 border-4 border-black">
              <h3 className="font-black text-lg">Transfers</h3>
              <p className="text-3xl font-black">{analyticsData.transfers}</p>
              {analyticsData.transfers_change !== null && (
                <p className={`text-sm font-bold ${analyticsData.transfers_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(analyticsData.transfers_change * 100).toFixed(2)}% change
                </p>
              )}
            </div>

            <div className="col-span-2 mt-4 p-4 bg-gray-100 border-4 border-black">
              <p className="text-sm font-bold">
                Last Updated: {new Date(analyticsData.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Washtrade Metrics Card */}
      <Card className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
        <CardContent>
          <h2 className="text-xl font-black mb-4">Washtrade Metrics</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 bg-red-100 p-4 border-4 border-black">
              <h3 className="font-black text-lg">Suspect Sales</h3>
              <p className="text-3xl font-black">{washtradeData?.washtrade_suspect_sales || '0'}</p>
              {washtradeData?.washtrade_suspect_sales_change !== null && (
                <p className={`text-sm font-bold ${Number(washtradeData?.washtrade_suspect_sales_change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(Number(washtradeData?.washtrade_suspect_sales_change) * 100).toFixed(2)}% change
                </p>
              )}
            </div>

            <div className="space-y-2 bg-yellow-100 p-4 border-4 border-black">
              <h3 className="font-black text-lg">Washtrade Volume</h3>
              <p className="text-3xl font-black">${washtradeData?.washtrade_volume?.toFixed(2) || '0.00'}</p>
              {washtradeData?.washtrade_volume_change !== null && washtradeData?.washtrade_volume_change !== undefined && (
                <p className={`text-sm font-bold ${washtradeData?.washtrade_volume_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(washtradeData?.washtrade_volume_change * 100).toFixed(2)}% change
                </p>
              )}
            </div>

            <div className="space-y-2 bg-green-100 p-4 border-4 border-black">
              <h3 className="font-black text-lg">Suspect Transactions</h3>
              <p className="text-3xl font-black">{washtradeData?.washtrade_suspect_transactions || '0'}</p>
              {washtradeData?.washtrade_suspect_transactions_change !== null && (
                <p className={`text-sm font-bold ${Number(washtradeData?.washtrade_suspect_transactions_change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(Number(washtradeData?.washtrade_suspect_transactions_change) * 100).toFixed(2)}% change
                </p>
              )}
            </div>

            <div className="space-y-2 bg-blue-100 p-4 border-4 border-black">
              <h3 className="font-black text-lg">Washtrade Wallets</h3>
              <p className="text-3xl font-black">{washtradeData?.washtrade_wallets || '0'}</p>
              {washtradeData?.washtrade_wallets_change !== null && (
                <p className={`text-sm font-bold ${Number(washtradeData?.washtrade_wallets_change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(Number(washtradeData?.washtrade_wallets_change) * 100).toFixed(2)}% change
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Holders Information Card */}
      <Card className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
        <CardContent>
          <h2 className="text-xl font-black mb-4">Holders Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 bg-purple-100 p-4 border-4 border-black">
              <h3 className="font-black text-lg">Current Holders</h3>
              <p className="text-3xl font-black">{holdersData?.holders || '0'}</p>
              {holdersData?.holders_change !== null && holdersData?.holders_change !== undefined && (
                <p className={`text-sm font-bold ${holdersData.holders_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(holdersData.holders_change * 100).toFixed(2)}% change
                </p>
              )}
            </div>

            <div className="space-y-2 bg-orange-100 p-4 border-4 border-black">
              <h3 className="font-black text-lg">Past Owners</h3>
              <p className="text-3xl font-black">{holdersData?.past_owners_count || '0'}</p>
            </div>

            <div className="space-y-2 bg-pink-100 p-4 border-4 border-black">
              <h3 className="font-black text-lg">Hold Duration (days)</h3>
              <p className="text-3xl font-black">{holdersData?.hold_duration || '0'}</p>
            </div>

            <div className="space-y-2 bg-indigo-100 p-4 border-4 border-black">
              <h3 className="font-black text-lg">Last Updated</h3>
              <p className="text-lg font-bold">{holdersData?.max_date ? new Date(holdersData.max_date).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scores Card */}
      <Card className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
        <CardContent>
          <h2 className="text-xl font-black mb-4">NFT Scores</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 bg-yellow-100 p-4 border-4 border-black">
              <h3 className="font-black text-lg">Price Range (USD)</h3>
              <div className="space-y-1">
                <p className="text-sm font-bold">Current: ${scoresData?.price?.toFixed(2) || 'N/A'}</p>
                <p className="text-sm font-bold">All-time Low: ${scoresData?.all_time_low?.toFixed(2) || 'N/A'}</p>
                <p className="text-sm font-bold">All-time High: ${scoresData?.max_price?.toFixed(2) || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-2 bg-green-100 p-4 border-4 border-black">
              <h3 className="font-black text-lg">Rarity</h3>
              <p className="text-3xl font-black">{scoresData?.rarity_score?.toFixed(2) || 'N/A'}</p>
              <p className="text-sm font-bold">Rank: #{scoresData?.rarity_rank || 'N/A'}</p>
            </div>

            <div className="space-y-2 bg-blue-100 p-4 border-4 border-black">
              <h3 className="font-black text-lg">Price Estimates</h3>
              <p className="text-lg font-bold">Estimated: ${scoresData?.estimated_price?.toFixed(2) || 'N/A'}</p>
              <p className="text-lg font-bold">Ceiling: ${scoresData?.price_ceiling?.toFixed(2) || 'N/A'}</p>
            </div>

            <div className="space-y-2 bg-red-100 p-4 border-4 border-black">
              <h3 className="font-black text-lg">Washtrade Status</h3>
              <p className={`text-xl font-black ${scoresData?.washtrade_status === 'false' ? 'text-green-600' : 'text-red-600'}`}>
                {scoresData?.washtrade_status === 'false' ? 'Clean' : 'Suspicious'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NftAnalytics;