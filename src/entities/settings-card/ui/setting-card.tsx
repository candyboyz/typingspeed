"use client";

import { Icon } from "@/shared/ui/icon";
import { type icons } from "lucide-react";
import { ConfigStateParams } from "../model/types";
import { useConfigStore } from "../model/store";
import { cn } from "@/shared/lib/utils";
import { useTheme } from "next-themes";
import { memo } from "react";

export interface SettingCardProps {
  name: keyof ConfigStateParams | "theme";
  title: {
    icon: keyof typeof icons;
    text: React.ReactNode;
  };
  description: React.ReactNode;
  inputs: {
    values: (
      | ConfigStateParams[keyof ConfigStateParams]
      | "light"
      | "dark"
      | "system"
    )[];
    type: "button" | "input";
    placeholder?: string;
  };
}

const SettingCard = ({
  name,
  title,
  description,
  inputs,
}: SettingCardProps) => {
  const { change, ...store } = useConfigStore();
  const { theme, setTheme } = useTheme();

  return (
    <section className="flex justify-between flex-col md:flex-row items-center gap-2">
      {/* Content Box Start */}
      <div className="flex flex-col gap-3">
        {/* Title Start */}
        <div className="flex items-center gap-2 dark:text-white/[0.2] text-black/[0.4] text-xl md:text-2xl font-semibold">
          <Icon
            name={title.icon}
            size={20}
            className="stroke-current stroke-[2.5px]"
          />
          <span>{title.text}</span>
        </div>
        {/* Title End */}

        {/* Description Start */}
        <div className="dark:text-white/[0.8] text-black/[0.7] break-words hyphens-auto w-full">
          {description}
        </div>
        {/* Description End */}
      </div>
      {/* Content Box End */}

      {/* Inputs Box Start */}
      <div className="md:max-w-[50%] w-full">
        <div className="flex items-center justify-between w-full gap-4">
          {inputs.values.map((val) => {
            if (inputs.type === "button") {
              if (name === "theme") {
                return (
                  <button
                    onClick={() => setTheme(val as keyof typeof theme)}
                    key={"theme." + val}
                    className={cn(
                      "px-6 h-[40px] dark:bg-white/[0.2] bg-black/[0.2] w-full rounded-xl text-lg transition-all items-center justify-center flex",
                      theme === val
                        ? "dark:bg-blue-500 bg-blue-500 cursor-default text-white"
                        : "dark:hover:bg-white/[0.3] hover:bg-black/[0.3]",
                    )}>
                    {val}
                  </button>
                );
              }
              return (
                <button
                  onClick={() =>
                    change(
                      name as keyof ConfigStateParams,
                      val as ConfigStateParams[keyof ConfigStateParams],
                    )
                  }
                  key={name + val}
                  className={cn(
                    "px-6 h-[40px] dark:bg-white/[0.2] bg-black/[0.2] w-full rounded-xl text-lg transition-all",
                    store[name as keyof ConfigStateParams] === val
                      ? "dark:bg-blue-500 bg-blue-500 cursor-default text-white"
                      : "dark:hover:bg-white/[0.3] hover:bg-black/[0.3]",
                  )}>
                  {val}
                </button>
              );
            }

            if (inputs.type === "input") {
              return (
                <input
                  key={name + val}
                  type="number"
                  className="px-6 h-[40px] dark:bg-white/[0.2] bg-black/[0.2] w-full rounded-xl text-lg transition-all border-none dark:placeholder:text-white/[0.3] placeholder:text-black/[0.3]"
                  placeholder={inputs.placeholder}
                  min={1}
                  max={500}
                  value={store[name as keyof ConfigStateParams] as number}
                  onChange={(e) =>
                    change(
                      name as keyof ConfigStateParams,
                      parseInt(e.target.value),
                    )
                  }
                />
              );
            }
          })}
        </div>
      </div>
      {/* Inputs Box End */}
    </section>
  );
};

export default memo(SettingCard);
