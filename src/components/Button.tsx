import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = {
  small?: boolean;
  color?: string;
  className?: string;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export function Button({
  small = false,
  color = "blue",
  className = "",
  ...props
}: ButtonProps) {
  const sizeClasses = small ? "px-2 py-1" : "px-4 py-2 font-bold";
  let colorClasses = "";

  if (color === "red") {
    colorClasses = "bg-red-500 hover:bg-red-400 focus-visible:bg-red-400";
  } else if (color === "blue") {
    colorClasses = "bg-blue-500 hover:bg-blue-400 focus-visible:bg-blue-400";
  } else if (color === "gray") {
    colorClasses = "bg-gray-400 hover:bg-gray-300 focus-visible:bg-gray-300";
  }

  return (
    <button
      className={`rounded text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses} ${colorClasses} ${className}`}
      {...props}
    ></button>
  );
}
