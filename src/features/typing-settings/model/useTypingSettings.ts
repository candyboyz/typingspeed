import { useConfigStore } from "@/entities/settings-card";
import { useCallback } from "react";

interface useTypingSettings {
  (): {
    time: number;
    difficult: "normal" | "hard";
    numbers: boolean;
    punctuation: boolean;
    handleChangeTime: (val: number) => void;
    handleChangeDifficult: (val: "normal" | "hard") => void;
    handleToggleParam: (param: "numbers" | "punctuation") => void;
  };
}

/**
 * Custom hook that manages the typing settings for the typing test.
 * It provides handlers to update the settings such as time, difficulty level,
 * and toggling of special parameters (numbers and punctuation).
 */
export const useTypingSettings: useTypingSettings = () => {
  // Access the current configuration state from the store
  const { time, difficult, numbers, punctuation, change } = useConfigStore();

  /**
   * Updates the time setting in the configuration store.
   *
   * @param val - The new time value to be set.
   */
  const handleChangeTime = useCallback(
    (val: number) => {
      change("time", val);
    },
    [change],
  );

  /**
   * Updates the difficulty level in the configuration store.
   *
   * @param val - The new difficulty level ("normal" or "hard").
   */
  const handleChangeDifficult = useCallback(
    (val: "normal" | "hard") => {
      change("difficult", val);
    },
    [change],
  );

  /**
   * Toggles the specified parameter (either "numbers" or "punctuation")
   * in the configuration store.
   *
   * @param param - The parameter to toggle.
   */
  const handleToggleParam = useCallback(
    (param: "numbers" | "punctuation") => {
      change(param, param === "numbers" ? !numbers : !punctuation);
    },
    [change, numbers, punctuation],
  );

  return {
    time,
    difficult,
    numbers,
    punctuation,
    handleChangeTime,
    handleChangeDifficult,
    handleToggleParam,
  };
};
