"use client";

/**
 * فهرست عملیات قابل انجام روی سرویس فیبر نوری مخابرات.
 *
 * این کامپوننت یک پوستهٔ نازک روی `TciOperationList` است و صرفاً مسیر پایه و
 * متن‌های فیبر نوری را مشخص می‌کند؛ منطق رندر و ناوبری در کامپوننت مشترک
 * قرار دارد تا سرویس‌های ADSL و VDSL نیز دقیقاً مانند فیبر نوری رفتار کنند.
 */

import {
  TciOperationList,
  type TciOperation,
} from "@/components/Tci/TciOperationList";

/**
 * نمایش فهرست عملیات فیبر نوری در قالب کارت‌های قابل کلیک.
 *
 * @param props - تنظیمات فهرست عملیات
 * @param props.operations - آرایه عملیات‌هایی که باید نمایش داده شوند
 * @param props.onSelect - تابعی که پس از کلیک روی یک عملیات، همان عملیات را دریافت می‌کند؛ در صورت نبود، کاربر به صفحه عملیات هدایت می‌گردد
 * @returns بخش فهرست عملیات فیبر نوری
 */
export function FiberOperationList({
  operations,
  onSelect,
}: {
  operations: TciOperation[];
  onSelect?: (operation: TciOperation) => void;
}) {
  return (
    <TciOperationList
      operations={operations}
      basePath="/tci/fiberOptic"
      sectionTitle="عملیات فیبر نوری مخابرات"
      emptyLabel="عملیاتی برای فیبر نوری یافت نشد"
      onSelect={onSelect}
    />
  );
}
