/**
 * صفحه درخواست اینترنت VDSL (TCI).
 *
 * مسیر: `/tci/vdsl/vdsl-request` — کامپوننت سرور با هدر و فرم درخواست اختصاصی VDSL.
 *
 * @returns صفحه درخواست VDSL
 */
import { IntroductionHeader } from "@/components/Introduction/Header";
import { InternetRequestForm } from "@/components/InternetRequest/InternetRequestForm";

export default function VdslRequestPage() {
  return (
    <main className="flex flex-col gap-3">
      <IntroductionHeader title="درخواست VDSL" />
      <InternetRequestForm
        title="درخواست سرویس اینترنت VDSL"
        description="اطلاعات هویتی و سرویس VDSL مورد نظر را تکمیل کنید."
        technologies={["VDSL"]}
        showHeader={false}
      />
    </main>
  );
}