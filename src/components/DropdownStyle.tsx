import { StylesConfig } from "react-select";

interface OptionType {
  value: string | number;
  label: string;
}

const selectStyles: StylesConfig<OptionType, false> = {
  control: (base) => ({
    ...base,
    border: "1px solid rgba(82, 82, 91, 1)", // Tailwind's border
    padding: "0.25rem 0.5rem", // Tailwind's p-2
    borderRadius: "0.25rem", // Tailwind's rounded
    backgroundColor: "rgba(39, 39, 42, 1)", // Tailwind's bg-zinc-800
    maxWidth: "250px", // Tailwind's max-w-[150px]
    overflow: "hidden",
    textOverflow: "ellipsis", // Tailwind's text-ellipsis
    whiteSpace: "nowrap",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "rgba(39, 39, 42, 1)", // Tailwind's bg-zinc-800
    borderRadius: "0.25rem", // Tailwind's rounded
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected
      ? "rgba(59, 130, 246, 1)" // Tailwind's bg-blue-500
      : isFocused
      ? "rgba(82, 82, 91, 1)" // Tailwind's bg-zinc-700
      : "transparent",
    color: isSelected ? "white" : "rgba(229, 231, 235, 1)", // Tailwind's text-gray-200
    padding: "0.5rem", // Tailwind's p-2
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "rgba(229, 231, 235, 1)", // Tailwind's text-gray-200
    maxWidth: "150px", // Ensure it applies the max width
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }),
};

export default selectStyles;
