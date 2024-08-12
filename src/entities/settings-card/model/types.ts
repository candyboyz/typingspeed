export interface ConfigStateParams {
  time: number;
  caret: "caret" | "underline" | "off";
  countWords: number;
  language: "english" | "russian";
  difficult: "normal" | "hard";
  numbers: boolean;
  punctuation: boolean;
}

export interface ConfigState extends ConfigStateParams {
  change: <T extends keyof ConfigStateParams>(
    key: T,
    value: ConfigStateParams[T],
  ) => void;
}
