"use client";

/**
 * فهرست تراکنش‌های کاربر.
 *
 * تراکنش‌ها را در قالب کارت‌های قابل کلیک نمایش می‌دهد؛ هر کارت
 * آیکون نوع تراکنش، عنوان، توضیح، تاریخ، مبلغ و وضعیت را نمایش
 * می‌دهد و با کلیک کاربر به صفحه جزئیات همان تراکنش هدایت می‌شود.
 * در صورت خالی بودن فهرست، پیام «تراکنشی یافت نشد» نمایش داده می‌شود.
 */

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tag } from "antd";
import { formatPrice } from "@/lib/persian";
import {
  TRANSACTION_STATUS_CONFIG,
  type Transaction,
} from "@/lib/transactions";
import { TRANSACTION_ICONS } from "./transactionIcons";

/**
 * تنظیمات مشترک آیکون‌ها (ضخامت خط و اندازه).
 */
const iconProps = { strokeWidth: 1, size: 20 } as const;

/**
 * رندر فهرست تراکنش‌ها.
 *
 * هر تراکنش به‌صورت یک دکمه کلیک‌پذیر نمایش داده می‌شود و با کلیک
 * روی آن کاربر به مسیر `/transactions/[id]` هدایت می‌شود.
 *
 * @param props - تنظیمات فهرست
 * @param props.transactions - فهرست تراکنش‌هایی که باید نمایش داده شوند
 * @param props.onSelect - تابعی که پس از کلیک روی یک تراکنش، همان تراکنش را دریافت می‌کند؛ در صورت نبود، به صفحه جزئیات ناوبری می‌شود
 * @returns بخش فهرست تراکنش‌ها، یا پیام خالی بودن فهرست در صورت نبود آیتم
 */
export function TransactionList({
  transactions,
  onSelect,
}: {
  transactions: Transaction[];
  onSelect?: (transaction: Transaction) => void;
}) {
  const router = useRouter();

  /**
   * مدیریت انتخاب یک تراکنش: در صورت وجود فراخوان `onSelect` نتیجه به
   * والد بازگردانده می‌شود، در غیر این صورت کاربر به صفحه جزئیات
   * تراکنش هدایت می‌گردد.
   *
   * @param transaction - تراکنش انتخاب‌شده توسط کاربر
   * @returns بدون مقدار بازگشتی؛ اثر آن فراخوان callback یا ناوبری است
   */
  const handleSelect = (transaction: Transaction) => {
    if (onSelect) {
      onSelect(transaction);
      return;
    }
    router.push(`/transactions/${transaction.id}`);
  };

  if (transactions.length === 0) {
    return (
      <section className="bg-white rounded-3xl  p-4">
        <p className="text-[#52759F] text-[12px] font-light text-center py-4">
          تراکنشی یافت نشد
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-3xl flex-1  p-3 space-y-2 overflow-y-auto ">
      <div className="space-y-1">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onClick={() => handleSelect(transaction)}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * یک ردیف قابل کلیک در فهرست تراکنش‌ها.
 *
 * در سمت راست آیکون نوع تراکنش به‌همراه عنوان و توضیح و در سمت چپ
 * مبلغ، تاریخ و برچسب وضعیت تراکنش نمایش داده می‌شود.
 *
 * @param props - تنظیمات ردیف تراکنش
 * @param props.transaction - داده تراکنشی که باید در ردیف نمایش داده شود
 * @param props.onClick - تابعی که با کلیک روی ردیف اجرا می‌شود
 * @returns دکمه‌ای با چیدمان افقی شامل آیکون، مشخصات و وضعیت تراکنش
 */
function TransactionItem({
  transaction,
  onClick,
}: {
  transaction: Transaction;
  onClick: () => void;
}) {
  const Icon = TRANSACTION_ICONS[transaction.type];
  const status = TRANSACTION_STATUS_CONFIG[transaction.status];

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between gap-3 p-3 rounded-[18px] bg-[#F3F6FE] hover:bg-[#F3F6FE]/70 text-right transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-white text-[#0C6FFF] shrink-0">
          <Icon {...iconProps} />
        </span>
        <div className="flex flex-col items-start text-start min-w-0">
          <span className="text-[#081D5D] text-[13px] font-medium truncate">
            {transaction.title}
          </span>
          <span className="text-[#52759F] text-[11px] font-light truncate">
            {transaction.description}
          </span>
          <span className="text-[#52759F] text-[10px] font-light">
            {transaction.date}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-[#081D5D] text-[12px] font-bold">
          {formatPrice(transaction.amount)}
        </span>
        <div className="flex items-center gap-1.5">
          <Tag color={status.tagColor} className="!text-[10px] !m-0 !px-1.5">
            {status.label}
          </Tag>
          <ChevronLeft strokeWidth={1} size={20} className="text-[#52759F]" />
        </div>
      </div>
    </button>
  );
}
