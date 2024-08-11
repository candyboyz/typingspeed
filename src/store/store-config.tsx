import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface ConfigStateParams {
  time: number;
  countWords: number;
  pacing: "caret" | "underline";
  language: "english" | "russian";
  difficult: "normal" | "hard";
  numbers: boolean;
  punctuation: boolean;
}

interface ConfigState extends ConfigStateParams {
  change: <T extends keyof ConfigStateParams>(
    key: T,
    value: ConfigStateParams[T],
  ) => void;
}

export const useConfigStore = create<ConfigState>()(
  devtools(
    persist(
      (set) => ({
        time: 60,
        countWords: 200,
        pacing: "caret",
        language: "english",
        difficult: "normal",
        numbers: false,
        punctuation: false,

        change: (key, value) => set({ [key]: value }),
      }),
      {
        name: "config",
      },
    ),
  ),
);
