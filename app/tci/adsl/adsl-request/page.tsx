/**
 * صفحه درخواست اینترنت ADSL (TCI).
 *
 * مسیر: `/tci/adsl/adsl-request` — کامپوننت سرور با هدر و فرم درخواست اختصاصی ADSL.
 *
 * @returns صفحه درخواست ADSL
 */
import { IntroductionHeader } from "@/components/Introduction/Header";
import { InternetRequestForm } from "@/components/InternetRequest/InternetRequestForm";

export default function AdslRequestPage() {
  return (
    <main className="flex flex-col gap-3">
      <IntroductionHeader title="درخواست ADSL" />
      <InternetRequestForm
        title="درخواست سرویس اینترنت ADSL"
        description="اطلاعات هویتی و سرویس ADSL مورد نظر را تکمیل کنید."
        technologies={["ADSL"]}
        showHeader={false}
      />
    </main>
  );
}