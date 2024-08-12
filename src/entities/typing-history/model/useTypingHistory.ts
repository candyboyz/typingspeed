import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { initialTypingTestHistory } from "@/shared/constants";

interface useTypingHistory {
  (
    status: "waiting" | "started" | "finished",
    countDown: number,
    countDownConstant: number,
    roundedWpm: number,
    roundedRawWpm: number,
    incorrectCharsCount: number,
    setIncorrectCharsCount: Dispatch<SetStateAction<number>>,
  ): {
    typingHistory: {
      wpm: number;
      rawWpm: number;
      time: number;
      error: number;
    }[];
    setTypingHistory: Dispatch<
      SetStateAction<
        {
          wpm: number;
          rawWpm: number;
          time: number;
          error: number;
        }[]
      >
    >;
  };
}

/**
 * Custom hook that tracks and manages the history of typing test results.
 * It records WPM, raw WPM, time, and error count at regular intervals
 * during the typing test based on the countdown timer.
 *
 * @param status - The current status of the typing test ("waiting", "started", or "finished").
 * @param countDown - The current countdown value (time left).
 * @param countDownConstant - The initial countdown value (total time).
 * @param roundedWpm - The calculated WPM (words per minute) rounded to the nearest integer.
 * @param roundedRawWpm - The calculated raw WPM (including errors) rounded to the nearest integer.
 * @param incorrectCharsCount - The number of incorrect characters typed.
 * @param setIncorrectCharsCount - Function to reset the count of incorrect characters.
 *
 * @returns An object containing the typing history and a setter for updating the history.
 */
export const useTypingHistory: useTypingHistory = (
  status,
  countDown,
  countDownConstant,
  roundedWpm,
  roundedRawWpm,
  incorrectCharsCount,
  setIncorrectCharsCount,
) => {
  // State to hold the history of typing test results
  const [typingHistory, setTypingHistory] = useState(initialTypingTestHistory);

  /**
   * Effect that resets the typing history when the test is started.
   */
  useEffect(() => {
    if (status === "started") {
      setTypingHistory(initialTypingTestHistory);
    }
  }, [status]);

  /**
   * Effect that records typing statistics at regular intervals during the test.
   * It updates the typing history with the current WPM, raw WPM, and error count.
   */
  useEffect(() => {
    if (status === "started" && countDown < countDownConstant) {
      let shouldRecord = false;
      let increment = 1;

      // Determine the recording interval based on the total countdown time
      switch (countDownConstant) {
        case 90:
        case 60:
          shouldRecord = countDown % 5 === 0;
          increment = 5;
          break;
        case 30:
        case 15:
          shouldRecord = true;
          increment = 1;
          break;
        default:
          shouldRecord = true;
          increment = 1;
      }

      // If it's time to record the data, update the typing history
      if (shouldRecord) {
        const newTime = typingHistory.length * increment;

        setTypingHistory((prevTypingHistory) => [
          ...prevTypingHistory,
          {
            wpm: roundedWpm,
            rawWpm: roundedRawWpm,
            time: newTime,
            error: incorrectCharsCount,
          },
        ]);

        // Reset the count of incorrect characters after recording
        setIncorrectCharsCount(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    countDown,
    countDownConstant,
    incorrectCharsCount,
    roundedRawWpm,
    roundedWpm,
    setIncorrectCharsCount,
    status,
  ]);

  return {
    typingHistory,
    setTypingHistory,
  };
};
