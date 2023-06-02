import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = {
  small?: boolean;
  color?: string;
  class?: string;
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
  const colorClasses: { [key: string]: string } = {
    red: "bg-red-500 hover:bg-red-400 focus-visible:bg-red-400",
    blue: "bg-blue-500 hover:bg-blue-400 focus-visible:bg-blue-400",
    gray: "bg-gray-400 hover:bg-gray-300 focus-visible:bg-gray-300",
  };

  return (
    <button
      className={`rounded text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses} ${colorClasses[color]} ${className}`}
      {...props}
    ></button>
  );
}
