import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import ms from "ms";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}