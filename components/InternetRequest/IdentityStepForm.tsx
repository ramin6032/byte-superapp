"use client";

/**
 * مرحله اول فرم درخواست سرویس اینترنت: دریافت و اعتبارسنجی اطلاعات هویتی مشترک
 * شامل نام و نام خانوادگی، شماره موبایل، کد ملی و نشانی.
 *
 * این کامپوننت به‌عنوان یک کامپوننت کلاینتی رندر می‌شود، چون وضعیت فرم و
 * در حال ارسال بودن درخواست را در خود نگه می‌دارد و ارسال فرم را از طریق
 * اکشن سمت سرور `submitIdentityStep` انجام می‌دهد.
 */

import { useState } from "react";
import { Button, Form, Input } from "antd";
import type { Rule } from "antd/es/form";
import { Hash, Phone, User } from "lucide-react";
import { toEnglishDigits } from "@/lib/persian";
import type { IdentityFormValues } from "@/lib/internetRequest";
import { submitIdentityStep } from "@/actions/internetRequestActions";
import type { ActionResult } from "@/actions/internetRequestActions";

/**
 * الگوی اعتبارسنجی شماره موبایل ایرانی: با ۰۹ شروع می‌شود و مجموعاً ۱۱ رقم دارد.
 */
const MOBILE_PATTERN = /^09\d{9}$/;

/**
 * تنظیمات مشترک ظاهری فیلدهای ورودی متنی، تا همه فیلدها یکدست رندر شوند.
 */
const inputProps = {
  variant: "outlined" as const,
  size: "large" as const,
  className: "text-[13px]",
};

/**
 * تنظیمات مشترک آیکون‌های داخل فیلدهای ورودی (ضخامت خط و اندازه).
 */
const iconProps = { strokeWidth: 1, size: 18 } as const;

/**
 * تابع نرمال‌سازی مقدار فیلدهای عددی: ارقام فارسی را به لاتین تبدیل کرده و
 * تمام نویسه‌های غیرعددی را حذف می‌کند تا کد ملی و موبایل فقط از عدد ساخته شوند.
 *
 * @param value - مقدار خام واردشده در فیلد
 * @returns رشته‌ای که تنها شامل ارقام لاتین است
 */
const onlyDigits = (value: string) => toEnglishDigits(value).replace(/\D/g, "");

/**
 * قواعد اعتبارسنجی فیلد نام و نام خانوادگی: اجباری بودن و حداقل طول سه کاراکتر.
 */
const fullNameRules: Rule[] = [
  { required: true, message: "نام و نام خانوادگی را وارد کنید." },
  { min: 3, message: "نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد." },
];

/**
 * قواعد اعتبارسنجی فیلد موبایل: اجباری بودن و تطبیق با الگوی شماره موبایل ایرانی.
 */
const mobileRules: Rule[] = [
  {
    required: true,
    message: "شماره موبایل را وارد کنید.",
  },
  {
    validator: (_, value: string) =>
      MOBILE_PATTERN.test(value)
        ? Promise.resolve()
        : Promise.reject(
            new Error("شماره موبایل معتبر نیست. نمونه: ۰۹۱۲۳۴۵۶۷۸۹"),
          ),
  },
];

/**
 * قواعد اعتبارسنجی فیلد نشانی: اجباری بودن و حداقل طول ده کاراکتر برای کامل بودن نشانی.
 */
const addressRules: Rule[] = [
  { required: true, message: "نشانی را وارد کنید." },
  { min: 10, message: "نشانی را با جزئیات کامل وارد کنید." },
];

/**
 * قواعد اعتبارسنجی فیلد کد ملی: اجباری بودن، دقیقاً ده رقم بودن و رد کدهای
 * تکراری ساده مانند `1111111111`.
 */
const nationalIdRules: Rule[] = [
  { required: true, message: "کد ملی را وارد کنید." },
  { len: 10, message: "کد ملی باید ۱۰ رقم باشد." },
  {
    validator: (_, value: string) =>
      /^(\d)\1{9}$/.test(value)
        ? Promise.reject(new Error("کد ملی وارد شده معتبر نیست."))
        : Promise.resolve(),
  },
];

/**
 * مرحله هویتی فرم درخواست سرویس اینترنت.
 *
 * مقادیر فرم را جمع‌آوری و اعتبارسنجی می‌کند، سپس آن‌ها را به سرور ارسال
 * می‌کند. در صورت موفقیت، شناسه هویت دریافتی از سرور همراه مقادیر فرم به
 * `onNext` تحویل داده می‌شود؛ در غیر این صورت پیام خطا به `onError` می‌رود.
 *
 * @param props - تنظیمات مرحله هویتی
 * @param props.initialValues - مقادیر اولیه برای پیش‌پر کردن فیلدهای فرم، مثلاً هنگام بازگشت کاربر از مرحله بعد
 * @param props.onNext - تابعی که پس از ثبت موفق، مقادیر فرم و نتیجه سرور (شامل شناسه هویت) را دریافت می‌کند
 * @param props.onError - تابعی که پیام خطای برگشتی از سرور را نمایش می‌دهد
 * @param props.submitLabel - متن دکمه ارسال، با مقدار پیش‌فرض «ثبت و ادامه»
 * @param props.loading - در صورت true بودن، دکمه ارسال در حالت بارگذاری قرار می‌گیرد
 * @returns فرم آنت‌دیزای شامل نام، موبایل، کد ملی، نشانی و دکمه ارسال
 */
export function IdentityStepForm({
  initialValues,
  onNext,
  onError,
  submitLabel = "ثبت و ادامه",
  loading = false,
}: {
  initialValues?: Partial<IdentityFormValues>;
  onNext?: (
    values: IdentityFormValues,
    result: ActionResult<{ identityId: string }>,
  ) => void;
  onError?: (message: string) => void;
  submitLabel?: string;
  loading?: boolean;
}) {
  const [form] = Form.useForm<IdentityFormValues>();
  const [submitting, setSubmitting] = useState(false);
  const isLoading = loading || submitting;

  /**
   * ارسال مقادیر اعتبارسنجی‌شده فرم به اکشن سمت سرور و هدایت نتیجه به
   * فراخوان‌های `onNext` یا `onError`. وضعیت بارگذاری در تمام حالت‌ها
   * (حتی در صورت خطا) بازنشانی می‌شود.
   *
   * @param values - مقادیر نهایی و اعتبارسنجی‌شده فیلدهای فرم
   * @returns پرامیسی که پس از پایان درخواست resolve می‌شود
   */
  const handleFinish = async (values: IdentityFormValues) => {
    setSubmitting(true);
    try {
      const result = await submitIdentityStep(values);
      if (result.ok) {
        onNext?.(values, result);
      } else {
        onError?.(result.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 flex-1">
      <h3 className=" font-bold text-[16px]">اطلاعات هویتی</h3>
      <Form<IdentityFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        size="medium"
        initialValues={initialValues}
        onFinish={handleFinish}
      >
        <Form.Item
          name="fullName"
          label="نام و نام خانوادگی"
          rules={fullNameRules}
          className="!mb-4"
        >
          <Input
            {...inputProps}
            prefix={<User className="text-[#52759F]" {...iconProps} />}
            placeholder="مثال: سارا محمدی"
          />
        </Form.Item>

        <Form.Item
          name="mobile"
          label="شماره موبایل"
          rules={mobileRules}
          normalize={onlyDigits}
          className="!mb-4"
        >
          <Input
            {...inputProps}
            prefix={<Phone className="text-[#52759F]" {...iconProps} />}
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            inputMode="numeric"
            maxLength={11}
            dir="ltr"
          />
        </Form.Item>

        <Form.Item
          name="nationalId"
          label="کد ملی"
          rules={nationalIdRules}
          normalize={onlyDigits}
          className="!mb-4"
        >
          <Input
            {...inputProps}
            prefix={<Hash className="text-[#52759F]" {...iconProps} />}
            placeholder="۱۰ رقم بدون خط تیره"
            inputMode="numeric"
            maxLength={10}
            dir="ltr"
          />
        </Form.Item>

        <Form.Item
          name="address"
          label="نشانی"
          rules={addressRules}
          className="!mb-4"
        >
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 4 }}
            className="text-[13px]"
            placeholder="استان، شهر، خیابان، کوچه و پلاک"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          shape="round"
          loading={isLoading}
        >
          {submitLabel}
        </Button>
      </Form>
    </div>
  );
}
