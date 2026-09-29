"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";

// No active student is chosen yet on these screens, so "home" has nowhere
// meaningful to send them — /map would just redirect back to /profiles anyway.
const HIDDEN_ON = new Set(["/", "/profiles"]);

export function HomeButton() {
  const pathname = usePathname();
  if (HIDDEN_ON.has(pathname)) return null;

  return (
    <Link
      href="/map"
      aria-label="Back to quest map"
      className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-300/50 active:scale-90 transition-transform touch-manipulation"
    >
      <Home size={24} strokeWidth={2.25} />
    </Link>
  );
}
