/**
 * صفحه عملیات فیبر نوری (TCI).
 *
 * مسیر: `/tci/fiberOptic` — کامپوننت سرور که لیست عملیات را از JSON می‌خواند و نمایش می‌دهد.
 *
 * @returns صفحه فهرست عملیات فیبر نوری
 */
import { IntroductionHeader } from "@/components/Introduction/Header";
import { FiberOperationList } from "@/components/FiberOptic/FiberOperationList";
import { type TciOperationsData } from "@/components/Tci/TciOperationList";
import data from "@/components/FiberOptic/fiberOpticData.json";

export default function FiberOpticPage() {
  const { operations } = data as TciOperationsData;

  return (
    <main className="flex flex-col gap-3">
      <IntroductionHeader title="عملیات فیبر نوری" />
      <FiberOperationList operations={operations} />
    </main>
  );
}