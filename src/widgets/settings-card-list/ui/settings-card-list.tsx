import { SettingCard, SettingCardProps } from "@/entities/settings-card";
import { CARETS, DIFFICULTS, TIMES } from "@/shared/constants";

const cards: SettingCardProps[] = [
  {
    name: "difficult",
    title: {
      icon: "Star",
      text: "difficult",
    },
    description:
      "Normal is the classic type test experience. Hard includes generating more difficult words.",
    inputs: {
      values: DIFFICULTS,
      type: "button",
    },
  },
  {
    name: "time",
    title: {
      icon: "Timer",
      text: "timer",
    },
    description:
      "The allotted time after which the test will end, WPM is also calculated depending on the time.",
    inputs: {
      values: TIMES,
      type: "button",
    },
  },
  {
    name: "caret",
    title: {
      icon: "TextCursor",
      text: "caret style",
    },
    description:
      "Сaret will appear after each character. Underline will highlight the current word.",
    inputs: {
      values: CARETS,
      type: "button",
    },
  },
  {
    name: "countWords",
    title: {
      icon: "NotepadText",
      text: "count words",
    },
    description:
      "The number of words that will be created for the test. If there are not enough words in the allotted time, more words will be generated.",
    inputs: {
      values: [200],
      type: "input",
    },
  },
  {
    name: "theme",
    title: {
      icon: "Palette",
      text: "theme style",
    },
    description:
      "Сaret will appear after each character. Underline will highlight the current word.",
    inputs: {
      values: ["light", "dark", "system"],
      type: "button",
    },
  },
];

export const SettingsCardList = () => {
  return (
    <div className="flex flex-col gap-6 pb-6">
      {cards.map((card) => {
        return <SettingCard key={card.name} {...card} />;
      })}
    </div>
  );
};
