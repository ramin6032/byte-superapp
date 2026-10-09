/**
 * صفحه عملیات اینترنت VDSL (TCI).
 *
 * مسیر: `/tci/vdsl` — کامپوننت سرور که لیست عملیات را از JSON می‌خواند و نمایش می‌دهد.
 *
 * @returns صفحه فهرست عملیات VDSL
 */
import { IntroductionHeader } from "@/components/Introduction/Header";
import {
  TciOperationList,
  type TciOperationsData,
} from "@/components/Tci/TciOperationList";
import data from "@/components/Vdsl/vdslData.json";

export default function VdslPage() {
  const { operations } = data as TciOperationsData;

  return (
    <main className="flex flex-col gap-3">
      <IntroductionHeader title="عملیات VDSL" />
      <TciOperationList
        operations={operations}
        basePath="/tci/vdsl"
        sectionTitle="عملیات اینترنت VDSL مخابرات"
        emptyLabel="عملیاتی برای VDSL یافت نشد"
      />
    </main>
  );
}