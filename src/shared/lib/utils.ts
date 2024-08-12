import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using `clsx` and merges Tailwind CSS classes using `twMerge`.
 *
 * @param {ClassValue[]} inputs - An array of class values to be processed.
 * @returns {string} A string of combined and merged class names.
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

/**
 * Generates a random integer within a specified range, inclusive of the minimum and maximum values.
 *
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @returns {number} A random integer between min and max (inclusive).
 */
export const randomIntFromRange = (min: number, max: number): number => {
  const minNorm = Math.ceil(min); // Normalize the minimum value by rounding up.
  const maxNorm = Math.floor(max); // Normalize the maximum value by rounding down.
  const idx = Math.floor(Math.random() * (maxNorm - minNorm + 1) + minNorm); // Generate a random integer within the range.
  return idx;
};
