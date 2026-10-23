"use client";

/**
 * هدر مقدمه با دکمه بازگشت.
 *
 * کامپوننت کلاینت که عنوان را نمایش داده و با کلیک روی فلش به صفحه قبل برمی‌گردد.
 *
 * @param title - متن عنوان صفحه
 * @returns هدر با دکمه بازگشت
 */
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header({ title }: { title: string }) {
  const router = useRouter();

  return (
    <header className="w-full mx-auto pt-1">
      <div className="bg-white rounded-[12px] shadow px-4 py-2 flex flex-row-reverse items-center justify-between">
        <ChevronLeft
          strokeWidth={1}
          size={24}
          className="text-neutral-700 cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-neutral-700 text-[15px] font-bold">{title}</h1>
        <div className="w-6" />
      </div>
    </header>
  );
}
