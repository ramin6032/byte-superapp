"use server";

/**
 * اکشن‌های سمت سرور مربوط به فرآیند ثبت درخواست اینترنت.
 *
 * این ماژول دو مرحله از ثبت درخواست را بر عهده دارد: مرحله نخست هویت مشترک
 * (نام، موبایل، نشانی و کد ملی) و مرحله دوم انتخاب سرویس و تجهیزات.
 * خروجی هر اکشن به صورت یک discriminated union بازگردانده می‌شود تا مصرف‌کننده
 * بتواند بر اساس مقدار `ok` مسیر موفق یا خطا را به‌صورت type-safe تشخیص دهد.
 */

import {
  SERVICE_DURATIONS,
  SERVICE_PLANS,
  getEquipmentOptions,
  isServiceTechnology,
  type IdentityFormValues,
  type ServiceDuration,
  type ServiceFormValues,
  type ServiceTechnology,
} from "@/lib/internetRequest";

/**
 * نتیجهٔ استاندارد اکشن‌های این ماژول.
 *
 * @typeParam T - نوع دادهٔ برگشتی در حالت موفق
 * @property ok - `true` در صورت موفقیت و `false` در صورت وجود خطای اعتبارسنجی
 * @property data - دادهٔ نوع `T` که تنها در حالت موفق مقدار دارد
 * @property message - پیام خطای قابل نمایش به کاربر که تنها در حالت ناموفق مقدار دارد
 */
export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

/** الگوی استاندارد شماره موبایل ایران: با `09` آغاز می‌شود و ۱۱ رقم دارد. */
const MOBILE_PATTERN = /^09\d{9}$/;

/** الگوی ساختاری کد ملی: دقیقاً ۱۰ رقم. */
const NATIONAL_ID_PATTERN = /^\d{10}$/;

/**
 * اعتبارسنجی کد ملی ایران با استفاده از الگوریتم رقم کنترلی.
 *
 * کدهایی که هر ده رقم آن‌ها یکسان باشند (مانند `0000000000`) به‌عنوان کد نامعتبر رد می‌شوند.
 *
 * @param value - کد ملی به‌صورت رشتهٔ عددی
 * @returns `true` اگر کد ملی معتبر باشد، در غیر این صورت `false`
 */
const isValidNationalId = (value: string) => {
  if (!NATIONAL_ID_PATTERN.test(value)) return false;
  if (/^(\d)\1{9}$/.test(value)) return false;

  const check = Number(value[9]);
  const base = value
    .slice(0, 9)
    .split("")
    .reduce((sum, digit, index) => sum + Number(digit) * (10 - index), 0);
  const remainder = base % 11;

  if (remainder < 2) return check === remainder;
  return check === 11 - remainder;
};

/** نوع‌نگهبان بررسی می‌کند که مقدار ورودی یک شیء (و نه `null`) باشد. */
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/**
 * خواندن یک مقدار رشته‌ای از یک شیء ناشناخته و حذف فاصله‌های ابتدا و انتها.
 *
 * @param source - شیء مبدأ که از آن مقدار خوانده می‌شود
 * @param key - کلید موردنظر در شیء مبدأ
 * @returns رشتهٔ بریده‌شده، یا رشتهٔ خالی در صورتی که مقدار از نوع رشته نباشد
 */
const readString = (source: Record<string, unknown>, key: string) => {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
};

/**
 * تبدیل مقدار ناشناخته به یک مدت سرویس معتبر.
 *
 * @param value - مقدار دریافتی از فرم که ممکن است از فهرست مدت‌های مجاز نباشد
 * @returns مدت سرویس معتبر، یا `null` در صورت نامعتبر بودن مقدار
 */
const readDuration = (value: unknown): ServiceDuration | null =>
  SERVICE_DURATIONS.find((duration) => duration === value) ?? null;

/**
 * اعتبارسنجی و پردازش مرحلهٔ نخست ثبت درخواست، یعنی اطلاعات هویتی مشترک.
 *
 * @param payload - داده‌های فرم شامل نام و نام خانوادگی، موبایل، نشانی و کد ملی
 * @returns در حالت موفق، شناسهٔ هویت (کد ملی) و در غیر این صورت پیام خطای فارسی برای نمایش به کاربر
 */
export async function submitIdentityStep(
  payload: IdentityFormValues,
): Promise<ActionResult<{ identityId: string }>> {
  if (!isRecord(payload)) {
    return { ok: false, message: "اطلاعات ارسالی نامعتبر است." };
  }

  const fullName = readString(payload, "fullName");
  const mobile = readString(payload, "mobile");
  const address = readString(payload, "address");
  const nationalId = readString(payload, "nationalId");

  if (fullName.length < 3) {
    return { ok: false, message: "نام و نام خانوادگی را کامل وارد کنید." };
  }

  if (!MOBILE_PATTERN.test(mobile)) {
    return { ok: false, message: "شماره موبایل معتبر نیست." };
  }

  if (address.length < 10) {
    return { ok: false, message: "نشانی را با جزئیات کامل وارد کنید." };
  }

  if (!isValidNationalId(nationalId)) {
    return { ok: false, message: "کد ملی وارد شده معتبر نیست." };
  }

  return {
    ok: true,
    data: { identityId: nationalId },
  };
}

/**
 * اعتبارسنجی و محاسبهٔ هزینهٔ مرحلهٔ دوم ثبت درخواست، یعنی سرویس و تجهیزات.
 *
 * شناسه‌های تجهیزات نامعتبر حذف و شناسه‌های تکراری یکسان‌سازی می‌شوند؛ سپس تعرفهٔ سرویس
 * و مجموع قیمت تجهیزات انتخاب‌شده جداگانه محاسبه می‌شود. در صورت ارسال
 * `options.technologies`، سرویس و تجهیزات باید با یکی از آن فناوری‌ها سازگار باشند.
 *
 * @param payload - داده‌های فرم شامل مدت سرویس، شناسهٔ سرویس و آرایهٔ شناسهٔ تجهیزات
 * @param options - تنظیمات اختیاری اعتبارسنجی، شامل فهرست فناوری‌های مجاز
 * @returns در حالت موفق، تعرفهٔ سرویس و تعرفهٔ تجهیزات، و در غیر این صورت پیام خطای فارسی برای نمایش به کاربر
 */
export async function submitServiceStep(
  payload: ServiceFormValues,
  options?: { technologies?: string[] },
): Promise<ActionResult<{ serviceTariff: number; equipmentTariff: number }>> {
  if (!isRecord(payload)) {
    return { ok: false, message: "اطلاعات ارسالی نامعتبر است." };
  }

  const duration = readDuration(payload.duration);
  if (!duration) {
    return { ok: false, message: "مدت سرویس را انتخاب کنید." };
  }

  const technologies = Array.isArray(options?.technologies)
    ? options?.technologies.filter((item): item is ServiceTechnology =>
        isServiceTechnology(item),
      )
    : undefined;

  const serviceId = readString(payload, "serviceId");
  const service = SERVICE_PLANS.find(
    (plan) =>
      plan.id === serviceId &&
      (!technologies || technologies.includes(plan.technology)),
  );
  if (!service) {
    return { ok: false, message: "سرویس مورد نظر را انتخاب کنید." };
  }

  const allowedEquipment = getEquipmentOptions(technologies);
  const rawEquipmentIds = payload.equipmentIds;
  const equipmentIds = Array.isArray(rawEquipmentIds)
    ? rawEquipmentIds.filter(
        (id): id is string =>
          typeof id === "string" &&
          allowedEquipment.some((option) => option.id === id),
      )
    : [];

  const uniqueEquipmentIds = Array.from(new Set(equipmentIds));
  const serviceTariff = service.tariffs[duration];
  const equipmentTariff = uniqueEquipmentIds.reduce(
    (sum, id) =>
      sum + (allowedEquipment.find((item) => item.id === id)?.price ?? 0),
    0,
  );

  return {
    ok: true,
    data: { serviceTariff, equipmentTariff },
  };
}
