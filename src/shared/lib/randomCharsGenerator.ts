const generateRandomInt = (min: number = 0, max: number = 1) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const numArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
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

const generateRandomChars = (
  charArray: string[],
  min: number = 1,
  max: number = 1,
) => {
  const charsLen = generateRandomInt(min, max);
  return [...Array(charsLen)].reduce(
    (accum) => accum + charArray[generateRandomInt(0, charArray.length - 1)],
    "",
  );
};
const generateRandomNumChras = (min: number, max: number) =>
  generateRandomChars(numArray, min, max);
const generateRandomSymbolChras = (min: number, max: number) =>
  generateRandomChars(symbolArray, min, max);

export { generateRandomNumChras, generateRandomSymbolChras };
