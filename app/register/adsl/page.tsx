/**
 * صفحه ثبت‌نام اینرنرت خانگی بایت.
 *
 * مسیر: `/register/adsl` — کامپوننت سرور با هدر و فرم درخواست اختصاصی بایت.
 *
 * @returns صفحه ثبت‌نام بایت
 */
import { Header } from "@/components/Header/Header";
import { InternetRequestForm } from "@/components/InternetRequest/InternetRequestForm";

export default function ByteRegisterPage() {
  return (
    <main className="flex flex-col gap-3">
      <Header title="اینرنرت خانگی بایت" />
      <InternetRequestForm
        title="درخواست سرویس اینرنرت خانگی بایت"
        description="اطلاعات هویتی و سرویس بایت مورد نظر را تکمیل کنید."
        technologies={["BYTE"]}
        showHeader={false}
      />
    </main>
  );
}
