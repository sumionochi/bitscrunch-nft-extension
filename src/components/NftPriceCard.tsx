import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface NftPriceEstimationProps {
    data?: {
        address: string;
    chain_id: number;
    collection_drivers: string;
    collection_name: string;
    nft_rarity_drivers: string;
    nft_sales_drivers: string;
    prediction_percentile: string;
    price_estimate: number;
    price_estimate_lower_bound: number;
    price_estimate_upper_bound: number;
    thumbnail_palette: string;
    thumbnail_url: string;
    token_id: string;
    token_image_url: string;
    } | null;
}

const NftPriceCard: React.FC<NftPriceEstimationProps> = ({ data }) => {
  if (!data) {
    return (
      <Card className="bg-white border-4 border-black p-4">
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-lg font-bold text-gray-500">No price estimation data available</p>
        </CardContent>
      </Card>
    );
  }

  // Convert string values to numbers for the drivers
  const collectionDriver = parseFloat(data.collection_drivers);
  const rarityDriver = parseFloat(data.nft_rarity_drivers);
  const salesDriver = parseFloat(data.nft_sales_drivers);
  const gaugePercentage = parseFloat(data.prediction_percentile) * 100;

  return (
    <Card className="bg-white border-4 border-black p-4">
      <CardHeader className="flex flex-row items-center gap-4">
        <img
          src={data.token_image_url || data.thumbnail_url}
          alt={`${data.collection_name} #${data.token_id}`}
          className="w-32 h-32 object-cover border-4 border-black"
        />
        <div>
          <CardTitle className="text-xl font-black uppercase bg-orange-200 p-2 border-4 border-black inline-block">
            {data.collection_name}
          </CardTitle>
          <p className="mt-2 font-bold">Token ID: #{data.token_id}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-yellow-100 p-4 border-4 border-black space-y-2">
          <h3 className="font-black text-lg">Price Estimates (ETH)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="font-bold text-sm">Lower Bound</p>
              <p className="text-lg font-black text-blue-600">
                {data.price_estimate_lower_bound.toFixed(4)}
              </p>
            </div>
            <div className="text-center">
              <p className="font-bold text-sm">Estimate</p>
              <p className="text-lg font-black text-green-600">
                {data.price_estimate.toFixed(4)}
              </p>
            </div>
            <div className="text-center">
              <p className="font-bold text-sm">Upper Bound</p>
              <p className="text-lg font-black text-red-600">
                {data.price_estimate_upper_bound.toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-100 p-4 border-4 border-black">
          <h3 className="font-black text-lg mb-2">Prediction Confidence</h3>
          <div className="relative h-6 bg-gray-200 border-2 border-black">
            <div
              className="absolute h-full bg-green-400 border-r-2 border-black"
              style={{ width: `${gaugePercentage}%` }}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 font-bold text-sm">
              {gaugePercentage.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="bg-pink-100 p-4 border-4 border-black space-y-4">
          <h3 className="font-black text-lg">Market Drivers</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="font-bold text-sm">Collection</p>
              <p className={`text-lg font-black ${collectionDriver > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {collectionDriver.toFixed(4)}
              </p>
            </div>
            <div>
              <p className="font-bold text-sm">Rarity</p>
              <p className={`text-lg font-black ${rarityDriver > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {rarityDriver.toFixed(4)}
              </p>
            </div>
            <div>
              <p className="font-bold text-sm">Sales</p>
              <p className={`text-lg font-black ${salesDriver > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {salesDriver.toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-100 p-4 border-4 border-black">
          <h3 className="font-black text-lg mb-2">NFT Details</h3>
          <p className="font-bold text-sm break-all">
            Contract: {data.address}
          </p>
          <p className="font-bold text-sm">
            Chain ID: {data.chain_id}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NftPriceCard;