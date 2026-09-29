import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { HomeButton } from "@/components/HomeButton";
import { Toolbox } from "@/components/toolbox/Toolbox";
import { BackgroundDecor } from "@/components/BackgroundDecor";
import { SoundToggle } from "@/components/SoundToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dimensions Quest",
  description: "An adaptive Singapore Math learning adventure for Grade 2.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BackgroundDecor />
        {children}
        <SoundToggle />
        <HomeButton />
        <Toolbox />
      </body>
    </html>
  );
}
