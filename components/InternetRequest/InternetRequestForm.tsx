"use client";

/**
 * پوسته چندمرحله‌ای فرم درخواست سرویس اینترنت.
 *
 * جریان ثبت درخواست را در دو مرحله مدیریت می‌کند: مرحله هویتی و مرحله
 * انتخاب سرویس و تجهیزات. پس از تکمیل هر دو مرحله، نتیجه نهایی نمایش
 * داده می‌شود و به فراخوان `onSuccess` تحویل می‌گردد.
 *
 * این کامپوننت به‌عنوان یک کامپوننت کلاینتی رندر می‌شود، چون مرحله جاری،
 * اطلاعات هویتی و خلاصه درخواست را در state نگه می‌دارد.
 */

import { useState } from "react";
import { App, Result, Steps } from "antd";
import { IdentityStepForm } from "@/components/InternetRequest/IdentityStepForm";
import { ServiceStepForm } from "@/components/InternetRequest/ServiceStepForm";
import { formatPrice } from "@/lib/persian";
import type {
  IdentityFormValues,
  ServiceFormValues,
  ServiceTechnology,
} from "@/lib/internetRequest";

/**
 * اندیس مرحله اول جریان: دریافت اطلاعات هویتی.
 */
const STEP_IDENTITY = 0;

/**
 * اندیس مرحله دوم جریان: انتخاب سرویس و تجهیزات جانبی.
 */
const STEP_SERVICE = 1;

/**
 * خلاصه نهایی یک درخواست ثبت‌شده، شامل داده‌های هر دو مرحله و تفکیک مبالغ.
 *
 * @property identity - مقادیر مرحله هویتی شامل نام، موبایل، کد ملی و نشانی
 * @property service - مقادیر مرحله سرویس شامل مدت، شناسه سرویس و تجهیزات انتخاب‌شده
 * @property serviceTariff - مبلغ تعرفه سرویس
 * @property equipmentTariff - مبلغ تجهیزات جانبی
 */
export type InternetRequestSummary = {
  identity: IdentityFormValues;
  service: ServiceFormValues;
  serviceTariff: number;
  equipmentTariff: number;
};

/**
 * فرم چندمرحله‌ای ثبت درخواست سرویس اینترنت.
 *
 * نوار مراحل را نمایش می‌دهد و بسته به مرحله جاری، فرم هویتی یا فرم سرویس را
 * رندر می‌کند. پیام‌های موفقیت و خطای هر مرحله را با سیستم اعلان آنت‌دیزای
 * `App.useApp` نمایش می‌دهد و پس از ثبت موفق، نتیجه موفقیت را نمایش داده و
 * به `onSuccess` تحویل می‌دهد.
 *
 * @param props - تنظیمات فرم درخواست
 * @param props.title - عنوانی که در هدر نمایش داده می‌شود، با مقدار پیش‌فرض «درخواست سرویس اینترنت»
 * @param props.description - توضیح زیر عنوان هدر، با مقدار پیش‌فرض راهنمای تکمیل اطلاعات
 * @param props.technologies - فهرست فناوری‌های مجاز برای مرحله سرویس؛ در صورت ارسال، فقط سرویس‌های منطبق نمایش داده می‌شوند
 * @param props.onSuccess - تابعی که پس از ثبت نهایی موفق، خلاصه کامل درخواست را دریافت می‌کند
 * @param props.showHeader - در صورت true بودن (پیش‌فرض)، هدر با عنوان و توضیح نمایش داده می‌شود
 * @returns بخش حاوی هدر اختیاری، نوار مراحل و فرم مرحله جاری، یا صفحه نتیجه موفقیت پس از ثبت نهایی
 */
export function InternetRequestForm({
  title = "درخواست سرویس اینترنت",
  description = "برای ثبت درخواست، اطلاعات هویتی و سرویس مورد نظر را تکمیل کنید.",
  technologies,
  onSuccess,
  showHeader = true,
}: {
  title?: string;
  description?: string;
  technologies?: ServiceTechnology[];
  onSuccess?: (summary: InternetRequestSummary) => void;
  showHeader?: boolean;
}) {
  const { message } = App.useApp();
  const [current, setCurrent] = useState(STEP_IDENTITY);
  const [identity, setIdentity] = useState<IdentityFormValues | undefined>();
  const [summary, setSummary] = useState<InternetRequestSummary | undefined>();

  if (summary) {
    return (
      <Result
        status="success"
        title="درخواست شما ثبت شد"
        subTitle={`کد پیگیری: ${summary.identity.nationalId}`}
        extra={[
          <p key="total" className="!text-[13px] text-[#081D5D]">
            مبلغ کل قابل پرداخت:{" "}
            {formatPrice(summary.serviceTariff + summary.equipmentTariff)}
          </p>,
        ]}
      />
    );
  }

  return (
    <section className="bg-white rounded-3xl  p-4 space-y-4 overflow-y-auto flex-1">
      {showHeader && (
        <header className="space-y-1">
          <h1 className="text-[#081D5D] text-[15px] font-bold text-right">
            {title}
          </h1>
          <p className="text-[#52759F] text-[12px] font-light text-right m-0">
            {description}
          </p>
        </header>
      )}

      {current === STEP_IDENTITY ? (
        <IdentityStepForm
          initialValues={identity}
          onNext={(values) => {
            setIdentity(values);
            setCurrent(STEP_SERVICE);
            message.success("اطلاعات هویتی ثبت شد.");
          }}
          onError={(msg) => message.error(msg)}
        />
      ) : (
        <ServiceStepForm
          technologies={technologies}
          onBack={() => setCurrent(STEP_IDENTITY)}
          onSubmit={(values, result) => {
            if (!identity) return;
            const next: InternetRequestSummary = {
              identity,
              service: values,
              serviceTariff: result.serviceTariff,
              equipmentTariff: result.equipmentTariff,
            };
            setSummary(next);
            onSuccess?.(next);
          }}
          onError={(msg) => message.error(msg)}
        />
      )}
    </section>
  );
}
