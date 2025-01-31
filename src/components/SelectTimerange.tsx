import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SelectTimerangeProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
}

export const SelectTimerange: React.FC<SelectTimerangeProps> = ({
  timeRange,
  setTimeRange,
}) => {
  const timeRangeOptions = [
    { value: "24h", label: "24 Hours" },
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
    { value: "all", label: "All Time" },
  ];

  return (
    <Select value={timeRange} onValueChange={setTimeRange}>
      <SelectTrigger className="h-12 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
        <SelectValue>
          {timeRangeOptions.find((option) => option.value === timeRange)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="border-4 border-black bg-white text-black">
        <SelectGroup>
          {timeRangeOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="hover:bg-zinc-700 focus:bg-blue-500 focus:text-white cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
