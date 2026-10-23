/**
 * صفحه ثبت‌نام هات اسپات.
 *
 * مسیر: `/register/hotspot` — کامپوننت سرور با هدر و فرم ثبت‌نام هات اسپات.
 *
 * @returns صفحه ثبت‌نام هات اسپات
 */
import { Header } from "@/components/Header/Header";
import { InternetRequestForm } from "@/components/InternetRequest/InternetRequestForm";

export default function HotspotRegisterPage() {
  return (
    <main className="flex flex-col gap-3">
      <Header title="هات اسپات" />
      <InternetRequestForm
        title="درخواست سرویس هات اسپات"
        description="اطلاعات هویتی و سرویس هات اسپات مورد نظر را تکمیل کنید."
        technologies={["VDSL"]}
        showHeader={false}
      />
    </main>
  );
}