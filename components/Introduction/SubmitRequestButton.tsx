"use client";

/**
 * دکمه ثبت درخواست مشترک.
 *
 * کامپوننت کلاینت با آیکون Send، استایل برند و props اختیاری onClick/label.
 *
 * @param onClick - هندلر کلیک (اختیاری)
 * @param label - متن دکمه (پیش‌فرض: «ثبت درخواست»)
 * @returns دکمه ثبت درخواست
 */
import { Send } from "lucide-react";

export function SubmitRequestButton({
  onClick,
  label = "ثبت درخواست",
}: {
  onClick?: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-[#0C6FFF] hover:bg-[#0C6FFF]/90 text-white text-[13px] font-medium rounded-[18px] px-4 py-2.5 flex items-center justify-center gap-1.5 transition-colors"
    >
      <Send strokeWidth={1.5} size={18} />
      {label}
    </button>
  );
}
