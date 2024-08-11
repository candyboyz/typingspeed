"use client";

import { cn } from "@/shared/lib/utils";
import { useConfigStore } from "@/store/store-config";
import { RotateCcw, Undo } from "lucide-react";
import React from "react";

const times = [15, 30, 60, 120];
const difficults: ("normal" | "hard")[] = ["normal", "hard"];
const params: { icon: string; text: "numbers" | "punctuation" }[] = [
  { icon: "#", text: "numbers" },
  { icon: "@", text: "punctuation" },
];

interface TestSettingsProps {
  reset: (isRedo: boolean) => void;
}

export const TestSettings = ({ reset }: TestSettingsProps) => {
  const { time, difficult, numbers, punctuation, change } = useConfigStore();

  return (
    <section className="flex flex-col items-center justify-center gap-2">
      <div className="flex items-center gap-1">
        <button
          onClick={() => reset(true)}
          className="dark:hover:bg-white/[0.05] hover:bg-black/[0.05] p-1.5 rounded-full transition-all text-zinc-600 hover:text-blue-500"
          title="Вернуть как было">
          <Undo size={20} />
        </button>
        <button
          onClick={() => reset(false)}
          className="dark:hover:bg-white/[0.05] hover:bg-black/[0.05] p-1.5 rounded-full transition-all text-zinc-600 hover:text-blue-500"
          title="Рестарт">
          <RotateCcw size={20} />
        </button>
      </div>
      <div className="flex items-center gap-1">
        {times.map((val) => (
          <button
            key={"time." + val}
            onClick={() => change("time", val)}
            className={cn(
              "p-1.5 rounded-full text-zinc-600 w-8 h-8 flex items-center justify-center",
              time === val
                ? "text-blue-500"
                : "dark:hover:bg-white/[0.05] hover:bg-black/[0.05] transition-all hover:text-blue-500",
            )}
            title={`Кол-во времени ${val}`}>
            {val}
          </button>
        ))}
      </div>
      <div className="flex items-center">
        {difficults.map((val) => (
          <button
            key={"difficult." + val}
            onClick={() => change("difficult", val)}
            className={cn(
              "p-1.5 transition-all",
              difficult === val
                ? "text-blue-500"
                : "text-zinc-600 hover:text-blue-500",
            )}
            title={val}>
            {val}
          </button>
        ))}
        {params.map((val) => (
          <button
            key={"params." + val.text}
            onClick={() =>
              change(
                val.text,
                val.text === "punctuation"
                  ? !punctuation
                  : val.text === "numbers"
                  ? !numbers
                  : false,
              )
            }
            className={cn(
              "p-1.5 transition-all flex items-center gap-0.5",
              (punctuation && val.text === "punctuation") ||
                (numbers && val.text === "numbers")
                ? "text-blue-500"
                : "text-zinc-600 hover:text-blue-500",
            )}
            title={val.text}>
            <span>{val.icon}</span>
            <span>{val.text}</span>
          </button>
        ))}
      </div>
    </section>
  );
};
