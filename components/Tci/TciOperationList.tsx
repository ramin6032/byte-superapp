"use client";

/**
 * فهرست عمومی عملیات قابل انجام روی سرویس اینترنت در بخش TCI.
 *
 * این کامپوننت پیاده‌سازی مشترک فهرست عملیات فیبر نوری، ADSL و VDSL است؛ هر
 * سرویس با `basePath` مسیر پایه و عنوان دلخواه خود را مشخص می‌کند و آیتم‌ها
 * از فایل JSON همان سرویس خوانده می‌شوند.
 *
 * هر عملیات به‌صورت یک آیتم کلیک‌پذیر نمایش داده می‌شود؛ در صورت ارسال فراخوان
 * `onSelect`، انتخاب کاربر به والد بازگردانده می‌شود و در غیر این صورت کاربر به
 * صفحه همان عملیات هدایت می‌گردد. اگر فهرست خالی باشد، پیام «عملیاتی یافت
 * نشد» نمایش داده می‌شود.
 */

import { Cable, ChevronLeft, RefreshCw, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * ساختار یک عملیات سرویس اینترنت که در فهرست نمایش داده می‌شود.
 *
 * @property id - شناسه یکتای عملیات که برای مسیریابی استفاده می‌شود
 * @property title - عنوان اصلی عملیات
 * @property subtitle - توضیح کوتاه زیر عنوان
 * @property icon - کلید آیکون در نگاشت `ICONS`
 */
export type TciOperation = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
};

/**
 * ساختار فایل JSON عملیات هر سرویس در بخش TCI.
 *
 * @property operations - فهرست عملیات قابل انجام روی سرویس
 */
export type TciOperationsData = {
  operations: TciOperation[];
};

/**
 * نگاشت کلیدهای متنی به کامپوننت‌های آیکون lucide، تا داده‌های ورودی بتوانند
 * بدون ارجاع مستقیم به کامپوننت، آیکون مناسب خود را داشته باشند.
 */
const ICONS: Record<string, typeof Cable> = {
  cable: Cable,
  refresh: RefreshCw,
  rotate: RotateCw,
};

/**
 * نمایش فهرست عملیات یک سرویس اینترنت در قالب کارت‌های قابل کلیک.
 *
 * @param props - تنظیمات فهرست عملیات
 * @param props.operations - آرایه عملیات‌هایی که باید نمایش داده شوند
 * @param props.basePath - مسیر پایه سرویس مانند `/tci/adsl` که شناسهٔ عملیات به آن الصاق می‌شود
 * @param props.sectionTitle - عنوان بالای فهرست کارت
 * @param props.emptyLabel - پیامی که در صورت خالی بودن فهرست نمایش داده می‌شود
 * @param props.onSelect - تابعی که پس از کلیک روی یک عملیات، همان عملیات را دریافت می‌کند؛ در صورت نبود، به‌جای آن به مسیر عملیات ناوبری می‌شود
 * @returns بخش فهرست عملیات، یا پیام خالی بودن فهرست در صورت نبود آیتم
 */
export function TciOperationList({
  operations,
  basePath,
  sectionTitle,
  emptyLabel,
  onSelect,
}: {
  operations: TciOperation[];
  basePath: string;
  sectionTitle: string;
  emptyLabel: string;
  onSelect?: (operation: TciOperation) => void;
}) {
  const router = useRouter();

  /**
   * مدیریت انتخاب یک عملیات: در صورت وجود فراخوان `onSelect` نتیجه به والد
   * بازگردانده می‌شود، در غیر این صورت کاربر به صفحه عملیات هدایت می‌گردد.
   *
   * @param operation - عملیات انتخاب‌شده توسط کاربر
   * @returns بدون مقدار بازگشتی؛ اثر آن فراخوان callback یا ناوبری است
   */
  const handleSelect = (operation: TciOperation) => {
    if (onSelect) {
      onSelect(operation);
      return;
    }
    router.push(`${basePath}/${operation.id}`);
  };

  if (operations.length === 0) {
    return (
      <section className="bg-white rounded-3xl shadow-[0px_4px_12px_0px_rgba(175,186,205,0.37)] p-4">
        <p className="text-[#52759F] text-[12px] font-light text-center py-4">
          {emptyLabel}
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-3xl shadow-[0px_4px_12px_0px_rgba(175,186,205,0.37)] p-4 space-y-2">
      <h2 className="text-[#081D5D] text-[13px] font-bold text-right">
        {sectionTitle}
      </h2>
      <div className="space-y-1">
        {operations.map((operation) => (
          <TciOperationItem
            key={operation.id}
            operation={operation}
            onClick={() => handleSelect(operation)}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * یک ردیف قابل کلیک در فهرست عملیات سرویس اینترنت، شامل آیکون، عنوان، توضیح
 * و نمونه ناوبری به صفحه عملیات.
 *
 * اگر کلید آیکون در نگاشت `ICONS` شناخته نشود، آیکون پیش‌فرض `Cable` رندر می‌شود.
 *
 * @param props - تنظیمات ردیف عملیات
 * @param props.operation - داده عملیاتی که باید در ردیف نمایش داده شود
 * @param props.onClick - تابعی که با کلیک روی ردیف اجرا می‌شود
 * @returns دکمه‌ای با چیدمان افقی شامل آیکون، عنوان و توضیح عملیات
 */
function TciOperationItem({
  operation,
  onClick,
}: {
  operation: TciOperation;
  onClick: () => void;
}) {
  const Icon = ICONS[operation.icon] ?? Cable;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between gap-3 p-3 rounded-[18px] bg-[#F3F6FE] hover:bg-[#F3F6FE]/70 text-right transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-white text-[#0C6FFF] shrink-0">
          <Icon strokeWidth={1} size={20} />
        </span>
        <div className="flex flex-col items-start text-start">
          <span className="text-[#081D5D] text-[13px] font-medium">
            {operation.title}
          </span>
          <span className="text-[#52759F] text-[11px] font-light">
            {operation.subtitle}
          </span>
        </div>
      </div>
      <ChevronLeft
        strokeWidth={1}
        size={20}
        className="text-[#52759F] shrink-0"
      />
    </button>
  );
}
