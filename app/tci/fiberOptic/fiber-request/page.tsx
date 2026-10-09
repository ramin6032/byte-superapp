/**
 * صفحه درخواست فیبر نوری (TCI).
 *
 * مسیر: `/tci/fiberOptic/fiber-request` — کامپوننت سرور با هدر و فرم درخواست اختصاصی FTTH.
 *
 * @returns صفحه درخواست فیبر نوری
 */
import { IntroductionHeader } from "@/components/Introduction/Header";
import { InternetRequestForm } from "@/components/InternetRequest/InternetRequestForm";

/**
 * رندر صفحه ثبت درخواست سرویس فیبر نوری.
 *
 * فرم دومرحله‌ای فقط با سرویس‌های فیبر نوری (`FTTH`) ارائه می‌شود.
 *
 * @returns المان صفحه شامل هدر بازگشت و فرم دو مرحله‌ای درخواست
 */
export default function FiberRequestPage() {
  return (
    <main className="flex flex-col gap-3">
      <IntroductionHeader title="درخواست فیبر نوری" />
      <InternetRequestForm
        title="درخواست سرویس فیبر نوری"
        description="اطلاعات هویتی و سرویس فیبر نوری مورد نظر را تکمیل کنید."
        technologies={["FTTH"]}
        showHeader={false}
      />
    </main>
  );
}