"use client";

import { ChessQueen, HomeIcon, User, Wallet } from "lucide-react";

export function Navbar() {
  return (
    <nav className="w-full px-2 py-1">
      <div className="bg-white text-black/60 rounded-[18px] p-1 grid grid-cols-4 gap-2.5 ">
        <button className="flex flex-col items-center justify-center gap-1 p-1">
          <ChessQueen strokeWidth={1} size={24} />
          <span className="text-black/60 text-[12px] font-normal">باشگاه</span>
        </button>

        <button className="flex flex-col items-center justify-center gap-1">
          <User strokeWidth={1} size={24} />
          <span className="text-black/60 text-[12px] font-normal">پروفایل</span>
        </button>

        <button className="flex text-white flex-col items-center justify-center gap-1 bg-[#0C6FFF] rounded-[24px]">
          <HomeIcon strokeWidth={1} size={24} />
          <span className=" text-[12px] font-medium">خانه</span>
        </button>

        <button className="flex flex-col items-center justify-center gap-1">
          <Wallet strokeWidth={1} size={24} />
          <span className="text-black/60 text-[12px] font-normal">
            تراکنش ها
          </span>
        </button>
      </div>
    </nav>
  );
}
