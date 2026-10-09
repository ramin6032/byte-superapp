"use client";

/**
 * هدر صفحه خانه.
 *
 * نوار بالای صفحه شامل دکمه منو، لوگوی شرکت و دکمه اعلان‌ها را نمایش می‌دهد.
 */

import { Bell, Menu } from "lucide-react";
import Image from "next/image";

/**
 * رندر کردن هدر صفحه خانه.
 *
 * چیدمان هدر را به‌صورت افقی با توزیع یکنواخت آیتم‌ها در یک کارت سفید سایه‌دار می‌سازد.
 *
 * @returns عنصر هدر شامل دکمه منو، لوگو و دکمه اعلان
 */
export function Header() {
  return (
    <header className="w-full mx-auto p-1">
      <div className="bg-white text-black/60 rounded-[18px] shadow px-4 py-2 flex items-center justify-between">
        <Menu strokeWidth={1} size={24} />
        <Image src="/logos/blue-logo.svg" alt="Logo" width={55} height={24} />
        <Bell strokeWidth={1} size={24} />
      </div>
    </header>
  );
}
