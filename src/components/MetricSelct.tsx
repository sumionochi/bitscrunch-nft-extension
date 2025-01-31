import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface MetricSelectProps {
  metric: string;
  setMetric: (value: string) => void;
  metricsData: any[];
}

const MetricSelect: React.FC<MetricSelectProps> = ({ metric, setMetric, metricsData }) => {
  return (
    <Select value={metric} onValueChange={setMetric}>
      <SelectTrigger className="h-12 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
        <SelectValue>
          {metricsData.find((option) => option.value === metric)?.label || "Select Metric"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="border-4 border-black bg-white text-black">
        <SelectGroup>
          {metricsData.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="hover:bg-white focus:bg-blue-500 focus:text-white cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}  
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default MetricSelect;
