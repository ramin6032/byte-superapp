/**
 * صفحه درخواست سرویس اینترنت (TCI).
 *
 * مسیر: `/tci/internetRequest` — کامپوننت سرور با هدر مقدمه و فرم درخواست.
 *
 * @returns صفحه درخواست اینترنت
 */
import { IntroductionHeader } from "@/components/Introduction/Header";
import { InternetRequestForm } from "@/components/InternetRequest/InternetRequestForm";

/**
 * رندر صفحه درخواست سرویس اینترنت با فرم دو مرحله‌ای.
 *
 * @returns المان صفحه شامل هدر بازگشت و فرم درخواست اینترنت
 */
export default function InternetRequestPage() {
  return (
    <main className="flex flex-col gap-3">
      <IntroductionHeader title="درخواست سرویس اینترنت" />
      <InternetRequestForm showHeader={false} />
    </main>
  );
}
