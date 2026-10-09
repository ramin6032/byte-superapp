/**
 * صفحه تمدید سرویس فیبر نوری (TCI).
 *
 * مسیر: `/tci/fiberOptic/service-renewal` — کامپوننت سرور با هدر، توضیحات و فرم تمدید.
 *
 * @returns صفحه تمدید سرویس فیبر
 */
import { IntroductionHeader } from "@/components/Introduction/Header";
import { ServiceRenewalForm } from "@/components/Tci/ServiceRenewalForm";

/**
 * رندر صفحه تمدید سرویس فیبر نوری.
 *
 * @returns المان صفحه شامل هدر بازگشت و فرم تمدید سرویس
 */
export default function FiberServiceRenewalPage() {
  return (
    <main className="flex flex-col gap-3">
      <IntroductionHeader title="تمدید سرویس فیبر نوری" />
      <section className="bg-white rounded-3xl shadow-[0px_4px_12px_0px_rgba(175,186,205,0.37)] p-4">
        <h2 className="text-[#081D5D] text-[13px] font-bold text-right mb-3">
          تمدید سرویس
        </h2>
        <p className="text-[#52759F] text-[12px] font-light text-right m-0 mb-4">
          شماره مجازی سرویس را وارد کنید و مدت و سرویس مورد نظر را انتخاب کنید.
        </p>
        <ServiceRenewalForm />
      </section>
    </main>
  );
}