import dynamic from "next/dynamic";

export { useTypingBox } from "./model/useTypingBox";
export const TypingBox = dynamic(() => import("./ui/typing-box"), {
  ssr: false,
});
