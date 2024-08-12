"use client";

import { useTypingSettings } from "@/features/typing-settings";
import { DIFFICULTS, PARAMS_SETTINGS, TIMES } from "@/shared/constants";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { RotateCcw, Undo } from "lucide-react";

interface TypingSettingsProps {
  status: "waiting" | "started" | "finished";
  reset: (isRedo: boolean) => void;
}

export const TypingSettings = ({ status, reset }: TypingSettingsProps) => {
  const {
    time,
    difficult,
    numbers,
    punctuation,
    handleChangeTime,
    handleChangeDifficult,
    handleToggleParam,
  } = useTypingSettings();

  return (
    <section className="flex flex-col items-center justify-center gap-2 mt-8">
      <div className="flex items-center gap-1">
        <Button
          size={"icon"}
          onClick={() => reset(true)}
          title="redo"
          className="dark:hover:bg-white/[0.05] hover:bg-black/[0.05] p-1.5 rounded-full transition-all text-zinc-600 hover:text-blue-500">
          <Undo size={20} />
        </Button>
        <Button
          size={"icon"}
          onClick={() => reset(false)}
          title="restart"
          className="dark:hover:bg-white/[0.05] hover:bg-black/[0.05] p-1.5 rounded-full transition-all text-zinc-600 hover:text-blue-500">
          <RotateCcw size={20} />
        </Button>
      </div>
      {status === "waiting" && (
        <>
          <div className="flex items-center gap-1">
            {TIMES.map((val) => (
              <Button
                key={"time." + val}
                size={"sm"}
                onClick={() => handleChangeTime(val)}
                title={`time ${val}`}
                className={cn(
                  "p-1.5 rounded-full text-zinc-600 w-8 text-base",
                  time === val
                    ? "text-blue-500"
                    : "dark:hover:bg-white/[0.05] hover:bg-black/[0.05] transition-all hover:text-blue-500",
                )}>
                {val}
              </Button>
            ))}
          </div>
          <div className="flex items-center">
            {DIFFICULTS.map((val) => (
              <Button
                key={"difficult." + val}
                size={"sm"}
                onClick={() => handleChangeDifficult(val)}
                title={"difficult " + val}
                className={cn(
                  "p-1.5 transition-all",
                  difficult === val
                    ? "text-blue-500"
                    : "text-zinc-600 hover:text-blue-500",
                )}>
                {val}
              </Button>
            ))}
            {PARAMS_SETTINGS.map((val) => (
              <Button
                key={"params." + val.text}
                size={"sm"}
                onClick={() => handleToggleParam(val.text)}
                title={val.text}
                className={cn(
                  "p-1.5 transition-all flex items-center gap-0.5",
                  (punctuation && val.text === "punctuation") ||
                    (numbers && val.text === "numbers")
                    ? "text-blue-500"
                    : "text-zinc-600 hover:text-blue-500",
                )}>
                <span>{val.icon}</span>
                <span>{val.text}</span>
              </Button>
            ))}
          </div>
        </>
      )}
    </section>
  );
};
