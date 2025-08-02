import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// `cn` is commonly used to merge Tailwind classes intelligently
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
