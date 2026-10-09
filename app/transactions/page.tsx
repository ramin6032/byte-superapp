/**
 * صفحه فهرست تراکنش‌های کاربر.
 *
 * مسیر: `/transactions` — کامپوننت سرور که تراکنش‌ها را از JSON
 * می‌خواند و به فهرست تراکنش‌ها پاس می‌دهد.
 *
 * @returns صفحه فهرست تراکنش‌ها
 */
import { IntroductionHeader } from "@/components/Introduction/Header";
import { TransactionList } from "@/components/Transactions/TransactionList";
import data from "@/components/Transactions/transactionsData.json";
import type { TransactionsData } from "@/lib/transactions";

/**
 * رندر صفحه تراکنش‌ها.
 *
 * فهرست تراکنش‌ها از فایل JSON خوانده شده و به ترتیب ورودی
 * (جدیدترین اول) نمایش داده می‌شود.
 *
 * @returns المان صفحه شامل هدر بازگشت و فهرست تراکنش‌ها
 */
export default function TransactionsPage() {
  const { transactions } = data as TransactionsData;

  return (
    <main className="flex flex-col gap-3">
      <IntroductionHeader title="تراکنش ها" />
      <TransactionList transactions={transactions} />
    </main>
  );
}
