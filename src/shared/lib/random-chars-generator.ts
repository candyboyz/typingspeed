/**
 * Generates a random integer between the specified min and max values (inclusive).
 *
 * @param {number} min - The minimum value (default is 0).
 * @param {number} max - The maximum value (default is 1).
 * @returns {number} A random integer between min and max.
 */
const generateRandomInt = (min: number = 0, max: number = 1): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Array of numeric characters as strings.
const numArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

// Array of special symbol characters.
const symbolArray = [
  "!",
  '"',
  "#",
  "$",
  "%",
  "&",
  "'",
  "(",
  ")",
  "-",
  "=",
  "^",
  "~",
  "\\",
  "|",
  "@",
  "`",
  "[",
  "{",
  ";",
  "+",
  ":",
  "*",
  "]",
  "}",
  ",",
  "<",
  ".",
  ">",
  "/",
  "?",
  "_",
];

/**
 * Generates a random string of characters from a specified array.
 *
 * @param {string[]} charArray - The array of characters to choose from.
 * @param {number} [min=1] - The minimum number of characters to generate.
 * @param {number} [max=1] - The maximum number of characters to generate.
 * @returns {string} A random string of characters.
 */
const generateRandomChars = (
  charArray: string[],
  min: number = 1,
  max: number = 1,
): string => {
  const charsLen = generateRandomInt(min, max);
  return [...Array(charsLen)].reduce(
    (accum) => accum + charArray[generateRandomInt(0, charArray.length - 1)],
    "",
  );
};

/**
 * Generates a random string of numeric characters.
 *
 * @param {number} min - The minimum number of numeric characters to generate.
 * @param {number} max - The maximum number of numeric characters to generate.
 * @returns {string} A random string of numeric characters.
 */
const generateRandomNumChras = (min: number, max: number): string =>
  generateRandomChars(numArray, min, max);

/**
 * Generates a random string of special symbol characters.
 *
 * @param {number} min - The minimum number of symbol characters to generate.
 * @param {number} max - The maximum number of symbol characters to generate.
 * @returns {string} A random string of special symbol characters.
 */
const generateRandomSymbolChras = (min: number, max: number): string =>
  generateRandomChars(symbolArray, min, max);

export { generateRandomNumChras, generateRandomSymbolChras };
