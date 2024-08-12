import { TypingBox } from "@/features/typing-box";

export const HomePage = () => {
  return (
    <main className="w-full max-h-[calc(100vh-80px)] h-full max-w-[1440px] mx-auto px-4 flex flex-col">
      <TypingBox />
    </main>
  );
};
