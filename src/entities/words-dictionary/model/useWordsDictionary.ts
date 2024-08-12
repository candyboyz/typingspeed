"use client";

import { useState, useMemo, type Dispatch, type SetStateAction } from "react";
import { wordsGenerator } from "@/shared/lib/words-generator";

interface useWordsDictionary {
  (
    countWords: number,
    difficult: "normal" | "hard",
    language: "english" | "russian",
    numbers: boolean,
    punctuation: boolean,
  ): {
    words: string[];
    wordsKey: string[];
    setWordsDict: Dispatch<
      SetStateAction<
        {
          key: string;
          val: string;
        }[]
      >
    >;
  };
}

/**
 * Custom hook that generates and manages a dictionary of words for a typing test.
 * It initializes the dictionary based on the provided configuration and provides
 * methods to access and update the dictionary.
 *
 * @param countWords - The number of words to generate for the test.
 * @param difficult - The difficulty level of the words ("normal" or "hard").
 * @param language - The language of the words ("english" or "russian").
 * @param numbers - Whether to include numbers in the words.
 * @param punctuation - Whether to include punctuation in the words.
 *
 * @returns An object containing the list of words, their keys, and a setter to update the dictionary.
 */
export const useWordsDictionary: useWordsDictionary = (
  countWords,
  difficult,
  language,
  numbers,
  punctuation,
) => {
  // State to hold the dictionary of words, initialized with a generated set of words
  const [wordsDict, setWordsDict] = useState(() => {
    return wordsGenerator(
      countWords,
      difficult,
      language,
      numbers,
      punctuation,
    );
  });

  /**
   * Memoized value to extract the list of word values from the dictionary.
   * The list is recalculated only when the dictionary changes.
   */
  const words = useMemo(() => wordsDict.map((e) => e.val), [wordsDict]);

  /**
   * Memoized value to extract the list of word keys from the dictionary.
   * The list is recalculated only when the dictionary changes.
   */
  const wordsKey = useMemo(() => wordsDict.map((e) => e.key), [wordsDict]);

  return { words, wordsKey, setWordsDict };
};
