/**
 * نمایش جزئیات یک تراکنش کاربر.
 *
 * مشخصات کلی تراکنش (نوع، عنوان، وضعیت، مبلغ و تاریخ) را در بخش
 * سرگذاری و ردیف‌های اطلاعاتی اضافی را در یک جدول دو ستونی نمایش
 * می‌دهد. این کامپوننت هیچ وضعیت یا کنشی ندارد و صرفاً نمایشی
 * است، بنابراین به‌عنوان کامپوننت سرور رندر می‌شود.
 */

import { Tag } from "antd";
import { formatPrice } from "@/lib/persian";
import {
  TRANSACTION_STATUS_CONFIG,
  TRANSACTION_TYPES,
  type Transaction,
} from "@/lib/transactions";
import { TRANSACTION_ICONS } from "./transactionIcons";

/**
 * تنظیمات مشترک آیکون‌ها (ضخامت خط و اندازه).
 */
const iconProps = { strokeWidth: 1, size: 22 } as const;

/**
 * رندر جزئیات یک تراکنش.
 *
 * @param props - تنظیمات جزئیات
 * @param props.transaction - تراکنشی که جزئیات آن نمایش داده می‌شود
 * @returns بخش شامل سرگذار تراکنش و جدول ردیف‌های اطلاعاتی
 */
export function TransactionDetail({
  transaction,
}: {
  transaction: Transaction;
}) {
  const Icon = TRANSACTION_ICONS[transaction.type];
  const status = TRANSACTION_STATUS_CONFIG[transaction.status];

  return (
    <div className="space-y-2">
      <section className="bg-white rounded-3xl shadow-[0px_4px_12px_0px_rgba(175,186,205,0.37)] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex items-center justify-center w-12 h-12 rounded-[18px] bg-[#F3F6FE] text-[#0C6FFF] shrink-0">
              <Icon {...iconProps} />
            </span>
            <div className="flex flex-col items-start text-start min-w-0">
              <h2 className="text-[#081D5D] text-[14px] font-bold">
                {transaction.title}
              </h2>
              <p className="text-[#52759F] text-[12px] font-light m-0">
                {TRANSACTION_TYPES[transaction.type]}
              </p>
              <p className="text-[#52759F] text-[12px] font-medium m-0">
                {transaction.description}
              </p>
            </div>
          </div>
          <Tag color={status.tagColor} className="!text-[11px] !m-0">
            {status.label}
          </Tag>
        </div>

        <div className="w-full rounded-[18px] bg-[#F3F6FE] p-4 space-y-1.5 mt-4">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#52759F]">تاریخ تراکنش</span>
            <span className="text-[#081D5D] font-medium">
              {transaction.date}
            </span>
          </div>
          <div className="flex items-center justify-between text-[13px] pt-1.5 border-t border-dashed border-[#52759F]/30">
            <span className="text-[#52759F]">مبلغ تراکنش</span>
            <span className="text-[#0C6FFF] font-bold">
              {formatPrice(transaction.amount)}
            </span>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl shadow-[0px_4px_12px_0px_rgba(175,186,205,0.37)] p-4">
        <h3 className="text-[#081D5D] text-[13px] font-bold text-right mb-3">
          جزئیات تراکنش
        </h3>
        <div className="divide-y divide-dashed divide-[#52759F]/20">
          {transaction.info.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 py-2.5 text-right"
            >
              <span className="text-[#52759F] text-[12px] font-light shrink-0">
                {item.label}
              </span>
              <span className="text-[#081D5D] text-[12px] font-medium text-left min-w-0 truncate">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
