import type { Metadata } from "next";
import { Ubuntu_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./_providers";
import { Settings, User } from "lucide-react";
import Image from "next/image";

const ubuntu = Ubuntu_Mono({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Typing Speed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={ubuntu.className}>
        <Providers>
          <header className="h-[80px] max-w-[1440px] mx-auto w-full flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Image src="logo.svg" width={50} height={0} alt="Typing Speed" />
              <h1 className="font-bold text-2xl">typingspeed</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="dark:hover:bg-white/[0.05] hover:bg-black/[0.05] p-1.5 rounded-full transition-all text-zinc-600 hover:text-current"
                title="Настройки">
                <Settings size={20} />
              </button>
              <button
                className="dark:hover:bg-white/[0.05] hover:bg-black/[0.05] p-1.5 rounded-full transition-all text-zinc-600 hover:text-current"
                title="Профиль">
                <User size={20} />
              </button>
            </div>
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}
