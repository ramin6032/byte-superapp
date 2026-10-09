"use client";

/**
 * فرم شارژ مجدد (خرید ترافیک) سرویس اینترنت.
 *
 * کاربر شماره مجازی سرویس را وارد کرده، یکی از بسته‌های شارژ سازگار با فناوری
 * سرویس خود را انتخاب می‌کند و مبلغ شارژ را مشاهده می‌کند. ارسال فرم از طریق
 * اکشن سمت سرور `submitServiceCharge` انجام می‌شود.
 *
 * این کامپوننت به‌عنوان یک کامپوننت کلاینتی رندر می‌شود، چون فیلدهای فرم،
 * وضعیت ارسال و اعلان‌ها را در خود مدیریت می‌کند.
 */

import { useState } from "react";
import { Button, Form, Input, Select, Tag, App } from "antd";
import type { Rule } from "antd/es/form";
import { Hash, RotateCw } from "lucide-react";
import { TECHNOLOGY_LABELS, type ServiceTechnology } from "@/lib/internetRequest";
import { getChargePackages } from "@/lib/serviceCharge";
import { toEnglishDigits, formatPrice, toPersianDigits } from "@/lib/persian";
import {
  submitServiceCharge,
  type ChargeActionResult,
} from "@/actions/serviceChargeActions";

/**
 * تنظیمات مشترک آیکون‌های این فرم (ضخامت خط و اندازه).
 */
const iconProps = { strokeWidth: 1, size: 18 } as const;

/**
 * تنظیمات مشترک ظاهری فیلدهای ورودی متنی، تا همه فیلدها یکدست رندر شوند.
 */
const inputProps = {
  variant: "outlined" as const,
  size: "large" as const,
  className: "text-[13px]",
};

/**
 * تابع نرمال‌سازی مقدار فیلد شماره مجازی: ارقام فارسی را به لاتین تبدیل کرده
 * و نویسه‌های غیرعددی را حذف می‌کند.
 *
 * @param value - مقدار خام واردشده در فیلد
 * @returns رشته‌ای که تنها شامل ارقام لاتین است
 */
const onlyDigits = (value: string) => toEnglishDigits(value).replace(/\D/g, "");

/**
 * قواعد اعتبارسنجی شماره مجازی: اجباری بودن، محدوده طول ۴ تا ۲۰ رقم و
 * اطمینان از عددی بودن کامل مقدار.
 */
const virtualNumberRules: Rule[] = [
  { required: true, message: "شماره مجازی را وارد کنید." },
  { min: 4, max: 20, message: "شماره مجازی باید ۴ تا ۲۰ رقم باشد." },
  {
    validator: (_, value: string) =>
      /^\d{4,20}$/.test(value)
        ? Promise.resolve()
        : Promise.reject(new Error("شماره مجازی معتبر نیست. فقط عدد وارد کنید.")),
  },
];

/**
 * مقادیر فرم شارژ مجدد سرویس.
 *
 * @property virtualNumber - شماره مجازی سرویسی که قرار است شارژ شود
 * @property packageId - شناسهٔ بستهٔ شارژ انتخاب‌شده
 */
type ServiceChargeValues = {
  virtualNumber: string;
  packageId: string;
};

/**
 * نمایش مدت اعتبار بسته به زبان فارسی.
 *
 * @param days - مدت اعتبار بر حسب روز
 * @returns متنی مانند «۳۰ روز» یا «۲ ماه»
 */
const getValidityLabel = (days: number) =>
  days % 30 === 0 && days >= 60
    ? `${toPersianDigits(days / 30)} ماه`
    : `${toPersianDigits(days)} روز`;

/**
 * فرم ثبت درخواست شارژ مجدد سرویس اینترنت.
 *
 * بسته‌های شارژ محدود به فناوری سرویس هستند و مبلغ شارژ بر اساس بستهٔ انتخابی
 * نمایش داده می‌شود. پس از ارسال فرم، پیام موفقیت یا خطا با سیستم اعلان
 * آنت‌دیزای `App.useApp` نشان داده می‌شود.
 *
 * @param props - تنظیمات فرم شارژ
 * @param props.technology - فناوری سرویسی که شارژ برای آن ثبت می‌شود
 * @param props.onSuccess - تابعی که پس از ثبت موفق، مبلغ شارژ و مشخصات بسته را دریافت می‌کند
 * @returns فرم آنت‌دیزای شامل فیلد شماره مجازی، انتخاب بستهٔ شارژ، خلاصه مبلغ و دکمه ثبت درخواست
 */
export function ServiceChargeForm({
  technology,
  onSuccess,
}: {
  technology: ServiceTechnology;
  onSuccess?: (result: {
    price: number;
    packageName: string;
    validityDays: number;
  }) => void;
}) {
  const { message } = App.useApp();
  const [form] = Form.useForm<ServiceChargeValues>();
  const [submitting, setSubmitting] = useState(false);

  const packageId = Form.useWatch("packageId", form);
  const technologyLabel = TECHNOLOGY_LABELS[technology];

  /**
   * بسته‌های شارژ سازگار با فناوری سرویس، تبدیل‌شده به گزینه‌های کامپوننت `Select`.
   */
  const packages = getChargePackages(technology);
  const packageOptions = packages.map((item) => ({
    value: item.id,
    label: item.name,
    volume: item.volume,
    validity: getValidityLabel(item.validityDays),
    price: item.price,
  }));

  const selectedPackage = packages.find((item) => item.id === packageId);
  const price = selectedPackage?.price ?? 0;

  /**
   * ارسال مقادیر اعتبارسنجی‌شده فرم به اکشن سمت سرور و پاس دادن نتیجه به
   * `handleResult`. وضعیت بارگذاری در تمام حالت‌ها بازنشانی می‌شود.
   *
   * @param values - مقادیر نهایی و اعتبارسنجی‌شده فیلدهای فرم
   * @returns پرامیسی که پس از پایان درخواست resolve می‌شود
   */
  const handleFinish = async (values: ServiceChargeValues) => {
    setSubmitting(true);
    try {
      const result = await submitServiceCharge({ ...values, technology });
      handleResult(result);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * نمایش اعلان مربوط به نتیجه شارژ: نمایش خطا در صورت ناموفق بودن و در غیر این
   * صورت اعلان موفقیت و فراخوانی `onSuccess` با داده بازگشتی سرور.
   *
   * @param result - نتیجه اکشن سمت سرور شامل وضعیت، پیام و داده بستهٔ شارژ
   * @returns بدون مقدار بازگشتی؛ اثر آن نمایش اعلان است
   */
  const handleResult = (result: ChargeActionResult) => {
    if (!result.ok) {
      message.error(result.message);
      return;
    }
    message.success("درخواست شارژ مجدد سرویس ثبت شد.");
    onSuccess?.(result.data);
  };

  return (
    <Form<ServiceChargeValues>
      form={form}
      layout="vertical"
      requiredMark={false}
      size="large"
      onFinish={handleFinish}
    >
      <Form.Item
        name="virtualNumber"
        label="شماره مجازی"
        rules={virtualNumberRules}
        normalize={onlyDigits}
        className="!mb-4"
      >
        <Input
          {...inputProps}
          prefix={<Hash className="text-[#52759F]" {...iconProps} />}
          placeholder="شماره مجازی سرویس را وارد کنید"
          inputMode="numeric"
          maxLength={20}
          dir="ltr"
        />
      </Form.Item>

      <Form.Item
        name="packageId"
        label="بسته شارژ"
        rules={[{ required: true, message: "بستهٔ شارژ را انتخاب کنید." }]}
        className="!mb-4"
      >
        <Select
          showSearch
          placeholder={`جستجوی بستهٔ شارژ ${technologyLabel}`}
          optionFilterProp="label"
          optionRender={(option) => {
            const data = option.data as (typeof packageOptions)[number];
            return (
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col items-start text-right">
                  <span className="text-[13px] font-medium text-[#081D5D]">
                    {data.label}
                  </span>
                  <span className="text-[11px] text-[#52759F]">
                    اعتبار {data.validity}
                  </span>
                </div>
                <Tag color="blue" className="!text-[11px] !m-0">
                  {formatPrice(data.price)}
                </Tag>
              </div>
            );
          }}
          options={packageOptions}
          optionLabelProp="label"
        />
      </Form.Item>

      <div className="w-full rounded-[18px] bg-[#F3F6FE] p-4 space-y-1.5 mb-4">
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-[#52759F]">بستهٔ شارژ</span>
          <span className="text-[#081D5D] font-medium">
            {selectedPackage ? selectedPackage.name : "انتخاب نشده"}
          </span>
        </div>
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-[#52759F]">مدت اعتبار</span>
          <span className="text-[#081D5D] font-medium">
            {selectedPackage
              ? getValidityLabel(selectedPackage.validityDays)
              : "—"}
          </span>
        </div>
        <div className="flex items-center justify-between text-[13px] pt-1.5 border-t border-dashed border-[#52759F]/30">
          <span className="text-[#52759F]">مبلغ شارژ</span>
          <span className="text-[#0C6FFF] font-bold">{formatPrice(price)}</span>
        </div>
      </div>

      <Button
        type="primary"
        htmlType="submit"
        block
        shape="round"
        loading={submitting}
        icon={<RotateCw {...iconProps} />}
      >
        ثبت درخواست شارژ مجدد
      </Button>
    </Form>
  );
}
