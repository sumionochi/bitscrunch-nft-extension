import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

interface NftTransaction {
  block_date: string;
  blockchain: string;
  chain_id: number;
  collection: string;
  contract_address: string;
  contract_created_date: string;
  contract_type: string;
  hash: string;
  is_washtrade: string;
  marketplace: string;
  receiving_address: string;
  sale_price_usd: number;
  sending_address: string;
  timestamp: string;
  token_id: string;
  transaction_type: string;
}

interface NftTransactionProps {
  blockchain: string;
  contractAddress: string;
  tokenId: string;
  timeRange: string;
  apiKey: string;
  setTimeRange: (timeRange: string) => void;
}

const NftTransaction: React.FC<NftTransactionProps> = ({
  blockchain,
  contractAddress,
  tokenId,
  timeRange,
  apiKey,
}) => {
  const [transactions, setTransactions] = useState<NftTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          "https://api.unleashnfts.com/api/v2/nft/transactions",
          {
            params: {
              blockchain,
              contract_address: contractAddress,
              token_id: tokenId,
              time_range: timeRange,
            },
            headers: {
              "x-api-key": apiKey,
            },
          }
        );

        console.log(response.data.data);
        const transactionData = Array.isArray(response.data.data) 
          ? response.data.data 
          : [response.data.data];

        setTransactions(transactionData.filter((tx: NftTransaction | null): tx is NftTransaction => tx !== null) || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to fetch transaction data");
      } finally {
        setIsLoading(false);
      }
    };

    if (blockchain && contractAddress && tokenId && timeRange) {
      fetchTransactions();
    }
  }, [blockchain, contractAddress, tokenId, timeRange, apiKey]);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="h-16 bg-gray-200 animate-pulse rounded border-4 border-black"
          />
        ))}
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

  if (!transactions.length) {
    return (
      <div className="p-4 bg-yellow-100 border-4 border-black text-black font-bold">
        No transactions found for this NFT.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-orange-200 border-4 border-black">
            <th className="p-2 text-left font-black">Date</th>
            <th className="p-2 text-left font-black">Type</th>
            <th className="p-2 text-left font-black">Price (USD)</th>
            <th className="p-2 text-left font-black">Marketplace</th>
            <th className="p-2 text-left font-black">From</th>
            <th className="p-2 text-left font-black">To</th>
            <th className="p-2 text-left font-black">Wash Trade</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr
              key={tx.hash}
              className={`border-4 border-black ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-yellow-100 transition-colors`}
            >
              <td className="p-2 font-bold">
                {format(new Date(tx.timestamp), "MMM dd, yyyy HH:mm")}
              </td>
              <td className="p-2 font-bold uppercase">{tx.transaction_type}</td>
              <td className="p-2 font-bold">
                ${tx.sale_price_usd.toFixed(2)}
              </td>
              <td className="p-2 font-bold uppercase">{tx.marketplace}</td>
              <td className="p-2 font-bold">
                {`${tx.sending_address.substring(0, 6)}...${tx.sending_address.slice(-4)}`}
              </td>
              <td className="p-2 font-bold">
                {`${tx.receiving_address.substring(0, 6)}...${tx.receiving_address.slice(-4)}`}
              </td>
              <td className="p-2 font-bold">
                <span
                  className={`px-2 py-1 rounded ${tx.is_washtrade === "Not Washtrade" ? 'bg-green-200' : 'bg-red-200'} border-2 border-black`}
                >
                  {tx.is_washtrade}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default NftTransaction;