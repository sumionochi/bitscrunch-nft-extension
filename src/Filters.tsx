import type React from "react"
import ChainSelect from "../src/components/chainSelect"
import MetricSelect from "../src/components/MetricSelct"
import { SelectTimerange } from "../src/components/SelectTimerange"

interface FiltersProps {
  blockchain: number | string
  setBlockchain: (value: number | string) => void
  optionBlockchain: any[]
  setBlockchainString: (value: string) => void
  metric: string
  setMetric: (value: string) => void
  metricsData: any[]
  timeRange: string
  setTimeRange: (value: string) => void
}

const Filters: React.FC<FiltersProps> = ({
  blockchain,
  setBlockchain,
  optionBlockchain,
  setBlockchainString,
  metric,
  setMetric,
  metricsData,
  timeRange,
  setTimeRange,
}) => {
  return (
    <div className="bg-teal-100 p-3 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all mb-6 mt-2">
      <div className="flex flex-row gap-6 justify-center">
        <ChainSelect
          blockchain={blockchain}
          setBlockchain={setBlockchain}
          optionBlockchain={optionBlockchain}
          setBlockchainString={setBlockchainString}
          val="id"
        />
        <MetricSelect metric={metric} setMetric={setMetric} metricsData={metricsData} />
        <SelectTimerange timeRange={timeRange} setTimeRange={setTimeRange} />
      </div>
    </div>
  )
}

export default Filters

