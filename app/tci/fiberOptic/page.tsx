/**
 * صفحه عملیات فیبر نوری (TCI).
 *
 * مسیر: `/tci/fiberOptic` — کامپوننت سرور که لیست عملیات را از JSON می‌خواند و نمایش می‌دهد.
 *
 * @returns صفحه فهرست عملیات فیبر نوری
 */
import { FiberOperationList } from "@/components/FiberOptic/FiberOperationList";
import { type TciOperationsData } from "@/components/Tci/TciOperationList";
import data from "@/components/FiberOptic/fiberOpticData.json";
import { Header } from "@/components/Header/Header";

export default function FiberOpticPage() {
  const { operations } = data as TciOperationsData;

  return (
    <main className="flex flex-col gap-3">
      <Header title="عملیات فیبر نوری" />
      <FiberOperationList operations={operations} />
    </main>
  );
}
