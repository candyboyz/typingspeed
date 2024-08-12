import { Icon } from "@/shared/ui/icon";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="h-[80px] sticky dark:bg-[#1a1a1a] top-0 max-w-[1440px] mx-auto w-full flex items-center justify-between px-4">
      {/* Logo Start */}
      <Link href={"/"} className="flex items-center gap-2">
        <Image
          src="logo.svg"
          width={50}
          height={0}
          alt="Typing Speed"
          className="w-[40px] md:w-[50px]"
        />
        <h1 className="font-bold text-xl md:text-2xl">typingspeed</h1>
      </Link>
      {/* Logo End */}

      {/* Links Start */}
      <div className="flex items-center gap-2">
        {/* Settings Link */}
        <Link
          title="Settings"
          href={"settings"}
          className="dark:hover:bg-white/[0.05] hover:bg-black/[0.05] p-1.5 rounded-full transition-all text-zinc-600 hover:text-current">
          <Icon name="Settings" size={20} />
        </Link>
        {/* Settings Link */}
      </div>
      {/* Links End */}
    </header>
  );
};
