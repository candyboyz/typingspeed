import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const randomIntFromRange = (min: number, max: number) => {
  const minNorm = Math.ceil(min);
  const maxNorm = Math.floor(max);
  const idx = Math.floor(Math.random() * (maxNorm - minNorm + 1) + minNorm);
  return idx;
};
