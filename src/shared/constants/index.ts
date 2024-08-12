export type DifficultType = "normal" | "hard";
export const DIFFICULTS: DifficultType[] = ["normal", "hard"];
export const TIMES = [15, 30, 60, 120];
export type CaretType = "caret" | "underline" | "off";
export const CARETS: CaretType[] = ["off", "caret", "underline"];
export const PACING_UNDERLINE = "underline";
export const PACING_CARET = "caret";

export const PARAMS_SETTINGS: {
  icon: string;
  text: "numbers" | "punctuation";
}[] = [
  { icon: "#", text: "numbers" },
  { icon: "@", text: "punctuation" },
];

export const initialTypingTestHistory = [
  {
    wpm: 0,
    rawWpm: 0,
    time: 0,
    error: 0,
  },
];
