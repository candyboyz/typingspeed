import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { ConfigState } from "./types";

export const useConfigStore = create<ConfigState>()(
  devtools(
    persist(
      (set) => ({
        time: 60,
        caret: "caret",
        countWords: 200,
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
