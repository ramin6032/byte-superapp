/**
 * صفحه عملیات اینترنت ADSL (TCI).
 *
 * مسیر: `/tci/adsl` — کامپوننت سرور که لیست عملیات را از JSON می‌خواند و نمایش می‌دهد.
 *
 * @returns صفحه فهرست عملیات ADSL
 */
import {
  TciOperationList,
  type TciOperationsData,
} from "@/components/Tci/TciOperationList";
import data from "@/components/Adsl/adslData.json";
import { Header } from "@/components/Header/Header";

export default function AdslPage() {
  const { operations } = data as TciOperationsData;

  return (
    <main className="flex flex-col gap-3">
      <Header title="عملیات ADSL" />
      <TciOperationList
        operations={operations}
        basePath="/tci/adsl"
        sectionTitle="عملیات اینترنت ADSL مخابرات"
        emptyLabel="عملیاتی برای ADSL یافت نشد"
      />
    </main>
  );
}
