"use client";

/**
 * فرم تمدید سرویس اینترنت برای یک فناوری مشخص (فیبر نوری، ADSL یا VDSL).
 *
 * کاربر شماره مجازی سرویس را وارد کرده، مدت تمدید و سرویس مورد نظر را
 * انتخاب می‌کند و مبلغ تمدید متناسب با مدت انتخابی نمایش داده می‌شود.
 * ارسال فرم از طریق اکشن سمت سرور `submitServiceRenewal` انجام می‌شود.
 *
 * این کامپوننت به‌عنوان یک کامپوننت کلاینتی رندر می‌شود، چون فیلدهای فرم،
 * وضعیت ارسال و اعلان‌ها را در خود مدیریت می‌کند.
 */

import { useState } from "react";
import { Button, Form, Input, Segmented, Select, Tag, App } from "antd";
import type { Rule } from "antd/es/form";
import { Hash, RefreshCw } from "lucide-react";
import {
  DURATION_LABELS,
  getDurationLabel,
  getServicePlans,
  TECHNOLOGY_LABELS,
  type ServiceDuration,
  type ServiceTechnology,
} from "@/lib/internetRequest";
import { toEnglishDigits, formatPrice } from "@/lib/persian";
import {
  submitServiceRenewal,
  type RenewalActionResult,
} from "@/actions/serviceRenewalActions";

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
 * مقادیر فرم تمدید سرویس.
 *
 * @property virtualNumber - شماره مجازی سرویسی که قرار است تمدید شود
 * @property duration - مدت سرویس انتخاب‌شده
 * @property serviceId - شناسه طرح سرویس انتخاب‌شده
 */
type ServiceRenewalValues = {
  virtualNumber: string;
  duration: ServiceDuration;
  serviceId: string;
};

/**
 * فرم ثبت درخواست تمدید سرویس اینترنت.
 *
 * مدت تمدید و سرویس را انتخاب می‌کند، مبلغ تمدید را بر اساس تعرفه همان مدت
 * نمایش می‌دهد و پس از ارسال فرم، پیام موفقیت یا خطا را با سیستم اعلان
 * آنت‌دیزای `App.useApp` نشان می‌دهد.
 *
 * @param props - تنظیمات فرم تمدید
 * @param props.technology - فناوری سرویسی که فرم برای آن تمدید می‌شود، با مقدار پیش‌فرض فیبر نوری
 * @param props.onSuccess - تابعی که پس از ثبت موفق، مبلغ تعرفه تمدید را دریافت می‌کند
 * @returns فرم آنت‌دیزای شامل فیلد شماره مجازی، انتخاب مدت، انتخاب سرویس، خلاصه مبلغ و دکمه ثبت درخواست
 */
export function ServiceRenewalForm({
  technology = "FTTH",
  onSuccess,
}: {
  technology?: ServiceTechnology;
  onSuccess?: (result: { tariff: number }) => void;
}) {
  const { message } = App.useApp();
  const [form] = Form.useForm<ServiceRenewalValues>();
  const [submitting, setSubmitting] = useState(false);

  const duration = Form.useWatch("duration", form) ?? 3;
  const serviceId = Form.useWatch("serviceId", form);

  /**
   * طرح‌های سرویس متعلق به فناوری انتخاب‌شده که تنها در این فرم قابل انتخاب هستند.
   */
  const plans = getServicePlans([technology]);
  const selectedService = plans.find((plan) => plan.id === serviceId);
  const technologyLabel = TECHNOLOGY_LABELS[technology];

  /**
   * تبدیل طرح‌های سرویس به گزینه‌های قابل استفاده در کامپوننت `Select`.
   */
  const serviceOptions = plans.map((plan) => ({
    value: plan.id,
    label: plan.name,
    speed: plan.speed,
    tariffs: plan.tariffs,
  }));

  /**
   * مبلغ تمدید بر اساس مدت انتخابی؛ در صورت انتخاب نشدن سرویس صفر است.
   */
  const tariff = selectedService ? selectedService.tariffs[duration] : 0;

  /**
   * ارسال مقادیر اعتبارسنجی‌شده فرم به اکشن سمت سرور و پاس دادن نتیجه
   * به `handleResult`. وضعیت بارگذاری در تمام حالت‌ها بازنشانی می‌شود.
   *
   * @param values - مقادیر نهایی و اعتبارسنجی‌شده فیلدهای فرم
   * @returns پرامیسی که پس از پایان درخواست resolve می‌شود
   */
  const handleFinish = async (values: ServiceRenewalValues) => {
    setSubmitting(true);
    try {
      const result = await submitServiceRenewal({ ...values, technology });
      handleResult(result);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * نمایش اعلان مربوط به نتیجه تمدید: نمایش خطا در صورت ناموفق بودن و در
   * غیر این صورت اعلان موفقیت و فراخوانی `onSuccess` با داده بازگشتی سرور.
   *
   * @param result - نتیجه اکشن سمت سرور شامل وضعیت، پیام و داده تعرفه
   * @returns بدون مقدار بازگشتی؛ اثر آن نمایش اعلان است
   */
  const handleResult = (result: RenewalActionResult) => {
    if (!result.ok) {
      message.error(result.message);
      return;
    }
    message.success("درخواست تمدید سرویس ثبت شد.");
    onSuccess?.(result.data);
  };

  return (
    <Form<ServiceRenewalValues>
      form={form}
      layout="vertical"
      requiredMark={false}
      size="large"
      initialValues={{ duration: 3 }}
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
        name="duration"
        label="مدت سرویس"
        rules={[{ required: true, message: "مدت سرویس را انتخاب کنید." }]}
        className="!mb-4"
      >
        <Segmented<ServiceDuration>
          block
          options={DURATION_LABELS.map((item) => ({
            label: item.shortLabel,
            value: item.value,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="serviceId"
        label="سرویس و تعرفه"
        rules={[{ required: true, message: "سرویس مورد نظر را انتخاب کنید." }]}
        className="!mb-4"
      >
        <Select
          showSearch
          placeholder={`جستجوی سرویس ${technologyLabel}`}
          optionFilterProp="label"
          optionRender={(option) => {
            const data = option.data as (typeof serviceOptions)[number];
            return (
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col items-start text-right">
                  <span className="text-[13px] font-medium text-[#081D5D]">
                    {data.label}
                  </span>
                  <span className="text-[11px] text-[#52759F]">{data.speed}</span>
                </div>
                <Tag color="blue" className="!text-[11px] !m-0">
                  {formatPrice(data.tariffs[duration])}
                </Tag>
              </div>
            );
          }}
          options={serviceOptions}
          optionLabelProp="label"
        />
      </Form.Item>

      <div className="w-full rounded-[18px] bg-[#F3F6FE] p-4 space-y-1.5 mb-4">
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-[#52759F]">
            سرویس ({getDurationLabel(duration)})
          </span>
          <span className="text-[#081D5D] font-medium">
            {selectedService ? selectedService.name : "انتخاب نشده"}
          </span>
        </div>
        <div className="flex items-center justify-between text-[13px] pt-1.5 border-t border-dashed border-[#52759F]/30">
          <span className="text-[#52759F]">مبلغ تمدید</span>
          <span className="text-[#0C6FFF] font-bold">{formatPrice(tariff)}</span>
        </div>
      </div>

      <Button
        type="primary"
        htmlType="submit"
        block
        shape="round"
        loading={submitting}
        icon={<RefreshCw {...iconProps} />}
      >
        ثبت درخواست تمدید
      </Button>
    </Form>
  );
}