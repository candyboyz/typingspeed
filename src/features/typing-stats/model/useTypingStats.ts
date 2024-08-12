import { useMemo } from "react";

interface useTypingStats {
  (
    wpmKeyStrokes: number,
    rawKeyStrokes: number,
    countDown: number,
    countDownConstant: number,
    statsCharCount: number[],
  ): { roundedWpm: number; roundedRawWpm: number; accuracy: number };
}

/**
 * Custom hook that calculates and returns the typing statistics based on the provided parameters.
 * It computes the Words Per Minute (WPM), raw WPM (including errors), and accuracy percentage.
 *
 * @param wpmKeyStrokes - The number of keystrokes counted towards WPM (correct keystrokes).
 * @param rawKeyStrokes - The total number of keystrokes (including errors).
 * @param countDown - The current countdown value (time left).
 * @param countDownConstant - The initial countdown value (total time).
 * @param statsCharCount - Array containing various character count statistics.
 *
 * @returns An object containing rounded WPM, rounded raw WPM, and accuracy percentage.
 */
export const useTypingStats: useTypingStats = (
  wpmKeyStrokes,
  rawKeyStrokes,
  countDown,
  countDownConstant,
  statsCharCount,
) => {
  /**
   * Computes the rounded WPM based on correct keystrokes.
   * It is calculated as (WPM keystrokes / 5) / (time elapsed) * 60.
   */
  const roundedWpm = useMemo(
    () =>
      Math.round((wpmKeyStrokes / 5 / (countDownConstant - countDown)) * 60.0),
    [wpmKeyStrokes, countDownConstant, countDown],
  );

  /**
   * Computes the rounded raw WPM based on total keystrokes, including errors.
   * It is calculated as (raw keystrokes / 5) / (time elapsed) * 60.
   */
  const roundedRawWpm = useMemo(
    () =>
      Math.round((rawKeyStrokes / 5 / (countDownConstant - countDown)) * 60.0),
    [rawKeyStrokes, countDownConstant, countDown],
  );

  /**
   * Extracts and rounds the accuracy percentage from the statsCharCount array.
   * Accuracy is typically calculated as the percentage of correct characters typed.
   */
  const accuracy = useMemo(
    () => Math.round(statsCharCount[0]),
    [statsCharCount],
  );

  return {
    roundedWpm,
    roundedRawWpm,
    accuracy,
  };
};
