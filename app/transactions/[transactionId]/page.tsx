/**
 * صفحه جزئیات یک تراکنش.
 *
 * مسیر: `/transactions/[transactionId]` — کامپوننت سرور (async) که
 * `params` را await می‌کند و تراکنش متناظر را از JSON می‌خواند.
 * در صورت یافتن نشدن ۴۰۴ برمی‌گرداند.
 *
 * @param params - Promise حاوی `{ transactionId: string }` (Next.js 15+)
 * @returns صفحه جزئیات تراکنش یا notFound
 */
import { notFound } from "next/navigation";
import { IntroductionHeader } from "@/components/Introduction/Header";
import { TransactionDetail } from "@/components/Transactions/TransactionDetail";
import data from "@/components/Transactions/transactionsData.json";
import {
  findTransaction,
  type TransactionsData,
} from "@/lib/transactions";

/**
 * رندر صفحه جزئیات تراکنش متناسب با پارامتر داینامیک مسیر.
 *
 * @param props - پارامترهای روت داینامیک
 * @param props.params - Promise حاوی `transactionId` که پیش از استفاده await می‌شود
 * @returns المان صفحه جزئیات، یا فراخوانی `notFound` در صورت نبود تراکنش
 */
export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const { transactions } = data as TransactionsData;
  const { transactionId } = await params;

  const transaction = findTransaction(transactions, transactionId);

  if (!transaction) {
    notFound();
  }

  return (
    <main className="flex flex-col gap-3">
      <IntroductionHeader title="جزئیات تراکنش" />
      <TransactionDetail transaction={transaction} />
    </main>
  );
}
