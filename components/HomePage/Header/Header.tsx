"use client";

import { Bell, Menu } from "lucide-react";
import Image from "next/image";

export function Header() {
  return (
    <header className="w-full mx-auto p-2">
      <div className="bg-white text-black/60 rounded-[18px]  shadow-[0px_4px_12px_0px_rgba(175,186,205,0.37)] px-4 py-3 flex items-center justify-between">
        <Menu strokeWidth={1} size={24} />
        <Image src="/logos/blue-logo.svg" alt="Logo" width={75} height={38} />
        <Bell strokeWidth={1} size={24} />
      </div>
    </header>
  );
}
