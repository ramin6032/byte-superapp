/**
 * صفحه درخواست اینترنت ADSL (TCI).
 *
 * مسیر: `/tci/adsl/adsl-request` — کامپوننت سرور با هدر و فرم درخواست اختصاصی ADSL.
 *
 * @returns صفحه درخواست ADSL
 */
import { InternetRequestForm } from "@/components/InternetRequest/InternetRequestForm";
import { Header } from "@/components/Header/Header";

export default function AdslRequestPage() {
  return (
    <main className="flex flex-col gap-3">
      <Header title="درخواست ADSL" />
      <InternetRequestForm
        title="درخواست سرویس اینترنت ADSL"
        description="اطلاعات هویتی و سرویس ADSL مورد نظر را تکمیل کنید."
        technologies={["ADSL"]}
        showHeader={false}
      />
    </main>
  );
}
