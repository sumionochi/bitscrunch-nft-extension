import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface NftCollectionPriceEstimationProps {
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
    }[] | null;
}

const NftCollectionPriceCard: React.FC<NftCollectionPriceEstimationProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="bg-white border-4 border-black p-4">
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-lg font-bold text-gray-500">No collection price estimation data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-4 border-black p-4">
      <CardHeader>
        <CardTitle className="text-xl font-black uppercase bg-orange-200 p-2 border-4 border-black inline-block">
          Collection Price Estimates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="bg-yellow-100 p-4 border-4 border-black space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={item.token_image_url || item.thumbnail_url}
                alt={item.collection_name}
                className="w-16 h-16 object-cover border-4 border-black"
              />
              <div>
                <h3 className="font-black text-lg">{item.collection_name}</h3>
                <p className="text-sm font-bold">Token ID: #{item.token_id}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="font-bold text-sm">Lower Bound</p>
                <p className="text-lg font-black text-blue-600">
                  {item.price_estimate_lower_bound.toFixed(4)} ETH
                </p>
              </div>
              <div className="text-center">
                <p className="font-bold text-sm">Estimate</p>
                <p className="text-lg font-black text-green-600">
                  {item.price_estimate.toFixed(4)} ETH
                </p>
              </div>
              <div className="text-center">
                <p className="font-bold text-sm">Upper Bound</p>
                <p className="text-lg font-black text-red-600">
                  {item.price_estimate_upper_bound.toFixed(4)} ETH
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-sm">Prediction Confidence</h4>
              <div className="relative h-6 bg-gray-200 border-2 border-black">
                <div
                  className="absolute h-full bg-green-400 border-r-2 border-black"
                  style={{ width: `${parseFloat(item.prediction_percentile) * 100}%` }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 font-bold text-sm">
                  {(parseFloat(item.prediction_percentile) * 100).toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="font-bold text-sm">Collection Driver</p>
                <p className={`text-lg font-black ${parseFloat(item.collection_drivers) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(item.collection_drivers).toFixed(4)}
                </p>
              </div>
              <div>
                <p className="font-bold text-sm">Rarity Driver</p>
                <p className={`text-lg font-black ${parseFloat(item.nft_rarity_drivers) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(item.nft_rarity_drivers).toFixed(4)}
                </p>
              </div>
              <div>
                <p className="font-bold text-sm">Sales Driver</p>
                <p className={`text-lg font-black ${parseFloat(item.nft_sales_drivers) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(item.nft_sales_drivers).toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NftCollectionPriceCard;