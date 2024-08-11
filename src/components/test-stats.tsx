"use client";

import React, { useEffect, useState } from "react";

const initialTypingTestHistory = [
  {
    wpm: 0,
    rawWpm: 0,
    time: 0,
    error: 0,
  },
];

interface TestStatsProps {
  status: string;
  wpm: number;
  countDown: number;
  countDownConstant: number;
  statsCharCount: number[];
  rawKeyStrokes: number;
  wpmKeyStrokes: number;
  setIncorrectCharsCount: (val: number) => void;
  incorrectCharsCount: number;
}

export const TestStats = ({
  status,
  wpm,
  countDown,
  countDownConstant,
  statsCharCount,
  rawKeyStrokes,
  wpmKeyStrokes,
  setIncorrectCharsCount,
  incorrectCharsCount,
}: TestStatsProps) => {
  const roundedWpm = Math.round(
    (wpmKeyStrokes / 5 / (countDownConstant - countDown)) * 60.0,
  );

  const roundedRawWpm = Math.round(
    (rawKeyStrokes / 5 / (countDownConstant - countDown)) * 60.0,
  );

  const [typingTestHistory, setTypingTestHistory] = useState(
    initialTypingTestHistory,
  );

  const language = "ENGLISH_MODE";

  const accuracy = Math.round(statsCharCount[0]);

  const data = typingTestHistory.map((history) => {
    return {
      wpm: history.wpm,
      rawWpm: history.rawWpm,
      time: history.time,
      error: history.error,
    };
  });

  useEffect(() => {
    if (status === "started") {
      setTypingTestHistory(initialTypingTestHistory);
    }
  }, [status]);

  useEffect(() => {
    if (status === "started" && countDown < countDownConstant) {
      let shouldRecord = false;
      let increment = 1;

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

      if (shouldRecord) {
        const newTime = typingTestHistory.length * increment;

        setTypingTestHistory((prevTypingTestHistory) => [
          ...prevTypingTestHistory,
          {
            wpm: roundedWpm,
            rawWpm: roundedRawWpm,
            time: newTime,
            error: incorrectCharsCount,
          },
        ]);

        setIncorrectCharsCount(0);
      }
    }
  }, [countDown]);

  return (
    <>
      {status !== "finished" && status !== "waiting" && (
        <>
          <h3 className="text-blue-500 text-xl">{countDown}</h3>
          <h3 className="text-blue-500 text-xl">WPM: {Math.round(wpm)}</h3>
        </>
      )}

      {status === "finished" && (
        <div className="flex items-center justify-center flex-col">
          <section>
            <div>
              <div>
                <h2 className="text-3xl font-bold dark:text-white/[0.2]">
                  WPM
                </h2>
                <h1>
                  {Math.round(
                    data.map((e) => e.wpm).reduce((a, b) => a + b, 0) /
                      (data.length - 1),
                  )}
                </h1>
              </div>
            </div>
          </section>
          <section></section>
        </div>
      )}
    </>
  );
};
