import dynamic from "next/dynamic";

export type * from "./model/types";
export { useConfigStore } from "./model/store";
export { type SettingCardProps } from "./ui/setting-card";

export const SettingCard = dynamic(() => import("./ui/setting-card"), {
  ssr: false,
});
