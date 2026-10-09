"use client";

/**
 * نوار ناوبری پایین صفحه خانه.
 *
 * میان‌برهای ناوبری اصلی برنامه را از پیکربندی `NAV_ITEMS` می‌خواند و
 * به‌صورت دکمه‌های شبکه‌ای با آیکون و برچسب نمایش می‌دهد.
 */

import { NAV_ITEMS, type NavItem } from "./navItems";

/**
 * رندر کردن نوار ناوبری پایین صفحه خانه.
 *
 * دکمه‌ها را بر اساس `NAV_ITEMS` در یک شبکه پنج ستونی می‌سازد. آیتمی که
 * `isActive: true` داشته باشد با پس‌زمینه آبی و متن سفید به‌عنوان گزینه فعال
 * مشخص می‌شود.
 *
 * @returns عنصر ناوبری شامل دکمه‌های 클럽، پروفایل، خانه، سرویس‌های من و تراکنش‌ها
 */
export function Navbar() {
  return (
    <nav className="w-full px-2 py-1">
      <div className="bg-white text-black/60 rounded-[18px] py-1 grid grid-cols-5">
        {NAV_ITEMS.map((item: NavItem) => (
          <NavButton key={item.id} item={item} />
        ))}
      </div>
    </nav>
  );
}

function NavButton({ item }: { item: NavItem }) {
  const Icon = item.icon;
  const isActive = item.isActive ?? false;

  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center pt-1 gap-1 transition-colors ${
        isActive
          ? "text-white bg-[#0C6FFF] rounded-[24px]"
          : "text-black/60 hover:text-[#0C6FFF]"
      }`}
    >
      <Icon strokeWidth={1} size={24} />
      <span className="text-[12px] font-normal">{item.label}</span>
      {item.badge && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-medium w-5 h-5 rounded-full flex items-center justify-center">
          {item.badge}
        </span>
      )}
    </button>
  );
}