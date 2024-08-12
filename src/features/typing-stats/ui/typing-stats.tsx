"use client";

import { useTypingHistory } from "@/entities/typing-history";
import { useTypingStats } from "@/features/typing-stats";
import { type Dispatch, type SetStateAction, useMemo } from "react";

interface TypingStatsProps {
  status: "waiting" | "started" | "finished";
  wpm: number;
  countDown: number;
  countDownConstant: number;
  statsCharCount: number[];
  rawKeyStrokes: number;
  wpmKeyStrokes: number;
  setIncorrectCharsCount: Dispatch<SetStateAction<number>>;
  incorrectCharsCount: number;
}

export const TypingStats = ({
  status,
  wpm,
  countDown,
  countDownConstant,
  statsCharCount,
  rawKeyStrokes,
  wpmKeyStrokes,
  setIncorrectCharsCount,
  incorrectCharsCount,
}: TypingStatsProps) => {
  const { roundedWpm, roundedRawWpm, accuracy } = useTypingStats(
    wpmKeyStrokes,
    rawKeyStrokes,
    countDown,
    countDownConstant,
    statsCharCount,
  );

  const { typingHistory } = useTypingHistory(
    status,
    countDown,
    countDownConstant,
    roundedWpm,
    roundedRawWpm,
    incorrectCharsCount,
    setIncorrectCharsCount,
  );

  const data = useMemo(
    () =>
      typingHistory.map((history) => {
        return {
          wpm: history.wpm,
          rawWpm: history.rawWpm,
          time: history.time,
          error: history.error,
        };
      }),
    [typingHistory],
  );

  return (
    <>
      {status !== "finished" && status !== "waiting" && (
        <>
          <h3 className="text-blue-500 text-xl">{countDown}</h3>
          <h3 className="text-blue-500 text-xl">WPM: {Math.round(wpm)}</h3>
        </>
      )}

      {status === "finished" && (
        <div className="flex flex-col gap-12">
          <section className="flex items-center gap-12">
            <div>
              <h2 className="text-2xl font-bold dark:text-white/[0.2] text-black/[0.4]">
                WPM
              </h2>
              <h1 className="text-4xl font-bold">
                {Math.round(
                  data.map((e) => e.wpm).reduce((a, b) => a + b, 0) /
                    (data.length - 1),
                )}
              </h1>
            </div>
            <div>
              <h2 className="text-2xl font-bold dark:text-white/[0.2] text-black/[0.4]">
                ACC
              </h2>
              <h1 className="text-4xl font-bold">{accuracy}%</h1>
            </div>
          </section>
          <section className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xl font-semibold dark:text-white/[0.2] text-black/[0.4]">
                KPM
              </p>
              <h2 className="text-2xl font-bold dark:text-blue-500 text-blue-500">
                {Math.round((rawKeyStrokes / countDownConstant) * 60.0)}
              </h2>
            </div>
            <div>
              <p className="text-xl font-semibold dark:text-white/[0.2] text-black/[0.4]">
                characters
              </p>
              <h2 className="text-2xl font-bold tracking-wider">
                <span>{statsCharCount[1]}</span>/
                <span className="text-red-500">{statsCharCount[2]}</span>/
                <span className="text-gray-500">{statsCharCount[3]}</span>/
                <span>{statsCharCount[4]}</span>
              </h2>
            </div>
            <div>
              <p className="text-xl font-semibold dark:text-white/[0.2] text-black/[0.4]">
                time
              </p>
              <h2 className="text-2xl font-bold dark:text-blue-500 text-blue-500">
                {countDownConstant}s
              </h2>
            </div>
          </section>
        </div>
      )}
    </>
  );
};
