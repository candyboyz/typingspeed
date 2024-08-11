import { generate } from "random-words";
import {
  generateRandomNumChras,
  generateRandomSymbolChras,
} from "./randomCharsGenerator";
import { randomIntFromRange } from "./utils";
import EnglishWords from "@/app/_assets/english-words.json";

const COMMON_WORDS = JSON.parse(JSON.stringify(EnglishWords));

const ENGLISH_MODE = "ENGLISH_MODE";
const DEFAULT_DIFFICULTY = "normal";
const DEFAULT_WORDS_COUNT = 200;

export const wordsGenerator = (
  wordsCount: number,
  difficulty: string,
  languageMode: string,
  numberAddOn: boolean,
  symbolAddOn: boolean,
) => {
  if (languageMode === ENGLISH_MODE) {
    if (difficulty === DEFAULT_DIFFICULTY) {
      const EnglishWordList = [];
      for (let i = 0; i < DEFAULT_WORDS_COUNT; i++) {
        const rand = randomIntFromRange(0, 550);
        let wordCandidate = COMMON_WORDS[rand].val;
        if (numberAddOn) {
          wordCandidate = wordCandidate + generateRandomNumChras(1, 2);
        }
        if (symbolAddOn) {
          wordCandidate = wordCandidate + generateRandomSymbolChras(1, 1);
        }
        EnglishWordList.push({ key: wordCandidate, val: wordCandidate });
      }
      return EnglishWordList;
    }

    // hard
    const randomWordsGenerated = generate({
      exactly: wordsCount,
      maxLength: 7,
    });
    const words = [];
    for (let i = 0; i < wordsCount; i++) {
      let wordCandidate = randomWordsGenerated[i];
      if (numberAddOn) {
        wordCandidate = wordCandidate + generateRandomNumChras(1, 2);
      }
      if (symbolAddOn) {
        wordCandidate = wordCandidate + generateRandomSymbolChras(1, 1);
      }
      words.push({ key: wordCandidate, val: wordCandidate });
    }
    return words;
  }
  return [
    { key: "something", val: "something" },
    { key: "went", val: "went" },
    { key: "wrong", val: "wrong" },
  ];
};
