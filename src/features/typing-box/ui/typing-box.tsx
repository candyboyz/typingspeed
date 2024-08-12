"use client";

import { cn } from "@/shared/lib/utils";
import { useTypingBox } from "@/features/typing-box";
import { TypingSettings } from "@/features/typing-settings";
import { TypingStats } from "@/features/typing-stats";

const TypingBox = () => {
  const {
    status,
    time,
    countDown,
    wpm,
    statsCharCount,
    rawKeyStrokes,
    wpmKeyStrokes,
    incorrectCharsCount,
    setIncorrectCharsCount,
    handleInputFocus,
    handleKeyDown,
    handleKeyUp,
    updateInput,
    getCharClassName,
    getWordClassName,
    getExtraCharsDisplay,
    reset,
    textInputRef,
    wordsSpanRef,
    currInput,
    currentWords,
  } = useTypingBox();

  return (
    <>
      <section
        className="flex flex-col justify-center mt-10"
        onClick={handleInputFocus}
        style={{ height: status !== "finished" ? "40%" : "auto" }}>
        <div className="px-2 flex max-w-[1000px] w-full mx-auto flex-col gap-2">
          <TypingStats
            status={status}
            wpm={wpm}
            countDown={countDown}
            countDownConstant={time}
            statsCharCount={statsCharCount}
            rawKeyStrokes={rawKeyStrokes}
            wpmKeyStrokes={wpmKeyStrokes}
            setIncorrectCharsCount={setIncorrectCharsCount}
            incorrectCharsCount={incorrectCharsCount}
          />
        </div>
        {status !== "finished" && (
          <div
            className="block max-w-[1000px] h-[140px] overflow-hidden m-[0_auto] relative w-full"
            style={{
              marginTop: status === "waiting" ? "64px" : "",
            }}>
            <div className="text-[28px] dark:text-white/[0.3] text-black/[0.3] flex flex-wrap w-full items-center select-none">
              {currentWords.map((word, i) => {
                return (
                  <span
                    key={i}
                    ref={wordsSpanRef[i]}
                    className={cn(
                      "mx-[5px] flex pr-[2px] border-b border-b-transparent border-t border-t-transparent scroll-m-1",
                      getWordClassName(i),
                    )}>
                    {word.split("").map((char: string, idx: number) => (
                      <span
                        key={"word" + idx}
                        className={getCharClassName(i, idx, char, word)}>
                        {char}
                      </span>
                    ))}
                    {getExtraCharsDisplay(word, i)}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <input
          key="hidden-input"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          list="autocompleteOff"
          ref={textInputRef}
          type="text"
          className="hidden-input absolute -top-80"
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          value={currInput}
          onChange={updateInput}
        />
      </section>
      <TypingSettings status={status} reset={reset} />
    </>
  );
};

export default TypingBox;
