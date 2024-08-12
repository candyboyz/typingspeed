"use client";

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  createRef,
  useRef,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  type RefObject,
} from "react";
import { useConfigStore } from "@/entities/settings-card";
import { useWordsDictionary } from "@/entities/words-dictionary";
import { wordsGenerator } from "@/shared/lib/words-generator";
import { PACING_CARET, PACING_UNDERLINE } from "@/shared/constants";

interface useTypingBox {
  (): {
    time: number;
    status: "waiting" | "started" | "finished";
    countDown: number;
    wpm: number;
    statsCharCount: number[];
    rawKeyStrokes: number;
    wpmKeyStrokes: number;
    incorrectCharsCount: number;
    setIncorrectCharsCount: Dispatch<SetStateAction<number>>;
    handleInputFocus: () => void | null;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    updateInput: (e: ChangeEvent<HTMLInputElement>) => void;
    getCharClassName: (
      wordIdx: number,
      charIdx: number,
      char: string,
      word: string,
    ) => string;
    getWordClassName: (wordIdx: number) => string;
    getExtraCharsDisplay: (word: string, i: number) => React.ReactNode;
    reset: (isRedo: boolean) => void;
    textInputRef: RefObject<HTMLInputElement>;
    wordsSpanRef: React.RefObject<HTMLSpanElement>[];
    currInput: string;
    currentWords: string[];
  };
}

/**
 * Custom hook that manages the state and logic for a typing test.
 * It tracks the current input, calculates WPM, handles key events,
 * and manages the rendering of words and characters.
 */
export const useTypingBox: useTypingBox = () => {
  // Reference to the input element for focusing and interacting with the input field
  const textInputRef = useRef<HTMLInputElement>(null);

  /**
   * Function to focus on the input field.
   */
  const handleInputFocus = useCallback(
    () => textInputRef.current && textInputRef.current.focus(),
    [textInputRef],
  );

  // Extracting configuration settings from the store
  const { time, caret, countWords, language, difficult, numbers, punctuation } =
    useConfigStore();

  // Fetching words based on the current configuration
  const { words, setWordsDict } = useWordsDictionary(
    countWords,
    difficult,
    language,
    numbers,
    punctuation,
  );

  // State to track various aspects of the typing test
  const [incorrectCharsCount, setIncorrectCharsCount] = useState(0);
  const [itemsToRender, setItemsToRender] = useState(40);
  const [isCapsLock, setIsCapsLock] = useState(false);

  // Creating references for each word span element
  const wordsSpanRef = useMemo(
    () =>
      Array(words.length)
        .fill(0)
        .map((i) => createRef<HTMLSpanElement>()),
    [words],
  );

  // State to track the countdown timer and status of the test
  const [countDown, setCountDown] = useState(time);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [status, setStatus] = useState<"waiting" | "started" | "finished">(
    "waiting",
  );

  // State to track the current input and word indices
  const [currInput, setCurrInput] = useState("");
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [prevInput, setPrevInput] = useState("");

  // State to track the correctness of words and keystrokes
  const [wordsCorrect, setWordsCorrect] = useState(new Set());
  const [wordsInCorrect, setWordsInCorrect] = useState(new Set());
  const [inputWordsHistory, setInputWordsHistory] = useState<{
    [key: number | string]: string;
  }>({});
  const [rawKeyStrokes, setRawKeyStrokes] = useState(0);
  const [wpmKeyStrokes, setWpmKeyStrokes] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [statsCharCount, setStatsCharCount] = useState<number[]>([]);
  const [history, setHistory] = useState<{
    [key: number | string]: string | number | boolean | undefined;
  }>({});
  const keyString = useMemo(
    () => `${currWordIndex}.${currCharIndex}`,
    [currWordIndex, currCharIndex],
  );
  const [currChar, setCurrChar] = useState("");

  /**
   * Effect to handle word generation and scrolling when the word index changes.
   */
  useEffect(() => {
    if (currWordIndex === countWords - 1) {
      const generate = wordsGenerator(
        countWords,
        difficult,
        language,
        numbers,
        punctuation,
      );
      setWordsDict((prev) => [...prev, ...generate]);
    }

    if (
      currWordIndex !== 0 &&
      wordsSpanRef[currWordIndex].current?.offsetLeft! <
        wordsSpanRef[currWordIndex - 1].current?.offsetLeft!
    ) {
      wordsSpanRef[currWordIndex - 1].current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    } else {
      return;
    }
  }, [
    currWordIndex,
    wordsSpanRef,
    countWords,
    difficult,
    language,
    numbers,
    punctuation,
    setWordsDict,
  ]);

  /**
   * Function to start or reset the typing test.
   */
  const start = () => {
    if (status === "finished") {
      // Resetting all state values when the test is finished
      setCurrInput("");
      setPrevInput("");
      setCurrWordIndex(0);
      setCurrCharIndex(-1);
      setCurrChar("");
      setHistory({});
      setInputWordsHistory({});
      setWordsCorrect(new Set());
      setWordsInCorrect(new Set());
      setStatus("waiting");
      textInputRef.current?.focus();
    }

    if (status !== "started") {
      setStatus("started");
      let intervalId = setInterval(() => {
        setCountDown((prev) => {
          if (prev === 0) {
            clearInterval(intervalId);

            // Calculate and set statistics when the test finishes
            const currCharExtraCount = Object.values(history)
              .filter((e) => typeof e === "number")
              .reduce((a, b) => a + b, 0);

            const currCharCorrectCount = Object.values(history).filter(
              (e) => e,
            ).length;

            const currCharInCorrectCount = Object.values(history).filter(
              (e) => !e,
            ).length;

            const currCharMissingCount = Object.values(history).filter(
              (e) => e === undefined,
            ).length;

            const currCharAdvancedCount =
              currCharCorrectCount +
              currCharMissingCount +
              currCharInCorrectCount;

            const accuracy =
              currCharCorrectCount === 0
                ? 0
                : (currCharCorrectCount / currCharAdvancedCount) * 100;

            setStatsCharCount([
              accuracy,
              currCharCorrectCount,
              currCharInCorrectCount,
              currCharMissingCount,
              currCharAdvancedCount,
              currCharExtraCount,
            ]);

            checkPrev();
            setStatus("finished");

            return time;
          } else {
            return prev - 1;
          }
        });
      }, 1000);
      setIntervalId(intervalId);
    }
  };

  /**
   * Updates the current input value as the user types.
   *
   * @param e - The change event triggered when the input value changes.
   */
  const updateInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (status === "finished") {
      return;
    }

    setCurrInput(e.target.value);
    inputWordsHistory[currWordIndex] = e.target.value.trim();
    setInputWordsHistory(inputWordsHistory);
  };

  /**
   * Handles the key up event and tracks whether CapsLock is active.
   *
   * @param e - The keyboard event triggered when a key is released.
   */
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLock(e.getModifierState("CapsLock"));
  };

  /**
   * Handles the key down event and manages various key-related actions,
   * such as starting the test, handling backspace, and spacebar input.
   *
   * @param e - The keyboard event triggered when a key is pressed down.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    const keyCode = e.keyCode;
    setIsCapsLock(e.getModifierState("CapsLock"));

    if (status === "started") {
      setRawKeyStrokes(rawKeyStrokes + 1);
      if (keyCode >= 59 && keyCode <= 90) {
        setWpmKeyStrokes(wpmKeyStrokes + 1);
      }
    }

    if (keyCode === 20) {
      e.preventDefault();
      return;
    }

    if (keyCode >= 16 && keyCode <= 18) {
      e.preventDefault();
      return;
    }

    if (status === "finished") {
      setCurrInput("");
      setPrevInput("");
      return;
    }

    if (wpmKeyStrokes !== 0 && time - countDown !== 0) {
      const currWpm = (wpmKeyStrokes / 5 / (time - countDown)) * 60.0;
      setWpm(currWpm);
    }

    if (status === "waiting") {
      start();
    }

    if (keyCode === 32) {
      const prevCorrectness = checkPrev();

      if (prevCorrectness === true || prevCorrectness === false) {
        if (
          words[currWordIndex].split("").length > currInput.split("").length
        ) {
          setIncorrectCharsCount((prev) => prev + 1);
        }

        setCurrInput("");
        setCurrWordIndex(currWordIndex + 1);
        setCurrCharIndex(-1);
        return;
      } else {
        return;
      }
    } else if (keyCode === 8) {
      delete history[keyString];

      if (currCharIndex < 0) {
        if (wordsInCorrect.has(currWordIndex - 1)) {
          const prevInputWord = inputWordsHistory[currWordIndex - 1];

          setCurrInput(prevInputWord + " ");
          setCurrCharIndex(prevInputWord.length - 1);
          setCurrWordIndex(currWordIndex - 1);
          setPrevInput(prevInputWord);
        }
        return;
      }

      setCurrCharIndex(currCharIndex - 1);
      setCurrChar("");
      return;
    } else {
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
      return;
    }
  };

  /**
   * Returns the class name for extra characters beyond the word length.
   *
   * @param i - The index of the word.
   * @param idx - The index of the extra character.
   * @param extra - The extra characters.
   * @returns The class name for the extra character.
   */
  const getExtraCharClassName = (i: number, idx: number, extra: string[]) => {
    if (
      caret === PACING_CARET &&
      currWordIndex === i &&
      idx === extra.length - 1
    ) {
      return "caret-extra-char-right-error";
    }
    return "error-char";
  };

  /**
   * Displays extra characters beyond the expected word length.
   *
   * @param word - The word being compared.
   * @param i - The index of the word.
   * @returns The rendered extra characters as React nodes.
   */
  const getExtraCharsDisplay = (word: string, i: number) => {
    let input = inputWordsHistory[i];
    if (!input) {
      input = currInput.trim();
    }
    if (i > currWordIndex) {
      return null;
    }
    if (input.length <= word.length) {
      return null;
    } else {
      const extra = input.slice(word.length, input.length).split("");
      history[i] = extra.length;
      return extra.map((c: string, idx: number) => (
        <span key={idx} className={getExtraCharClassName(i, idx, extra)}>
          {c}
        </span>
      ));
    }
  };

  /**
   * Compares the previous word with the current input to check correctness.
   * Updates the correctness state for the current word.
   *
   * @returns True if the word is correct, false if incorrect, or null if empty.
   */
  const checkPrev = () => {
    const wordToCompare = words[currWordIndex];
    const currInputWithoutSpaces = currInput.trim();
    const isCorrect = wordToCompare === currInputWithoutSpaces;
    if (!currInputWithoutSpaces || currInputWithoutSpaces.length === 0) {
      return null;
    }
    if (isCorrect) {
      wordsCorrect.add(currWordIndex);
      wordsInCorrect.delete(currWordIndex);
      const inputWordsHistoryUpdate = { ...inputWordsHistory };
      inputWordsHistoryUpdate[currWordIndex] = currInputWithoutSpaces;
      setInputWordsHistory(inputWordsHistoryUpdate);
      setPrevInput("");

      setWpmKeyStrokes(wpmKeyStrokes + 1);
      return true;
    } else {
      wordsInCorrect.add(currWordIndex);
      wordsCorrect.delete(currWordIndex);
      const inputWordsHistoryUpdate = { ...inputWordsHistory };
      inputWordsHistoryUpdate[currWordIndex] = currInputWithoutSpaces;
      setInputWordsHistory(inputWordsHistoryUpdate);
      setPrevInput(prevInput + " " + currInputWithoutSpaces);
      return false;
    }
  };

  /**
   * Returns the class name for the word based on its correctness.
   *
   * @param wordIdx - The index of the word.
   * @returns The class name for the word.
   */
  const getWordClassName = (wordIdx: number) => {
    if (wordsInCorrect.has(wordIdx)) {
      if (currWordIndex === wordIdx) {
        if (caret === PACING_UNDERLINE) {
          return "word error-word active-word";
        } else {
          return "word error-word active-word-no-pulse";
        }
      }
      return "word error-word";
    } else {
      if (currWordIndex === wordIdx) {
        if (caret === PACING_UNDERLINE) {
          return "word active-word";
        } else {
          return "word active-word-no-pulse";
        }
      }
      return "word";
    }
  };

  /**
   * Effect that increments the incorrect character count if the current character is incorrect.
   */
  useEffect(() => {
    if (status !== "started") return;
    const word = words[currWordIndex];
    const char = word.split("")[currCharIndex];

    if (char !== currChar && char !== undefined)
      return setIncorrectCharsCount((prev) => prev + 1);
  }, [currChar, status, currCharIndex, currWordIndex, words]);

  /**
   * Returns the class name for the character based on its correctness and caret position.
   *
   * @param wordIdx - The index of the word.
   * @param charIdx - The index of the character.
   * @param char - The character.
   * @param word - The word containing the character.
   * @returns The class name for the character.
   */
  const getCharClassName = (
    wordIdx: number,
    charIdx: number,
    char: string,
    word: string,
  ) => {
    const keyString = wordIdx + "." + charIdx;
    if (
      caret === PACING_CARET &&
      wordIdx === currWordIndex &&
      charIdx === currCharIndex + 1 &&
      status !== "finished"
    ) {
      return "caret-char-left";
    }
    if (history[keyString] === true) {
      if (
        caret === PACING_CARET &&
        wordIdx === currWordIndex &&
        word.length - 1 === currCharIndex &&
        charIdx === currCharIndex &&
        status !== "finished"
      ) {
        return "caret-char-right-correct";
      }
      return "correct-char";
    }
    if (history[keyString] === false) {
      if (
        caret === PACING_CARET &&
        wordIdx === currWordIndex &&
        word.length - 1 === currCharIndex &&
        charIdx === currCharIndex &&
        status !== "finished"
      ) {
        return "caret-char-right-error";
      }

      return "error-char";
    }
    if (
      wordIdx === currWordIndex &&
      charIdx === currCharIndex &&
      currChar &&
      status !== "finished"
    ) {
      if (char === currChar) {
        history[keyString] = true;
        return "correct-char";
      } else {
        history[keyString] = false;
        return "error-char";
      }
    } else {
      if (wordIdx < currWordIndex) {
        // Mark missing characters
        history[keyString] = undefined;
      }

      return "char";
    }
  };

  const startIndex = 0;

  const endIndex = startIndex + itemsToRender;

  const currentWords = words.slice(startIndex, endIndex);

  /**
   * Effect that loads more words as the user approaches the end of the currently rendered list.
   */
  useEffect(() => {
    const distanceToEnd = currentWords.length - 1 - currWordIndex;

    if (distanceToEnd === 20) {
      setItemsToRender((prev) => prev + 20);
    }
  }, [currWordIndex, currentWords]);

  /**
   * Resets the typing test to its initial state.
   *
   * @param isRedo - Whether the reset is a redo (restarting the same test).
   */
  const reset = useCallback(
    (isRedo: boolean) => {
      setStatus("waiting");
      if (!isRedo) {
        setWordsDict(
          wordsGenerator(countWords, difficult, language, numbers, punctuation),
        );
      }

      setCountDown(time);
      clearInterval(intervalId!);
      setWpm(0);
      setRawKeyStrokes(0);
      setWpmKeyStrokes(0);
      setCurrInput("");
      setPrevInput("");
      setIntervalId(null);
      setCurrWordIndex(0);
      setCurrCharIndex(-1);
      setCurrChar("");
      setHistory({});
      setInputWordsHistory({});
      setWordsCorrect(new Set());
      setWordsInCorrect(new Set());
      textInputRef.current?.focus();
      wordsSpanRef[0].current?.scrollIntoView();
    },
    [
      countWords,
      difficult,
      language,
      numbers,
      punctuation,
      time,
      intervalId,
      textInputRef,
      wordsSpanRef,
      setWordsDict,
    ],
  );

  // Effect to reset the test when configuration changes
  useEffect(() => {
    reset(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countWords, language, difficult, numbers, punctuation]);

  // Effect to reset the test when time changes
  useEffect(() => {
    reset(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return {
    time,
    status,
    countDown,
    wpm,
    statsCharCount,
    rawKeyStrokes,
    wpmKeyStrokes,
    incorrectCharsCount,
    setIncorrectCharsCount,
    handleInputFocus,
    handleKeyDown,
    handleKeyUp,
    updateInput,
    getCharClassName,
    getWordClassName,
    getExtraCharsDisplay,
    reset,
    textInputRef,
    wordsSpanRef,
    currInput,
    currentWords: words.slice(0, itemsToRender),
  };
};
