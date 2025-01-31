import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import Chart from "./components/Chart"
import { format } from "date-fns"
import { metricsData } from "./data/DataLists.ts"
import Filters from "./Filters"
import { Input } from "./components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card"
import { Skeleton } from "./components/ui/skeleton"
import NftPriceCard from "./components/NftPriceCard.tsx"
import NftCollectionPriceCard from "./components/NftCollectionPriceCard.tsx"
import NftTransaction from "./components/NftTransaction.tsx"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import NftTraders from "./components/NftTraders";

interface Blockchain {
  metadata: {
    currency_id: string
    description: string
    id: number
    latest_data_timestamp: string
    name: string
    thumbnail_url: string
  }
}

interface MarketTrendTimestamp {
  timestamp: string
}

interface MarketTrendDataDetails {
  [key: string]: number
}

type MarketTrendData = MarketTrendTimestamp & MarketTrendDataDetails

interface TradersData {
  block_dates: string[]
  traders_trend: number[]
  traders_buyers_trend: number[]
  traders_sellers_trend: number[]
}

const App: React.FC = () => {
  const [data, setData] = useState<MarketTrendData[]>([])
  const [metric, setMetric] = useState<string>("volume")
  const [blockchain, setBlockchain] = useState<number | string>(1)
  const [blockchainString, setBlockchainString] = useState<string>("ethereum")
  const [optionBlockchain, setOptionBlockchain] = useState<Blockchain[]>([])
  const [timeRange, setTimeRange] = useState<string>("24h")
  const [isLoading, setIsLoading] = useState(false)
  const [nftDetails, setNftDetails] = useState<{ blockchain: string; contractAddress: string; tokenId: string } | null>(null);
  interface PriceEstimateData {
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
  }
  
  const [priceEstimate, setPriceEstimate] = useState<PriceEstimateData | null>(null);
  const [collectionPriceEstimate, setCollectionPriceEstimate] = useState<PriceEstimateData[] | null>(null);
  const [activeTab, setActiveTab] = useState<"nft-details" | "nft-transaction" | "nft-traders" | "trends">("nft-details")
  const [Tradersdata, setTradersData] = useState<TradersData | null>(null)
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem("nft_analytics_api_key") || ""
  })
  const [washtradeData, setWashtradeData] = useState<{
    block_dates: string[]
    washtrade_assets_trend: number[]
    washtrade_suspect_sales_trend: number[]
    washtrade_volume_trend: number[]
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value
    setApiKey(newApiKey)
    localStorage.setItem("nft_analytics_api_key", newApiKey)
  }

  const fetchAllData = async () => {
    if (!apiKey) return
    setIsLoading(true)
    try {
      const [blockchainsResponse, marketTrendResponse, tradersResponse, washtradeResponse] = await Promise.all([
        axios.get("https://api.unleashnfts.com/api/v1/blockchains", {
          params: {
            sort_by: "blockchain_name",
            offset: 0,
            limit: 30,
            "x-api-key": apiKey,
          },
          headers: {
            Authorization: apiKey,
          },
        }),
        axios.get("https://api.unleashnfts.com/api/v1/market/trend", {
          params: {
            currency: "usd",
            blockchain: blockchain,
            metrics: metric,
            time_range: timeRange,
            include_washtrade: "true",
            "x-api-key": apiKey,
          },
          headers: {
            Authorization: apiKey,
          },
        }),
        axios.get("https://api.unleashnfts.com/api/v2/nft/market-insights/traders", {
          headers: {
            accept: "application/json",
            "x-api-key": apiKey,
          },
          params: {
            blockchain: blockchainString,
            time_range: timeRange,
          },
        }),
        axios.get("https://api.unleashnfts.com/api/v2/nft/market-insights/washtrade", {
          headers: {
            accept: "application/json",
            "x-api-key": apiKey,
          },
          params: {
            blockchain: blockchainString,
            time_range: timeRange,
          },
        }),
      ])

      setOptionBlockchain(blockchainsResponse.data.blockchains)

      const validMarketTrendData = marketTrendResponse.data.data_points
        .filter((item: { values: { [key: string]: string | number } }) => item.values[metric] !== "NA")
        .map((item: { date: string; values: { [key: string]: number } }) => ({
          timestamp: format(new Date(item.date), "MMM dd, yyyy HH:mm"),
          [metric]: item.values[metric],
        }))
      setData(validMarketTrendData)

      const tradersData = tradersResponse.data.data[0]
      const formattedData = {
        block_dates: tradersData.block_dates.map((date: string) => format(new Date(date), "MMM dd, yyyy HH:mm")),
        traders_trend: tradersData.traders_trend,
        traders_buyers_trend: tradersData.traders_buyers_trend,
        traders_sellers_trend: tradersData.traders_sellers_trend,
      }
      setTradersData(formattedData)

      const washtradeData = washtradeResponse.data.data[0]
      const formattedWashtradeData = {
        block_dates: washtradeData.block_dates.map((date: string) => format(new Date(date), "MMM dd, yyyy HH:mm")),
        washtrade_assets_trend: washtradeData.washtrade_assets_trend,
        washtrade_suspect_sales_trend: washtradeData.washtrade_suspect_sales_trend,
        washtrade_volume_trend: washtradeData.washtrade_volume_trend,
      }
      setWashtradeData(formattedWashtradeData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [blockchain, metric, timeRange, apiKey])

  if (!apiKey) {
    return (
      <div className="w-[400px] h-[600px] bg-[#f5f5f5] flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6 bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black text-center mb-6 uppercase">NFT Analytics API Key Required</h2>
          <Input
            type="text"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={handleApiKeyChange}
            className="bg-yellow-100 border-4 border-black placeholder:text-gray-700 p-4 text-lg font-bold hover:bg-yellow-200 transition-all"
          />
          <p className="text-base font-bold text-center p-4 bg-pink-200 border-4 border-black">Please enter your API key to access NFT analytics data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-[720px] h-[800px] bg-rose-400 overflow-hidden flex flex-col p-4 pb-0">
      {error && (
        <div className="p-4 bg-red-100 border-4 border-black text-black font-bold">
          {error}
        </div>
      )}
      <div className="z-10">
      <div className="w-full bg-white p-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <Select value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <SelectTrigger className="w-full h-12 text-sm bg-white font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
            <SelectValue>
              {{
                'nft-details': 'NFT Details',
                'nft-transaction': 'NFT Transaction',
                'nft-traders': 'NFT Traders',
                'trends': 'Broad Analysis'
              }[activeTab]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="border-4 border-black bg-white text-black">
            <SelectGroup>
              <SelectItem value="nft-details" className="hover:bg-zinc-700 focus:bg-blue-500 focus:text-white cursor-pointer">NFT Details</SelectItem>
              <SelectItem value="nft-transaction" className="hover:bg-zinc-700 focus:bg-blue-500 focus:text-white cursor-pointer">NFT Transaction</SelectItem>
              <SelectItem value="nft-traders" className="hover:bg-zinc-700 focus:bg-blue-500 focus:text-white cursor-pointer">NFT Traders</SelectItem>
              <SelectItem value="trends" className="hover:bg-zinc-700 focus:bg-blue-500 focus:text-white cursor-pointer">Broad Analysis</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 pb-0">
        <Filters
          blockchain={blockchain}
          setBlockchain={setBlockchain}
          optionBlockchain={optionBlockchain}
          setBlockchainString={setBlockchainString}
          metric={metric}
          setMetric={setMetric}
          metricsData={metricsData}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />

        {isLoading ? (
          <div className="flex justify-center items-start flex-col">
            <Skeleton className="h-8 w-8 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex gap-4 pb-4 mt-0 justify-center items-start">
            {activeTab === "trends" && (
              <div className="flex flex-col gap-8 pb-4">
              <Card className="bg-white border-4 w-[40rem] h-[28rem] border-black p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
                <CardHeader>
                  <CardTitle className="text-xl text-center font-black uppercase bg-orange-200 p-2 border-4 border-black inline-block">General Market Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-68 md:h-64 lg:h-80">
                    <Chart data={data} metric={metric} />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-4 w-[40rem] h-[28rem] border-black p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
                <CardHeader>
                  <CardTitle className="text-xl text-center font-black uppercase bg-orange-200 p-2 border-4 border-black inline-block">Traders Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-68 md:h-64 lg:h-80">
                    <Chart data={Tradersdata?.block_dates.map((date, index) => ({
                      timestamp: date,
                      traders: Tradersdata.traders_trend[index],
                      buyers: Tradersdata.traders_buyers_trend[index],
                      sellers: Tradersdata.traders_sellers_trend[index]
                    }))} showTraders={true} />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-4 w-[40rem] h-[32rem] border-black p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
                <CardHeader>
                  <CardTitle className="text-xl text-center font-black uppercase bg-orange-200 p-2 border-4 border-black inline-block">Washtrade Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-68 md:h-64 lg:h-80">
                    <Chart data={washtradeData?.block_dates.map((date, index) => ({
                      timestamp: date,
                      washtrade_volume: parseFloat(washtradeData.washtrade_volume_trend[index].toFixed(2)),
                      washtrade_assets: parseFloat(washtradeData.washtrade_assets_trend[index].toFixed(2)),
                      washtrade_suspect_sales: parseFloat(washtradeData.washtrade_suspect_sales_trend[index].toFixed(2))
                    }))} showWashtrade={true} />
                  </div>
                </CardContent>
              </Card>
              </div>
            )}
            {activeTab === "nft-details" && (
              <Card className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
                <CardHeader>
                  <CardTitle className="text-xl font-black uppercase bg-orange-200 p-4 border-4 border-black inline-block">NFT Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                      <button
                        onClick={() => {
                          chrome.runtime.sendMessage({ type: 'GET_NFT_DETAILS' }, (response) => {
                            if (response?.nftDetails) {
                              setNftDetails(response.nftDetails);
                              setError(null);
                            } else {
                              setError('Please navigate to an OpenSea NFT page to extract NFT details.');
                              setNftDetails(null);
                            }
                          });
                        }}
                        className="w-full bg-blue-200 hover:bg-blue-300 text-black font-bold py-2 px-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        Extract NFT Details
                      </button>
                    {nftDetails && (
                      <div className="space-y-4">
                        <div className="space-y-2 bg-yellow-100 p-4 border-4 border-black">
                          <p className="text-sm font-bold">Blockchain: <span className="text-blue-600">{nftDetails.blockchain}</span></p>
                          <p className="text-sm font-bold">Contract Address: <span className="text-blue-600">{nftDetails.contractAddress}</span></p>
                          <p className="text-sm font-bold">Token ID: <span className="text-blue-600">{nftDetails.tokenId}</span></p>
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              const [nftResponse, collectionResponse] = await Promise.all([
                                axios.get(
                                  "https://api.unleashnfts.com/api/v2/nft/liquify/price_estimate",
                                  {
                                    params: {
                                      blockchain: nftDetails.blockchain,
                                      contract_address: nftDetails.contractAddress,
                                      token_id: nftDetails.tokenId,
                                    },
                                    headers: {
                                      "x-api-key": apiKey,
                                    },
                                  }
                                ),
                                axios.get(
                                  "https://api.unleashnfts.com/api/v2/nft/liquify/collection/price_estimate",
                                  {
                                    params: {
                                      blockchain: nftDetails.blockchain,
                                      contract_address: nftDetails.contractAddress,
                                    },
                                    headers: {
                                      "x-api-key": apiKey,
                                    },
                                  }
                                )
                              ]);
                              const nftPriceData = Array.isArray(nftResponse.data.data) ? nftResponse.data.data[0] : nftResponse.data.data;
                              const collectionPriceData = collectionResponse.data.data;
                              setPriceEstimate(nftPriceData);
                              setCollectionPriceEstimate(collectionPriceData);
                            } catch (error) {
                              console.error("Error fetching price estimate:", error);
                            }
                          }}
                          className="w-full bg-green-200 hover:bg-green-300 text-black font-bold py-2 px-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                        >
                          Analyze NFT Price
                        </button>
                        <NftPriceCard data={priceEstimate}/>
                        <NftCollectionPriceCard data={collectionPriceEstimate}/>
                        
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            {activeTab === "nft-transaction" && (
              <Card className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
                <CardHeader>
                  <CardTitle className="text-xl font-black uppercase bg-orange-200 p-4 border-4 border-black inline-block">NFT Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        chrome.runtime.sendMessage({ type: 'GET_NFT_DETAILS' }, (response) => {
                          if (response.nftDetails) {
                            setNftDetails(response.nftDetails);
                          }
                        });
                      }}
                      className="w-full bg-blue-200 hover:bg-blue-300 text-black font-bold py-2 px-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      Extract NFT Details
                    </button>
                    {nftDetails && (
                      <div className="space-y-4">
                        <div className="space-y-2 bg-yellow-100 p-4 border-4 border-black">
                          <p className="text-sm font-bold">Blockchain: <span className="text-blue-600">{nftDetails.blockchain}</span></p>
                          <p className="text-sm font-bold">Contract Address: <span className="text-blue-600">{nftDetails.contractAddress}</span></p>
                          <p className="text-sm font-bold">Token ID: <span className="text-blue-600">{nftDetails.tokenId}</span></p>
                        </div>
                        <NftTransaction
                          blockchain={nftDetails.blockchain}
                          contractAddress={nftDetails.contractAddress}
                          tokenId={nftDetails.tokenId}
                          timeRange={timeRange}
                          setTimeRange={setTimeRange}
                          apiKey={apiKey}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            {activeTab === "nft-traders" && (
              <Card className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
                <CardHeader>
                  <CardTitle className="text-xl font-black uppercase bg-orange-200 p-4 border-4 border-black inline-block">NFT Traders Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <button
                        onClick={() => {
                          chrome.runtime.sendMessage({ type: 'GET_NFT_DETAILS' }, (response) => {
                            if (response.nftDetails) {
                              setNftDetails(response.nftDetails);
                              setError(null);
                            } else {
                              setError('Please navigate to an OpenSea NFT page to extract NFT details.');
                              setNftDetails(null);
                            }
                          });
                        }}
                        className="w-full bg-blue-200 hover:bg-blue-300 text-black font-bold py-2 px-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        Extract NFT Details
                      </button>
                      {nftDetails && (
                        <div className="mt-4">
                          <div className="space-y-2 bg-yellow-100 p-4 border-4 border-black mb-4">
                            <p className="text-sm font-bold">Blockchain: <span className="text-blue-600">{nftDetails.blockchain}</span></p>
                            <p className="text-sm font-bold">Contract Address: <span className="text-blue-600">{nftDetails.contractAddress}</span></p>
                            <p className="text-sm font-bold">Token ID: <span className="text-blue-600">{nftDetails.tokenId}</span></p>
                          </div>
                          <NftTraders
                            blockchain={nftDetails.blockchain}
                            contractAddress={nftDetails.contractAddress}
                            tokenId={nftDetails.tokenId}
                            timeRange={timeRange}
                            apiKey={apiKey}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App

