import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Blockchain {
  metadata: {
    currency_id: string;
    description: string;
    id: number;
    latest_data_timestamp: string;
    name: string;
    thumbnail_url: string;
  };
}

interface ChainSelectProps {
  optionBlockchain: Blockchain[];
  setBlockchain: (value: number | string) => void;
  setBlockchainString: (value: string) => void;
  blockchain: number | string;
  val: string;
}

const ChainSelect: React.FC<ChainSelectProps> = ({
  optionBlockchain,
  setBlockchain,
  setBlockchainString,
  blockchain,
  val,
}) => {
  const blockchainOptions = optionBlockchain.map((item: Blockchain) => ({
    value: item.metadata.id.toString(),
    label: item.metadata.name,
    icon: item.metadata.thumbnail_url,
    name: item.metadata.name,
  }));

  const currentValue = blockchainOptions.find((option) => {
    const res = val === "id" ? option.value === blockchain.toString() : option.name === blockchain;
    return res;
  });

  return (
    <Select
      value={currentValue?.value}
      onValueChange={(value) => {
        const selectedOption = blockchainOptions.find((opt) => opt.value === value);
        if (selectedOption) {
          setBlockchain(
            val === "id"
              ? parseInt(selectedOption.value)
              : selectedOption.name === "Ordinals"
              ? "bitcoin"
              : selectedOption.name.split(" ")[0].toLowerCase()
          );
          setBlockchainString(
            selectedOption.name === "Ordinals"
              ? "bitcoin"
              : selectedOption.name.split(" ")[0].toLowerCase()
          );
        }
      }}
    >
      <SelectTrigger className="h-12 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
        <SelectValue>
          {currentValue && (
            <div className="flex items-center gap-2">
              <img
                src={currentValue.icon}
                alt={currentValue.label}
                className="w-6 h-6 rounded-full"
              />
              <span>{currentValue.label}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="border-4 border-black bg-white text-black">
        <SelectGroup>
          {blockchainOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="hover:bg-zinc-700 focus:bg-blue-500 focus:text-white cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <img
                  src={option.icon}
                  alt={option.label}
                  className="w-6 h-6 rounded-full"
                />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ChainSelect;
