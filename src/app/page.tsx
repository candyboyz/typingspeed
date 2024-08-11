"use client";

import Image from "next/image";
import { User, Settings } from "lucide-react";
import { TestText } from "@/components/test-text";
import { useCallback, useRef, useState } from "react";

const HomePage = () => {
  const [isFocusedMode, setIsFocusedMode] = useState(true);

  const textInputRef = useRef<HTMLInputElement>(null);
  const focusTextInput = useCallback(
    () => textInputRef.current && textInputRef.current.focus(),
    [textInputRef],
  );

  return (
    <>
      <header className="h-[80px] max-w-[1440px] mx-auto w-full flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Image src="logo.svg" width={60} height={45} alt="Typing Speed" />
          <h1 className="font-bold text-2xl">typingspeed</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="dark:hover:bg-white/[0.05] p-1.5 rounded-full transition-all text-zinc-600 hover:text-current"
            title="Настройки">
            <Settings size={20} />
          </button>
          <button
            className="dark:hover:bg-white/[0.05] p-1.5 rounded-full transition-all text-zinc-600 hover:text-current"
            title="Профиль">
            <User size={20} />
          </button>
        </div>
      </header>
      <main className="w-full h-[calc(100vh-80px)] max-w-[1440px] mx-auto px-4 flex justify-center">
        <TestText
          textInputRef={textInputRef}
          isFocusedMode={isFocusedMode}
          handleInputFocus={focusTextInput}
        />
      </main>
    </>
  );
};

export default HomePage;

// const wordsArray = [
//   "здравствуй",
//   "мир",
//   "кот",
//   "собака",
//   "дерево",
//   "лес",
//   "море",
//   "небо",
//   "солнце",
//   "луна",
//   "звезда",
//   "дождь",
//   "снег",
//   "ветер",
//   "земля",
//   "гора",
//   "река",
//   "озеро",
//   "птица",
//   "рыба",
//   "цветок",
//   "трава",
//   "дом",
//   "улица",
//   "машина",
//   "велосипед",
//   "самолет",
//   "поезд",
//   "корабль",
//   "человек",
//   "ребенок",
//   "женщина",
//   "мужчина",
//   "старик",
//   "девочка",
//   "мальчик",
//   "учитель",
//   "ученик",
//   "друг",
//   "враг",
//   "любовь",
//   "радость",
//   "грусть",
//   "страх",
//   "смех",
//   "слезы",
//   "жизнь",
//   "смерть",
//   "время",
//   "вечность",
//   "день",
//   "ночь",
//   "утро",
//   "вечер",
//   "секунда",
//   "минута",
//   "час",
//   "год",
//   "век",
//   "миллион",
//   "счастье",
//   "беда",
//   "тревога",
//   "мир",
//   "война",
//   "победа",
//   "поражение",
//   "работа",
//   "отдых",
//   "праздник",
//   "игра",
//   "музыка",
//   "книга",
//   "фильм",
//   "картина",
//   "театр",
//   "песня",
//   "танец",
//   "спорт",
//   "путешествие",
//   "еда",
//   "вода",
//   "хлеб",
//   "мясо",
//   "овощи",
//   "фрукты",
//   "сладости",
//   "напитки",
//   "чай",
//   "кофе",
//   "город",
//   "деревня",
//   "страна",
//   "мир",
//   "континент",
//   "океан",
//   "завод",
//   "офис",
//   "школа",
//   "университет",
//   "болезнь",
//   "здоровье",
//   "лекарство",
//   "больница",
//   "врач",
//   "пациент",
//   "диагноз",
//   "лечение",
//   "терапия",
//   "операция",
//   "дружба",
//   "любовь",
//   "семья",
//   "дети",
//   "родители",
//   "сестра",
//   "брат",
//   "бабушка",
//   "дедушка",
//   "дядя",
//   "тетя",
//   "деньги",
//   "богатство",
//   "бедность",
//   "успех",
//   "неудача",
//   "талант",
//   "работа",
//   "карьера",
//   "бизнес",
//   "мечта",
//   "цель",
//   "желание",
//   "надежда",
//   "верность",
//   "доброта",
//   "честность",
//   "смелость",
//   "храбрость",
//   "сила",
//   "воля",
//   "интеллект",
//   "знание",
//   "опыт",
//   "мудрость",
//   "учеба",
//   "наука",
//   "исследование",
//   "техника",
//   "технология",
//   "компьютер",
//   "интернет",
//   "телефон",
//   "соцсеть",
//   "программа",
//   "сайт",
//   "блог",
//   "видео",
//   "фото",
//   "игра",
//   "проект",
//   "команда",
//   "лидер",
//   "успех",
//   "провал",
//   "выбор",
//   "решение",
//   "план",
//   "цель",
//   "задача",
//   "сила",
//   "воля",
//   "характер",
//   "дружба",
//   "доверие",
//   "предательство",
//   "зависть",
//   "радость",
//   "грусть",
//   "чувство",
//   "эмоция",
//   "покой",
//   "беспокойство",
//   "уверенность",
//   "сомнение",
//   "страх",
//   "смех",
//   "улыбка",
//   "слезы",
//   "гнев",
//   "ярость",
//   "месть",
//   "прощение",
//   "справедливость",
//   "обман",
//   "правда",
//   "ложь",
//   "истина",
//   "забота",
//   "внимание",
//   "интерес",
//   "скука",
//   "удовольствие",
//   "наслаждение",
//   "разочарование",
//   "надежда",
//   "вера",
//   "духовность",
//   "религия",
//   "бог",
//   "судьба",
//   "случай",
//   "удача",
//   "неудача",
//   "шанс",
//   "выбор",
//   "решение",
//   "план",
//   "мечта",
//   "цель",
//   "любовь",
//   "дружба",
//   "семья",
//   "дети",
//   "родители",
//   "жена",
//   "муж",
//   "брат",
//   "сестра",
//   "родственники",
//   "карьера",
//   "работа",
//   "успех",
//   "деньги",
//   "богатство",
//   "бедность",
//   "счастье",
//   "страдание",
//   "забота",
//   "здоровье",
//   "время",
//   "жизнь",
//   "смерть",
//   "вечность",
//   "минуты",
//   "секунды",
//   "часы",
//   "дни",
//   "недели",
//   "годы",
//   "природа",
//   "весна",
//   "лето",
//   "осень",
//   "зима",
//   "снег",
//   "дождь",
//   "солнце",
//   "луна",
//   "звезды",
//   "небо",
//   "земля",
//   "гора",
//   "река",
//   "озеро",
//   "море",
//   "океан",
//   "лес",
//   "дерево",
//   "цветок",
//   "трава",
//   "птица",
//   "рыба",
//   "животное",
//   "насекомое",
//   "мир",
//   "вселенная",
//   "планета",
//   "звезда",
//   "галактика",
//   "солнечная система",
//   "космос",
//   "атом",
//   "молекула",
//   "клетка",
//   "организм",
//   "человек",
//   "разум",
//   "сознание",
//   "мысль",
//   "идея",
//   "теория",
//   "практика",
//   "опыт",
//   "эксперимент",
//   "наука",
//   "техника",
//   "технология",
//   "инновация",
//   "изобретение",
//   "машина",
//   "инструмент",
//   "устройство",
//   "механизм",
//   "робот",
//   "компьютер",
//   "программа",
//   "интернет",
//   "сеть",
//   "данные",
//   "информация",
//   "знание",
//   "мудрость",
//   "ученый",
//   "исследователь",
//   "изобретатель",
//   "инженер",
//   "доктор",
//   "учитель",
//   "профессор",
//   "студент",
//   "ученик",
//   "школа",
//   "университет",
//   "академия",
//   "исследование",
//   "эксперимент",
//   "наблюдение",
//   "результат",
//   "вывод",
//   "знание",
//   "умение",
//   "навык",
//   "опыт",
//   "работа",
//   "труд",
//   "усилие",
//   "достижение",
//   "успех",
//   "провал",
//   "деньги",
//   "капитал",
//   "инвестиция",
//   "бизнес",
//   "компания",
//   "фирма",
//   "проект",
//   "прибыль",
//   "убыток",
//   "стоимость",
//   "цена",
//   "товар",
//   "услуга",
//   "продажа",
//   "покупка",
//   "рынок",
//   "экономика",
//   "финансы",
//   "банки",
//   "кредит",
//   "долг",
//   "депозит",
//   "валюта",
//   "курс",
//   "инфляция",
//   "дефляция",
//   "рынок",
//   "экономика",
//   "бизнес",
//   "компания",
//   "прибыль",
//   "доход",
//   "расход",
//   "бюджет",
//   "налог",
//   "пошлина",
//   "субсидия",
//   "дотация",
//   "инвестиция",
//   "капитал",
//   "акция",
//   "облигация",
//   "фонд",
//   "банк",
//   "страхование",
//   "ипотека",
//   "кредит",
//   "долг",
//   "банкротство",
//   "сбережения",
//   "пенсия",
//   "зарплата",
//   "доход",
//   "расход",
//   "инфляция",
//   "дефляция",
//   "налог",
//   "бюджет",
//   "экономия",
//   "инвестиция",
//   "бизнес",
//   "компания",
//   "прибыль",
//   "доход",
//   "расход",
//   "банк",
//   "кредит",
//   "ипотека",
//   "страхование",
//   "сбережения",
//   "пенсия",
//   "зарплата",
//   "доход",
//   "расход",
//   "инфляция",
//   "дефляция",
//   "налог",
//   "бюджет",
//   "экономия",
//   "инвестиция",
//   "бизнес",
//   "компания",
//   "прибыль",
//   "доход",
//   "расход",
//   "банк",
//   "кредит",
//   "ипотека",
//   "страхование",
//   "сбережения",
//   "пенсия",
//   "зарплата",
//   "доход",
//   "расход",
//   "инфляция",
//   "дефляция",
//   "налог",
//   "бюджет",
//   "экономия",
//   "инвестиция",
// ];

// const randomWord = () => {
//   const randomIndex = Math.ceil(Math.random() * wordsArray.length);
//   return wordsArray[randomIndex - 1];
// };

// const HomePage = () => {
//   const words = useMemo(
//     () => [...Array(300).keys()].map(() => randomWord()),
//     [],
//   );

//   useEffect(() => {
//     document.querySelector("#word")?.classList.add("current");
//     document.querySelector("#letter")?.classList.add("current");

//     const handleKeyUp = (e: KeyboardEvent) => {
//       const key = e.key;
//       const currentWord = document.querySelector("#word.current");
//       const currentLetter = document.querySelector("#letter.current");
//       const expected = currentLetter?.innerHTML || " ";
//       const isLetter = key.length === 1 && key !== " ";
//       const isSpace = key === " ";

//       console.log({ key, expected });

//       if (isLetter) {
//         if (currentLetter) {
//           currentLetter.classList.add(
//             key === expected ? "correct" : "incorrect",
//           );

//           currentLetter.classList.remove("current");

//           if (currentLetter.nextElementSibling) {
//             currentLetter?.nextElementSibling?.classList.add("current");
//           }
//         } else {
//           const incorrectLetter = document.createElement("span");
//           incorrectLetter.innerHTML = key;
//           incorrectLetter.className = "letter incorrect extra";
//           currentWord?.appendChild(incorrectLetter);
//         }
//       }

//       if (isSpace) {
//         if (expected !== " ") {
//           const lettersToInvalidate = [
//             ...document.querySelectorAll("#word.current #letter:not(.correct)"),
//           ];

//           lettersToInvalidate.forEach((letter) => {
//             letter.classList.add("incorrect");
//           });
//         }

//         currentWord?.classList.remove("current");

//         currentWord?.nextElementSibling?.classList.add("current");
//       }

//       if (currentLetter) {
//         currentLetter.classList.remove("current");

//         currentWord?.nextElementSibling?.firstElementChild?.classList.add(
//           "current",
//         );
//       }
//     };

//     document.addEventListener("keyup", handleKeyUp);

//     return () => document.removeEventListener("keyup", handleKeyUp);
//   }, []);

//   return (
//     <>
//       <header className="h-[80px] max-w-[1440px] mx-auto w-full flex items-center justify-between px-4">
//         <div className="flex items-center gap-2">
//           <Image src="logo.svg" width={60} height={45} alt="Typing Speed" />
//           <h1 className="font-bold text-2xl">typingspeed</h1>
//         </div>
//         <div className="flex items-center gap-2">
//           <button
//             className="dark:hover:bg-white/[0.05] p-1.5 rounded-full transition-all text-zinc-600 hover:text-current"
//             title="Настройки">
//             <Settings size={20} />
//           </button>
//           <button
//             className="dark:hover:bg-white/[0.05] p-1.5 rounded-full transition-all text-zinc-600 hover:text-current"
//             title="Профиль">
//             <User size={20} />
//           </button>
//         </div>
//       </header>
//       <main
//         className="w-full h-[calc(100vh-80px)] max-w-[1440px] mx-auto px-4 flex justify-center"
//         suppressHydrationWarning>
//         <section className="mt-40">
//           <div
//             className="relative h-[120px] overflow-hidden leading-9 px-12 group focus:outline-none"
//             tabIndex={0}>
//             {words.map((word, index) => {
//               return (
//                 <div
//                   id="word"
//                   className={`inline-block mr-[5px] text-[28px] dark:text-white/[0.2]`}
//                   key={`random_word_${index}_${word}`}>
//                   {word?.split("").map((letter, id) => {
//                     return (
//                       <span id="letter" key={`letter_${index}_${letter}`}>
//                         {letter}
//                       </span>
//                     );
//                   })}
//                 </div>
//               );
//             })}
//             <div className="cursor w-[2px] h-[26px] bg-blue-400 fixed top-[246px] left-[60px] rounded-full animate-blink group-focus:block hidden" />
//             <div className="absolute inset-0 text-[24px] text-center tracking-widest pt-[38px] w-full dark:bg-[#1a1a1a]/[0.80] backdrop-blur-sm group-focus:bg-transparent group-focus:backdrop-blur-none transition-all group-focus:hidden">
//               Нажмите чтобы начать
//             </div>
//           </div>
//         </section>
//       </main>
//     </>
//   );
// };

// export default HomePage;
