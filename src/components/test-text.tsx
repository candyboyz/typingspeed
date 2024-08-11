"use client";

import { cn } from "@/shared/lib/utils";
import { wordsGenerator } from "@/shared/lib/wordsGenerator";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { TestStats } from "./test-stats";

interface TestTextProps {
  isFocusedMode: boolean;
  textInputRef: React.RefObject<HTMLInputElement>;
  handleInputFocus: () => void;
}

const PACING_PULSE = "pulse";
const PACING_CARET = "caret";

export const TestText = ({
  isFocusedMode,
  textInputRef,
  handleInputFocus,
}: TestTextProps) => {
  const [pacingStyle, setPacingStyle] = useState(PACING_PULSE);

  const [incorrectCharsCount, setIncorrectCharsCount] = useState(0);

  const [itemsToRender, setItemsToRender] = useState(40);

  const [isCapsLock, setIsCapsLock] = useState(false);

  const [openRestart, setOpenRestart] = useState(false);

  const [wordsDict, setWordsDict] = useState(() => {
    return wordsGenerator(200, "normal", "ENGLISH_MODE", false, false);
  });

  const words = useMemo(() => wordsDict.map((e) => e.val), [wordsDict]);
  const wordsKey = useMemo(() => wordsDict.map((e) => e.key), [wordsDict]);

  const wordsSpanRef = useMemo(
    () =>
      Array(words.length)
        .fill(0)
        .map((i) => React.createRef<HTMLSpanElement>()),
    [words],
  );

  const [countDown, setCountDown] = useState(60);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const [status, setStatus] = useState("waiting");

  const menuEnabled = useMemo(
    () => !isFocusedMode || status === "finished",
    [isFocusedMode, status],
  );

  const [currInput, setCurrInput] = useState("");

  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [prevInput, setPrevInput] = useState("");

  const [wordsCorrect, setWordsCorrect] = useState(new Set());
  const [wordsInCorrect, setWordsInCorrect] = useState(new Set());
  const [inputWordsHistory, setInputWordsHistory] = useState<{
    [key: number | string]: string;
  }>({});

  const [rawKeyStrokes, setRawKeyStrokes] = useState(0);
  const [wpmKeyStrokes, setWpmKeyStrokes] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [statsCharCount, setStatsCharCount] = useState<number[]>([]);

  const [history, setHistory] = useState<{
    [key: number | string]: string | number | boolean | undefined;
  }>({});
  const keyString = useMemo(
    () => `${currWordIndex}.${currCharIndex}`,
    [currWordIndex, currCharIndex],
  );
  const [currChar, setCurrChar] = useState("");

  useEffect(() => {
    if (currWordIndex === 200 - 1) {
      const generate = wordsGenerator(
        200,
        "normal",
        "ENGLISH_MODE",
        false,
        false,
      );
      setWordsDict((prev) => [...prev, ...generate]);
    }

    if (
      currWordIndex !== 0 &&
      wordsSpanRef[currWordIndex].current?.offsetLeft! <
        wordsSpanRef[currWordIndex - 1].current?.offsetLeft!
    ) {
      wordsSpanRef[currWordIndex - 1].current?.scrollIntoView();
    } else {
      return;
    }
  }, [currWordIndex, wordsSpanRef]);

  const start = () => {
    if (status === "finished") {
      setCurrInput("");
      setPrevInput("");
      setCurrWordIndex(0);
      setCurrCharIndex(-1);
      setCurrChar("");
      setHistory({});
      setInputWordsHistory({});
      setWordsCorrect(new Set());
      setWordsInCorrect(new Set());
      setStatus("waiting");
      textInputRef.current?.focus();
    }

    if (status !== "started") {
      setStatus("started");
      let intervalId = setInterval(() => {
        setCountDown((prev) => {
          if (prev === 0) {
            clearInterval(intervalId);

            const currCharExtraCount = Object.values(history)
              .filter((e) => typeof e === "number")
              .reduce((a, b) => a + b, 0);

            const currCharCorrectCount = Object.values(history).filter(
              (e) => e,
            ).length;

            const currCharInCorrectCount = Object.values(history).filter(
              (e) => !e,
            ).length;

            const currCharMissingCount = Object.values(history).filter(
              (e) => e === undefined,
            ).length;

            const currCharAdvancedCount =
              currCharCorrectCount +
              currCharMissingCount +
              currCharInCorrectCount;

            const accuracy =
              currCharCorrectCount === 0
                ? 0
                : (currCharCorrectCount / currCharAdvancedCount) * 100;

            setStatsCharCount([
              accuracy,
              currCharCorrectCount,
              currCharInCorrectCount,
              currCharMissingCount,
              currCharAdvancedCount,
              currCharExtraCount,
            ]);

            checkPrev();
            setStatus("finished");

            return 60;
          } else {
            return prev - 1;
          }
        });
      }, 1000);
      setIntervalId(intervalId);
    }
  };

  const updateInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (status === "finished") {
      return;
    }

    setCurrInput(e.target.value);
    inputWordsHistory[currWordIndex] = e.target.value.trim();
    setInputWordsHistory(inputWordsHistory);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLock(e.getModifierState("CapsLock"));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    const keyCode = e.keyCode;
    setIsCapsLock(e.getModifierState("CapsLock"));

    if (status === "started") {
      setRawKeyStrokes(rawKeyStrokes + 1);
      if (keyCode >= 59 && keyCode <= 90) {
        setWpmKeyStrokes(wpmKeyStrokes + 1);
      }
    }

    if (keyCode === 20) {
      e.preventDefault();
      return;
    }

    if (keyCode >= 16 && keyCode <= 18) {
      e.preventDefault();
      return;
    }

    if (status === "finished") {
      setCurrInput("");
      setPrevInput("");
      return;
    }

    if (wpmKeyStrokes !== 0 && 60 - countDown !== 0) {
      const currWpm = (wpmKeyStrokes / 5 / (60 - countDown)) * 60.0;
      setWpm(currWpm);
    }

    if (status !== "started" && status !== "finished") {
      start();
    }

    if (keyCode === 32) {
      const prevCorrectness = checkPrev();

      if (prevCorrectness === true || prevCorrectness === false) {
        if (
          words[currWordIndex].split("").length > currInput.split("").length
        ) {
          setIncorrectCharsCount((prev) => prev + 1);
        }

        setCurrInput("");
        setCurrWordIndex(currWordIndex + 1);
        setCurrCharIndex(-1);
        return;
      } else {
        return;
      }
    } else if (keyCode === 8) {
      delete history[keyString];

      if (currCharIndex < 0) {
        if (wordsInCorrect.has(currWordIndex - 1)) {
          const prevInputWord = inputWordsHistory[currWordIndex - 1];

          setCurrInput(prevInputWord + " ");
          setCurrCharIndex(prevInputWord.length - 1);
          setCurrWordIndex(currWordIndex - 1);
          setPrevInput(prevInputWord);
        }
        return;
      }

      setCurrCharIndex(currCharIndex - 1);
      setCurrChar("");
      return;
    } else {
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
      return;
    }
  };

  const getExtraCharClassName = (i: number, idx: number, extra: string[]) => {
    if ("carret" && currWordIndex === i && idx === extra.length - 1) {
      return "caret-extra-char-right-error";
    }
    return "error-char";
  };

  const getExtraCharsDisplay = (word: string, i: number) => {
    let input = inputWordsHistory[i];
    if (!input) {
      input = currInput.trim();
    }
    if (i > currWordIndex) {
      return null;
    }
    if (input.length <= word.length) {
      return null;
    } else {
      const extra = input.slice(word.length, input.length).split("");
      history[i] = extra.length;
      return extra.map((c: string, idx: number) => (
        <span key={idx} className={getExtraCharClassName(i, idx, extra)}>
          {c}
        </span>
      ));
    }
  };

  const checkPrev = () => {
    const wordToCompare = words[currWordIndex];
    const currInputWithoutSpaces = currInput.trim();
    const isCorrect = wordToCompare === currInputWithoutSpaces;
    if (!currInputWithoutSpaces || currInputWithoutSpaces.length === 0) {
      return null;
    }
    if (isCorrect) {
      wordsCorrect.add(currWordIndex);
      wordsInCorrect.delete(currWordIndex);
      const inputWordsHistoryUpdate = { ...inputWordsHistory };
      inputWordsHistoryUpdate[currWordIndex] = currInputWithoutSpaces;
      setInputWordsHistory(inputWordsHistoryUpdate);
      setPrevInput("");

      setWpmKeyStrokes(wpmKeyStrokes + 1);
      return true;
    } else {
      wordsInCorrect.add(currWordIndex);
      wordsCorrect.delete(currWordIndex);
      const inputWordsHistoryUpdate = { ...inputWordsHistory };
      inputWordsHistoryUpdate[currWordIndex] = currInputWithoutSpaces;
      setInputWordsHistory(inputWordsHistoryUpdate);
      setPrevInput(prevInput + " " + currInputWithoutSpaces);
      return false;
    }
  };

  const getWordClassName = (wordIdx: number) => {
    if (wordsInCorrect.has(wordIdx)) {
      if (currWordIndex === wordIdx) {
        if (pacingStyle === PACING_PULSE) {
          return "word error-word active-word";
        } else {
          return "word error-word active-word-no-pulse";
        }
      }
      return "word error-word";
    } else {
      if (currWordIndex === wordIdx) {
        if (pacingStyle === PACING_PULSE) {
          return "word active-word";
        } else {
          return "word active-word-no-pulse";
        }
      }
      return "word";
    }
  };

  useEffect(() => {
    if (status !== "started") return;
    const word = words[currWordIndex];
    const char = word.split("")[currCharIndex];

    if (char !== currChar && char !== undefined)
      return setIncorrectCharsCount((prev) => prev + 1);
  }, [currChar, status, currCharIndex]);

  useEffect(() => {
    // console.log("incorrectCharsCount:", incorrectCharsCount);
  }, [incorrectCharsCount]);

  const getCharClassName = (
    wordIdx: number,
    charIdx: number,
    char: string,
    word: string,
  ) => {
    const keyString = wordIdx + "." + charIdx;
    if (
      pacingStyle === PACING_CARET &&
      wordIdx === currWordIndex &&
      charIdx === currCharIndex + 1 &&
      status !== "finished"
    ) {
      return "caret-char-left";
    }
    if (history[keyString] === true) {
      if (
        pacingStyle === PACING_CARET &&
        wordIdx === currWordIndex &&
        word.length - 1 === currCharIndex &&
        charIdx === currCharIndex &&
        status !== "finished"
      ) {
        return "caret-char-right-correct";
      }
      return "correct-char";
    }
    if (history[keyString] === false) {
      if (
        pacingStyle === PACING_CARET &&
        wordIdx === currWordIndex &&
        word.length - 1 === currCharIndex &&
        charIdx === currCharIndex &&
        status !== "finished"
      ) {
        return "caret-char-right-error";
      }

      return "error-char";
    }
    if (
      wordIdx === currWordIndex &&
      charIdx === currCharIndex &&
      currChar &&
      status !== "finished"
    ) {
      if (char === currChar) {
        history[keyString] = true;
        return "correct-char";
      } else {
        history[keyString] = false;
        return "error-char";
      }
    } else {
      if (wordIdx < currWordIndex) {
        // missing chars
        history[keyString] = undefined;
      }

      return "char";
    }
  };

  const getDifficultyButtonClassName = (buttonDifficulty: string) => {
    if ("normal" === buttonDifficulty) {
      return "active-button";
    }
    return "inactive-button";
  };

  const getAddOnButtonClassName = (addon: boolean) => {
    if (addon) {
      return "active-button";
    }
    return "inactive-button";
  };

  const getPacingStyleButtonClassName = (buttonPacingStyle: string) => {
    if ("carret" === buttonPacingStyle) {
      return "active-button";
    }
    return "inactive-button";
  };

  const getTimerButtonClassName = (buttonTimerCountDown: number) => {
    if (60 === buttonTimerCountDown) {
      return "active-button";
    }
    return "inactive-button";
  };

  const getLanguageButtonClassName = (buttonLanguage: string) => {
    if ("ENGLISH_MODE" === buttonLanguage) {
      return "active-button";
    }
    return "inactive-button";
  };

  const startIndex = 0;

  const endIndex = startIndex + itemsToRender;

  const currentWords = words.slice(startIndex, endIndex);

  useEffect(() => {
    const distanceToEnd = currentWords.length - 1 - currWordIndex;

    if (distanceToEnd === 20) {
      setItemsToRender((prev) => prev + 20);
    }
  }, [currWordIndex]);

  return (
    <section
      className="flex flex-col justify-center"
      onClick={handleInputFocus}
      style={{ height: status !== "finished" ? "80%" : "auto" }}>
      <div className="px-2 flex flex-col gap-2">
        <TestStats
          status={status}
          wpm={wpm}
          countDown={countDown}
          countDownConstant={60}
          statsCharCount={statsCharCount}
          rawKeyStrokes={rawKeyStrokes}
          wpmKeyStrokes={wpmKeyStrokes}
          setIncorrectCharsCount={setIncorrectCharsCount}
          incorrectCharsCount={incorrectCharsCount}
        />
      </div>
      <div
        className="block max-w-[1000px] h-[140px] overflow-hidden m-[0_auto] relative w-full"
        style={{
          visibility: status === "finished" ? "hidden" : "visible",
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
      <div className="stats"></div>
      <input
        key="hidden-input"
        ref={textInputRef}
        type="text"
        className="hidden-input"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        value={currInput}
        onChange={updateInput}
      />
    </section>
  );
};

// export const TestText = () => {
//   const selectText =
//     "слайсы не могут использовать другие слайсы на том же слое и это обеспечивает сильную связанность кода внутри слайса и слабую сцепленность между слайсами";

//   // const currentText = useRef<string>("");
//   const [currentText, setCurrentText] = useState("");

//   const words1 = wordsGenerator(200, "normal", "ENGLISH_MODE", false, false);

//   useEffect(() => {
//     const handleKeyUp = (e: KeyboardEvent) => {
//       if (
//         e.key.toLowerCase().includes("shift") ||
//         e.key.toLowerCase().includes("caps") ||
//         e.key.toLowerCase().includes("tab") ||
//         e.key.toLowerCase().includes("control")
//       )
//         return;
//       const isBackspace = e.key === "Backspace";
//       if (isBackspace) {
//         setCurrentText((prev) => prev.slice(0, prev.length - 1));
//       } else {
//         setCurrentText((prev) => prev + e.key);
//       }
//       console.log(e);
//     };

//     window.addEventListener("keyup", handleKeyUp);

//     return () => window.removeEventListener("keyup", handleKeyUp);
//   }, [currentText]);

//   return (
//     <section className="mt-40">
//       <div
//         className="game relative h-[120px] overflow-hidden leading-9 px-12 group focus:outline-none"
//         tabIndex={0}>
//         {selectText.split("").map((char, index) => {
//           return (
//             <span
//               className={cn(
//                 "text-[28px] dark:text-white/[0.3]",
//                 char === currentText[index] && "dark:text-white text-black",
//                 char !== currentText[index] &&
//                   currentText[index] !== undefined &&
//                   "dark:text-red-500 text-red-500",
//               )}
//               key={index}>
//               {/* {index === currentText.length && ('
//                 <span className="text-blue-400 absolute -ml-2 animate-blink">
//                   |
//                 </span>
//               )} */}
//               {char}
//               {selectText[index + 1] === " "}
//             </span>
//           );
//         })}
//         {/* {words.map((word, index) => {
//           return (
//             <div
//               id="word"
//               className={`inline-block mr-[5px] text-[28px] dark:text-white/[0.2]`}
//               key={`random_word_${index}_${word}`}>
//               {word?.split("").map((letter, id) => {
//                 return (
//                   <span id="letter" key={`letter_${index}_${letter}`}>
//                     {letter}
//                   </span>
//                 );
//               })}
//             </div>
//           );
//         })} */}
//         {/* <div className="cursor w-[2px] h-[26px] bg-blue-400 fixed top-[246px] left-[60px] rounded-full animate-blink group-focus:block hidden" /> */}
//         {/* <div className="absolute inset-0 text-[24px] text-center tracking-widest pt-[38px] w-full dark:bg-[#1a1a1a]/[0.80] backdrop-blur-sm group-focus:bg-transparent group-focus:backdrop-blur-none transition-all group-focus:hidden">
//           Нажмите чтобы начать
//         </div> */}
//       </div>
//     </section>
//   );
// };

const wordsArray = [
  "здравствуй",
  "мир",
  "кот",
  "собака",
  "дерево",
  "лес",
  "море",
  "небо",
  "солнце",
  "луна",
  "звезда",
  "дождь",
  "снег",
  "ветер",
  "земля",
  "гора",
  "река",
  "озеро",
  "птица",
  "рыба",
  "цветок",
  "трава",
  "дом",
  "улица",
  "машина",
  "велосипед",
  "самолет",
  "поезд",
  "корабль",
  "человек",
  "ребенок",
  "женщина",
  "мужчина",
  "старик",
  "девочка",
  "мальчик",
  "учитель",
  "ученик",
  "друг",
  "враг",
  "любовь",
  "радость",
  "грусть",
  "страх",
  "смех",
  "слезы",
  "жизнь",
  "смерть",
  "время",
  "вечность",
  "день",
  "ночь",
  "утро",
  "вечер",
  "секунда",
  "минута",
  "час",
  "год",
  "век",
  "миллион",
  "счастье",
  "беда",
  "тревога",
  "мир",
  "война",
  "победа",
  "поражение",
  "работа",
  "отдых",
  "праздник",
  "игра",
  "музыка",
  "книга",
  "фильм",
  "картина",
  "театр",
  "песня",
  "танец",
  "спорт",
  "путешествие",
  "еда",
  "вода",
  "хлеб",
  "мясо",
  "овощи",
  "фрукты",
  "сладости",
  "напитки",
  "чай",
  "кофе",
  "город",
  "деревня",
  "страна",
  "мир",
  "континент",
  "океан",
  "завод",
  "офис",
  "школа",
  "университет",
  "болезнь",
  "здоровье",
  "лекарство",
  "больница",
  "врач",
  "пациент",
  "диагноз",
  "лечение",
  "терапия",
  "операция",
  "дружба",
  "любовь",
  "семья",
  "дети",
  "родители",
  "сестра",
  "брат",
  "бабушка",
  "дедушка",
  "дядя",
  "тетя",
  "деньги",
  "богатство",
  "бедность",
  "успех",
  "неудача",
  "талант",
  "работа",
  "карьера",
  "бизнес",
  "мечта",
  "цель",
  "желание",
  "надежда",
  "верность",
  "доброта",
  "честность",
  "смелость",
  "храбрость",
  "сила",
  "воля",
  "интеллект",
  "знание",
  "опыт",
  "мудрость",
  "учеба",
  "наука",
  "исследование",
  "техника",
  "технология",
  "компьютер",
  "интернет",
  "телефон",
  "соцсеть",
  "программа",
  "сайт",
  "блог",
  "видео",
  "фото",
  "игра",
  "проект",
  "команда",
  "лидер",
  "успех",
  "провал",
  "выбор",
  "решение",
  "план",
  "цель",
  "задача",
  "сила",
  "воля",
  "характер",
  "дружба",
  "доверие",
  "предательство",
  "зависть",
  "радость",
  "грусть",
  "чувство",
  "эмоция",
  "покой",
  "беспокойство",
  "уверенность",
  "сомнение",
  "страх",
  "смех",
  "улыбка",
  "слезы",
  "гнев",
  "ярость",
  "месть",
  "прощение",
  "справедливость",
  "обман",
  "правда",
  "ложь",
  "истина",
  "забота",
  "внимание",
  "интерес",
  "скука",
  "удовольствие",
  "наслаждение",
  "разочарование",
  "надежда",
  "вера",
  "духовность",
  "религия",
  "бог",
  "судьба",
  "случай",
  "удача",
  "неудача",
  "шанс",
  "выбор",
  "решение",
  "план",
  "мечта",
  "цель",
  "любовь",
  "дружба",
  "семья",
  "дети",
  "родители",
  "жена",
  "муж",
  "брат",
  "сестра",
  "родственники",
  "карьера",
  "работа",
  "успех",
  "деньги",
  "богатство",
  "бедность",
  "счастье",
  "страдание",
  "забота",
  "здоровье",
  "время",
  "жизнь",
  "смерть",
  "вечность",
  "минуты",
  "секунды",
  "часы",
  "дни",
  "недели",
  "годы",
  "природа",
  "весна",
  "лето",
  "осень",
  "зима",
  "снег",
  "дождь",
  "солнце",
  "луна",
  "звезды",
  "небо",
  "земля",
  "гора",
  "река",
  "озеро",
  "море",
  "океан",
  "лес",
  "дерево",
  "цветок",
  "трава",
  "птица",
  "рыба",
  "животное",
  "насекомое",
  "мир",
  "вселенная",
  "планета",
  "звезда",
  "галактика",
  "солнечная система",
  "космос",
  "атом",
  "молекула",
  "клетка",
  "организм",
  "человек",
  "разум",
  "сознание",
  "мысль",
  "идея",
  "теория",
  "практика",
  "опыт",
  "эксперимент",
  "наука",
  "техника",
  "технология",
  "инновация",
  "изобретение",
  "машина",
  "инструмент",
  "устройство",
  "механизм",
  "робот",
  "компьютер",
  "программа",
  "интернет",
  "сеть",
  "данные",
  "информация",
  "знание",
  "мудрость",
  "ученый",
  "исследователь",
  "изобретатель",
  "инженер",
  "доктор",
  "учитель",
  "профессор",
  "студент",
  "ученик",
  "школа",
  "университет",
  "академия",
  "исследование",
  "эксперимент",
  "наблюдение",
  "результат",
  "вывод",
  "знание",
  "умение",
  "навык",
  "опыт",
  "работа",
  "труд",
  "усилие",
  "достижение",
  "успех",
  "провал",
  "деньги",
  "капитал",
  "инвестиция",
  "бизнес",
  "компания",
  "фирма",
  "проект",
  "прибыль",
  "убыток",
  "стоимость",
  "цена",
  "товар",
  "услуга",
  "продажа",
  "покупка",
  "рынок",
  "экономика",
  "финансы",
  "банки",
  "кредит",
  "долг",
  "депозит",
  "валюта",
  "курс",
  "инфляция",
  "дефляция",
  "рынок",
  "экономика",
  "бизнес",
  "компания",
  "прибыль",
  "доход",
  "расход",
  "бюджет",
  "налог",
  "пошлина",
  "субсидия",
  "дотация",
  "инвестиция",
  "капитал",
  "акция",
  "облигация",
  "фонд",
  "банк",
  "страхование",
  "ипотека",
  "кредит",
  "долг",
  "банкротство",
  "сбережения",
  "пенсия",
  "зарплата",
  "доход",
  "расход",
  "инфляция",
  "дефляция",
  "налог",
  "бюджет",
  "экономия",
  "инвестиция",
  "бизнес",
  "компания",
  "прибыль",
  "доход",
  "расход",
  "банк",
  "кредит",
  "ипотека",
  "страхование",
  "сбережения",
  "пенсия",
  "зарплата",
  "доход",
  "расход",
  "инфляция",
  "дефляция",
  "налог",
  "бюджет",
  "экономия",
  "инвестиция",
  "бизнес",
  "компания",
  "прибыль",
  "доход",
  "расход",
  "банк",
  "кредит",
  "ипотека",
  "страхование",
  "сбережения",
  "пенсия",
  "зарплата",
  "доход",
  "расход",
  "инфляция",
  "дефляция",
  "налог",
  "бюджет",
  "экономия",
  "инвестиция",
];

const randomWord = () => {
  const randomIndex = Math.ceil(Math.random() * wordsArray.length);
  return wordsArray[randomIndex - 1];
};
