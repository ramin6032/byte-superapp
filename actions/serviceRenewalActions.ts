"use server";

/**
 * اکشن سمت سرور مربوط به تمدید سرویس اینترنت برای یک شمارهٔ مجازی.
 *
 * شمارهٔ مجازی باید ۴ تا ۲۰ رقم باشد و سرویس انتخابی باید متعلق به فناوری
 * اعلام‌شده در درخواست باشد؛ بنابراین یک سرویس فیبر نوری نمی‌تواند به‌جای
 * سرویس ADSL تمدید شود.
 */

import {
  SERVICE_DURATIONS,
  SERVICE_PLANS,
  isServiceTechnology,
  type ServiceDuration,
  type ServiceTechnology,
} from "@/lib/internetRequest";

/**
 * نتیجهٔ اکشن تمدید سرویس.
 *
 * @property ok - `true` در صورت موفقیت و `false` در صورت وجود خطای اعتبارسنجی
 * @property data - شیء شامل تعرفهٔ محاسبه‌شده، تنها در حالت موفق
 * @property message - پیام خطای قابل نمایش به کاربر، تنها در حالت ناموفق
 */
export type RenewalActionResult =
  | { ok: true; data: { tariff: number } }
  | { ok: false; message: string };

/**
 * مقادیر فرم تمدید سرویس.
 *
 * @property virtualNumber - شمارهٔ مجازی که سرویس برای آن تمدید می‌شود
 * @property duration - مدت سرویس به ماه
 * @property serviceId - شناسهٔ سرویس انتخاب‌شده
 * @property technology - فناوری سرویسی که تمدید برای آن ثبت می‌شود
 */
export type ServiceRenewalValues = {
  virtualNumber: string;
  duration: ServiceDuration;
  serviceId: string;
  technology: ServiceTechnology;
};

/** الگوی شمارهٔ مجازی: فقط عدد و بین ۴ تا ۲۰ رقم. */
const VIRTUAL_NUMBER_PATTERN = /^\d{4,20}$/;

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
 * اعتبارسنجی اطلاعات تمدید سرویس و محاسبهٔ تعرفهٔ آن.
 *
 * @param payload - داده‌های فرم شامل شمارهٔ مجازی، مدت سرویس، شناسهٔ سرویس و فناوری
 * @returns در حالت موفق، شیء شامل تعرفهٔ سرویس و در غیر این صورت پیام خطای فارسی برای نمایش به کاربر
 */
export async function submitServiceRenewal(
  payload: ServiceRenewalValues,
): Promise<RenewalActionResult> {
  if (!isRecord(payload)) {
    return { ok: false, message: "اطلاعات ارسالی نامعتبر است." };
  }

  const virtualNumber = readString(payload, "virtualNumber");
  if (!VIRTUAL_NUMBER_PATTERN.test(virtualNumber)) {
    return {
      ok: false,
      message: "شماره مجازی معتبر نیست. فقط عدد و بین ۴ تا ۲۰ رقم.",
    };
  }

  const duration = SERVICE_DURATIONS.find(
    (item) => item === payload.duration,
  );
  if (!duration) {
    return { ok: false, message: "مدت سرویس را انتخاب کنید." };
  }

  if (!isServiceTechnology(payload.technology)) {
    return { ok: false, message: "فناوری سرویس معتبر نیست." };
  }

  const technology = payload.technology;
  const serviceId = readString(payload, "serviceId");
  const service = SERVICE_PLANS.find(
    (plan) => plan.id === serviceId && plan.technology === technology,
  );
  if (!service) {
    return { ok: false, message: "سرویس مورد نظر را انتخاب کنید." };
  }

  return { ok: true, data: { tariff: service.tariffs[duration] } };
}
