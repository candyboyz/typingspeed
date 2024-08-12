import { generate } from "random-words";
import {
  generateRandomNumChras,
  generateRandomSymbolChras,
} from "./random-chars-generator";
import { randomIntFromRange } from "./utils";
import EnglishWords from "@/app/_assets/english-words.json";

// Parse the imported JSON file to create a list of common English words.
const COMMON_WORDS = JSON.parse(JSON.stringify(EnglishWords));

// Constants for different modes and settings.
const ENGLISH_MODE = "english";
const DEFAULT_DIFFICULTY = "normal";

/**
 * Generates a list of words based on the specified parameters.
 *
 * @param {number} wordsCount - The number of words to generate.
 * @param {string} difficulty - The difficulty level ("normal" or "hard").
 * @param {string} languageMode - The language mode ("english").
 * @param {boolean} number - Whether to append random numbers to the words.
 * @param {boolean} symbol - Whether to append random symbols to the words.
 * @returns {{key: string, val: string}[]} An array of objects containing the generated words.
 */
export const wordsGenerator = (
  wordsCount: number,
  difficulty: string,
  languageMode: string,
  number: boolean,
  symbol: boolean,
): { key: string; val: string }[] => {
  if (languageMode === ENGLISH_MODE) {
    // Handle the default "normal" difficulty level.
    if (difficulty === DEFAULT_DIFFICULTY) {
      const EnglishWordList = [];
      for (let i = 0; i < wordsCount; i++) {
        // Select a random word from the list of common English words.
        const rand = randomIntFromRange(0, 550);
        let wordCandidate = COMMON_WORDS[rand].val;

        // Optionally append random numbers and symbols to the word.
        if (number) {
          wordCandidate = wordCandidate + generateRandomNumChras(1, 2);
        }
        if (symbol) {
          wordCandidate = wordCandidate + generateRandomSymbolChras(1, 1);
        }

        // Add the word to the list.
        EnglishWordList.push({ key: wordCandidate, val: wordCandidate });
      }
      return EnglishWordList;
    }

    // Handle the "hard" difficulty level.
    const randomWordsGenerated = generate({
      exactly: wordsCount,
      maxLength: 7,
    });
    const words = [];
    for (let i = 0; i < wordsCount; i++) {
      let wordCandidate = randomWordsGenerated[i];

      // Optionally append random numbers and symbols to the word.
      if (number) {
        wordCandidate = wordCandidate + generateRandomNumChras(1, 2);
      }
      if (symbol) {
        wordCandidate = wordCandidate + generateRandomSymbolChras(1, 1);
      }

      // Add the word to the list.
      words.push({ key: wordCandidate, val: wordCandidate });
    }
    return words;
  }

  // Fallback case when the language mode is not recognized.
  return [
    { key: "something", val: "something" },
    { key: "went", val: "went" },
    { key: "wrong", val: "wrong" },
  ];
};
