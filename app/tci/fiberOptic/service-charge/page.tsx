/**
 * صفحه شارژ مجدد سرویس فیبر نوری (TCI).
 *
 * مسیر: `/tci/fiberOptic/service-charge` — کامپوننت سرور با هدر، توضیحات و فرم شارژ.
 *
 * @returns صفحه شارژ مجدد سرویس فیبر نوری
 */
import { IntroductionHeader } from "@/components/Introduction/Header";
import { ServiceChargeForm } from "@/components/Tci/ServiceChargeForm";

export default function FiberServiceChargePage() {
  return (
    <main className="flex flex-col gap-3">
      <IntroductionHeader title="شارژ مجدد فیبر نوری" />
      <section className="bg-white rounded-3xl shadow-[0px_4px_12px_0px_rgba(175,186,205,0.37)] p-4">
        <h2 className="text-[#081D5D] text-[13px] font-bold text-right mb-3">
          شارژ مجدد سرویس
        </h2>
        <p className="text-[#52759F] text-[12px] font-light text-right m-0 mb-4">
          شماره مجازی سرویس را وارد کنید و بستهٔ ترافیک مورد نظر را انتخاب کنید.
        </p>
        <ServiceChargeForm technology="FTTH" />
      </section>
    </main>
  );
}