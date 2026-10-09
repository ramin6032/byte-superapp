"use client";

/**
 * نوار ناوبری پایین صفحه خانه.
 *
 * چهار میان‌بر ناوبری اصلی برنامه را در قالب دکمه‌هایی با آیکون و برچسب نمایش می‌دهد.
 */

import { ChessQueen, HomeIcon, User, Wallet } from "lucide-react";

/**
 * رندر کردن نوار ناوبری پایین صفحه خانه.
 *
 * دکمه‌ها را در یک شبکه چهارستونی نمایش می‌دهد و آیتم خانه را به‌عنوان گزینه فعال
 * با پس‌زمینه آبی مشخص می‌کند.
 *
 * @returns عنصر ناوبری شامل چهار دکمه باشگاه، پروفایل، خانه و تراکنش‌ها
 */
export function Navbar() {
  return (
    <nav className="w-full px-2 py-1">
      <div className="bg-white text-black/60 rounded-[18px] py-1 grid grid-cols-4  ">
        <button className="flex flex-col items-center justify-center pt-1 ">
          <ChessQueen strokeWidth={1} size={24} />
          <span className="text-black/60 text-[12px] font-normal">باشگاه</span>
        </button>

        <button className="flex flex-col items-center justify-center pt-1">
          <User strokeWidth={1} size={24} />
          <span className="text-black/60 text-[12px] font-normal">پروفایل</span>
        </button>

        <button className="flex text-white flex-col items-center justify-center pt-1 bg-[#0C6FFF] rounded-[24px]">
          <HomeIcon strokeWidth={1} size={24} />
          <span className=" text-[12px] font-normal">خانه</span>
        </button>

        <button className="flex flex-col items-center justify-center pt-1">
          <Wallet strokeWidth={1} size={24} />
          <span className="text-black/60 text-[12px] font-normal">
            تراکنش ها
          </span>
        </button>
      </div>
    </nav>
  );
}
