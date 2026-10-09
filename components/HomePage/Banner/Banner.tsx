"use client";

/**
 * بنر تبلیغاتی صفحه خانه.
 *
 * یک تصویر تمام‌عرض با گوشه‌های گرد را به‌عنوان بنر بالای صفحه نمایش می‌دهد.
 */

import Image from "next/image";

/**
 * رندر کردن بنر صفحه خانه.
 *
 * تصویر بنر را با پر کردن کل محدوده کانتینر و برش یکنواخت نمایش می‌دهد.
 *
 * @returns عنصر بنر شامل تصویر با اولویت بارگذاری بالا
 */
export function Banner() {
  return (
    <div className="relative w-full h-[155px] rounded-[24px] overflow-hidden">
      <Image
        src="/images/banner-image-125d50.png"
        alt="Banner"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
