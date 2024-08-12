import { icons, type LucideProps } from "lucide-react";

/**
 * Interface for the props of the Icon component.
 *
 * @interface IconProps
 * @extends {Omit<LucideProps, "ref">}
 * @property {keyof typeof icons} name - The name of the icon to be rendered. Must match one of the keys in the icons object.
 */
interface IconProps extends Omit<LucideProps, "ref"> {
  name: keyof typeof icons;
}

/**
 * Icon component that renders an icon from the Lucide library.
 *
 * @param {IconProps} props - The properties passed to the Icon component.
 * @returns {React.ReactNode} Returns a ReactNode that renders the icon.
 */
export const Icon = ({ name, ...props }: IconProps): React.ReactNode => {
  const LucideIcon = icons[name];

  return <LucideIcon {...props} />;
};
