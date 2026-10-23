/**
 * صفحه ثبت‌نام وایرلس.
 *
 * مسیر: `/register/wireless` — کامپوننت سرور با هدر و فرم ثبت‌نام وایرلس.
 *
 * @returns صفحه ثبت‌نام وایرلس
 */
import { Header } from "@/components/Header/Header";
import { InternetRequestForm } from "@/components/InternetRequest/InternetRequestForm";

export default function WirelessRegisterPage() {
  return (
    <main className="flex flex-col gap-3">
      <Header title="وایرلس" />
      <InternetRequestForm
        title="درخواست سرویس وایرلس"
        description="اطلاعات هویتی و سرویس وایرلس مورد نظر را تکمیل کنید."
        technologies={["VDSL"]}
        showHeader={false}
      />
    </main>
  );
}