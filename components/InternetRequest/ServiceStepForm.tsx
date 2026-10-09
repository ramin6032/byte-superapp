"use client";

/**
 * مرحله دوم فرم درخواست سرویس اینترنت: انتخاب مدت سرویس، انتخاب سرویس و
 * تعرفه، و انتخاب تجهیزات جانبی به‌همراه نمایش خلاصه و محاسبه مبلغ کل.
 *
 * این کامپوننت به‌عنوان یک کامپوننت کلاینتی رندر می‌شود، چون مقادیر فرم را
 * به‌صورت زنده مشاهده می‌کند، مبلغ تعرفه را محاسبه می‌کند و ارسال فرم را از
 * طریق اکشن سمت سرور `submitServiceStep` انجام می‌دهد.
 */

import { useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Segmented,
  Select,
  Tag,
  Typography,
} from "antd";
import { ArrowRight, Package } from "lucide-react";
import {
  DURATION_LABELS,
  getEquipmentOptions,
  getServicePlans,
  getDurationLabel,
  type ServiceDuration,
  type ServiceFormValues,
  type ServiceTechnology,
} from "@/lib/internetRequest";
import { formatPrice } from "@/lib/persian";
import { submitServiceStep } from "@/actions/internetRequestActions";

/**
 * تنظیمات مشترک آیکون‌های این فرم (ضخامت خط و اندازه).
 */
const iconProps = { strokeWidth: 1, size: 18 } as const;

/**
 * ساختار گزینه‌های سرویس که به کامپوننت `Select` داده می‌شود؛ علاوه بر
 * `value` و `label` استاندارد آنت‌دیزای، اطلاعات نمایشی و تعرفه‌های سرویس
 * را نیز برای رندر سفارشی هر گزینه در اختیار دارد.
 *
 * @property value - شناسه یکتای طرح سرویس
 * @property label - نام نمایشی طرح سرویس
 * @property technology - فناوری سرویس مانند FTTH یا ADSL
 * @property speed - سرعت سرویس به‌صورت متن
 * @property tariffs - نقشه مدت سرویس به مبلغ تعرفه
 */
type ServiceOption = {
  value: string;
  label: string;
  technology: ServiceTechnology;
  speed: string;
  tariffs: Record<ServiceDuration, number>;
};

/**
 * نتیجه محاسبه‌شده مالی مرحله سرویس که به همراه مقادیر فرم از سرور بازگردانده می‌شود.
 *
 * @property serviceTariff - مبلغ تعرفه سرویس انتخاب‌شده بر اساس مدت انتخابی
 * @property equipmentTariff - جمع مبالغ تجهیزات جانبی انتخاب‌شده
 */
export type ServiceStepResult = {
  serviceTariff: number;
  equipmentTariff: number;
};

/**
 * مرحله انتخاب سرویس و تجهیزات در فرم درخواست اینترنت.
 *
 * با توجه به مدت سرویس انتخابی، تعرفه سرویس و جمع تجهیزات جانبی را محاسبه
 * می‌کند و خلاصه مبلغ را نمایش می‌دهد؛ سپس درخواست را از طریق اکشن
 * سمت سرور `submitServiceStep` ثبت می‌کند.
 *
 * @param props - تنظیمات مرحله سرویس
 * @param props.initialValues - مقادیر اولیه فرم شامل مدت، سرویس و تجهیزات انتخاب‌شده
 * @param props.onBack - تابعی که هنگام کلیک روی دکمه «مرحله قبل» برای بازگشت به مرحله هویتی صدا زده می‌شود؛ در صورت نبود، دکمه بازگشت نمایش داده نمی‌شود
 * @param props.onSubmit - تابعی که پس از ثبت موفق، مقادیر فرم و تفکیک مبالغ تعرفه سرویس و تجهیزات را دریافت می‌کند
 * @param props.onError - تابعی که پیام خطای برگشتی از سرور را نمایش می‌دهد
 * @param props.submitLabel - متن دکمه ارسال، با مقدار پیش‌فرض «ثبت نهایی درخواست»
 * @param props.technologies - فهرست فناوری‌های مجاز؛ در صورت ارسال، فقط طرح‌های سرویس با این فناوری‌ها نمایش داده می‌شوند
 * @param props.loading - در صورت true بودن، دکمه ارسال در حالت بارگذاری قرار می‌گیرد
 * @returns فرم آنت‌دیزای شامل انتخاب مدت، انتخاب سرویس، چک‌باکس تجهیزات، خلاصه مبلغ و دکمه‌های اقدام
 */
export function ServiceStepForm({
  initialValues,
  onBack,
  onSubmit,
  onError,
  submitLabel = "ثبت نهایی درخواست",
  technologies,
  loading = false,
}: {
  initialValues?: Partial<ServiceFormValues>;
  onBack?: () => void;
  onSubmit?: (values: ServiceFormValues, result: ServiceStepResult) => void;
  onError?: (message: string) => void;
  submitLabel?: string;
  technologies?: ServiceTechnology[];
  loading?: boolean;
}) {
  const [form] = Form.useForm<ServiceFormValues>();
  const [submitting, setSubmitting] = useState(false);
  const isLoading = loading || submitting;

  /**
   * طرح‌های سرویس مجاز: در صورت محدود شدن به فناوری‌های مشخص، فقط طرح‌های
   * منطبق با آن فناوری‌ها باقی می‌مانند.
   */
  const availablePlans = getServicePlans(technologies);

  /**
   * تجهیزات جانبی سازگار با فناوری‌های مجاز؛ تجهیزاتی مانند مبدل نوری تنها
   * برای سرویس‌های فیبر نوری نمایش داده می‌شوند.
   */
  const availableEquipment = getEquipmentOptions(technologies);

  /**
   * تبدیل طرح‌های سرویس مجاز به گزینه‌های قابل استفاده در کامپوننت `Select`.
   */
  const serviceOptions = availablePlans.map((plan) => ({
    value: plan.id,
    label: plan.name,
    technology: plan.technology,
    speed: plan.speed,
    tariffs: plan.tariffs,
  }));
  const duration =
    Form.useWatch("duration", form) ?? initialValues?.duration ?? 3;
  const serviceId =
    Form.useWatch("serviceId", form) ?? initialValues?.serviceId;
  const equipmentIds =
    Form.useWatch("equipmentIds", form) ?? initialValues?.equipmentIds ?? [];

  const selectedService = availablePlans.find((plan) => plan.id === serviceId);

  /**
   * تعرفه سرویس انتخاب‌شده متناسب با مدت سرویس؛ در صورت انتخاب نشدن سرویس صفر است.
   */
  const serviceTariff = selectedService ? selectedService.tariffs[duration] : 0;

  /**
   * جمع قیمت تجهیزات جانبی انتخاب‌شده؛ شناسه‌های ناشناخته قیمت صفر در نظر گرفته می‌شوند.
   */
  const equipmentTariff = equipmentIds.reduce(
    (sum, id) =>
      sum +
      (availableEquipment.find((item) => item.id === id)?.price ?? 0),
    0,
  );

  /**
   * ارسال مقادیر اعتبارسنجی‌شده فرم به اکشن سمت سرور و هدایت نتیجه به
   * `onSubmit` یا `onError`. فهرست فناوری‌های مجاز نیز ارسال می‌شود تا اعتبارسنجی
   * سرویس و تجهیزات در سمت سرور هم با همین محدودیت‌ها انجام شود.
   *
   * @param values - مقادیر نهایی و اعتبارسنجی‌شده فیلدهای فرم
   * @returns پرامیسی که پس از پایان درخواست resolve می‌شود
   */
  const handleFinish = async (values: ServiceFormValues) => {
    setSubmitting(true);
    try {
      const result = await submitServiceStep(values, { technologies });
      if (result.ok) {
        onSubmit?.(values, result.data);
      } else {
        onError?.(result.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form<ServiceFormValues>
      form={form}
      layout="vertical"
      requiredMark={false}
      size="medium"
      initialValues={{ duration: 3, equipmentIds: [], ...initialValues }}
      onFinish={handleFinish}
    >
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
        label="نام سرویس و تعرفه"
        rules={[{ required: true, message: "سرویس مورد نظر را انتخاب کنید." }]}
        className="!mb-4"
      >
        <Select
          showSearch
          placeholder="جستجوی سرویس بر اساس نام یا فناوری"
          optionFilterProp="label"
          optionRender={(option) => {
            const data = option.data as ServiceOption;
            return (
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col items-end text-right">
                  <span className="text-[13px] font-medium text-[#081D5D]">
                    {data.label}
                  </span>
                  <span className="text-[11px] text-[#52759F]">
                    {data.technology} • {data.speed}
                  </span>
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

      <Form.Item name="equipmentIds" label="تجهیزات جانبی" className="!mb-4">
        <Checkbox.Group className="!w-full">
          <div className="!w-full flex flex-col gap-1.5">
            {availableEquipment.map((option) => (
              <Checkbox
                key={option.id}
                value={option.id}
                className="!w-full !m-0 !p-3 !rounded-[18px] !bg-[#F3F6FE] hover:!bg-[#F3F6FE]/70 !transition-colors"
                rootClassName="w-full"
                classNames={{ label: "w-full" }}
              >
                <span className="!w-full flex items-center justify-between gap-5">
                  <span className="flex items-center gap-3 min-w-0">
                    <span className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-white text-[#0C6FFF] shrink-0">
                      <Package {...iconProps} />
                    </span>
                    <span className="flex flex-col items-start text-right min-w-0">
                      <span className="text-[#081D5D] text-[13px] font-medium">
                        {option.name}
                      </span>
                      <span className="text-[#52759F] text-[11px] font-light">
                        {option.description}
                      </span>
                    </span>
                  </span>
                  <span className="text-[#0C6FFF] text-[12px] font-medium shrink-0">
                    {option.price === 0 ? "رایگان" : formatPrice(option.price)}
                  </span>
                </span>
              </Checkbox>
            ))}
          </div>
        </Checkbox.Group>
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
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-[#52759F]">تعرفه سرویس</span>
          <span className="text-[#081D5D] font-medium">
            {formatPrice(serviceTariff)}
          </span>
        </div>
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-[#52759F]">تعرفه تجهیزات</span>
          <span className="text-[#081D5D] font-medium">
            {formatPrice(equipmentTariff)}
          </span>
        </div>
        <div className="flex items-center justify-between text-[13px] pt-1.5 border-t border-dashed border-[#52759F]/30">
          <span className="text-[#52759F]">مبلغ کل</span>
          <span className="text-[#0C6FFF] font-bold">
            {formatPrice(serviceTariff + equipmentTariff)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onBack && (
          <Button
            shape="round"
            block
            onClick={onBack}
            icon={<ArrowRight {...iconProps} />}
          >
            مرحله قبل
          </Button>
        )}
        <Button
          type="primary"
          htmlType="submit"
          block
          shape="round"
          loading={isLoading}
        >
          {submitLabel}
        </Button>
      </div>

      <Typography.Paragraph className="!mt-3 !mb-0 !text-[11px] !text-[#52759F] text-center">
        تعرفه‌ها بر اساس مدت انتخابی محاسبه می‌شود و در مرحله بعد قابل ویرایش
        است.
      </Typography.Paragraph>
    </Form>
  );
}
