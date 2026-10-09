"use server";

/**
 * اکشن سمت سرور مربوط به شارژ مجدد (خرید ترافیک) سرویس اینترنت.
 *
 * شمارهٔ مجازی باید ۴ تا ۲۰ رقم باشد و بستهٔ انتخاب‌شده باید متعلق به فناوری
 * اعلام‌شده در درخواست باشد؛ بنابراین یک بستهٔ فیبر نوری برای سرویس ADSL
 * پذیرفته نمی‌شود.
 */

import { isServiceTechnology } from "@/lib/internetRequest";
import { findChargePackage } from "@/lib/serviceCharge";
import type { ChargeValues } from "@/lib/serviceCharge";

/**
 * نتیجهٔ اکشن شارژ مجدد سرویس.
 *
 * @property ok - `true` در صورت موفقیت و `false` در صورت وجود خطای اعتبارسنجی
 * @property data - شیء شامل مبلغ شارژ و اعتبار بسته، تنها در حالت موفق
 * @property message - پیام خطای قابل نمایش به کاربر، تنها در حالت ناموفق
 */
export type ChargeActionResult =
  | { ok: true; data: { price: number; packageName: string; validityDays: number } }
  | { ok: false; message: string };

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
 * اعتبارسنجی اطلاعات شارژ مجدد و محاسبهٔ مبلغ آن.
 *
 * @param payload - داده‌های فرم شامل شمارهٔ مجازی، شناسهٔ بسته و فناوری سرویس
 * @returns در حالت موفق، مبلغ شارژ و مشخصات بسته و در غیر این صورت پیام خطای فارسی برای نمایش به کاربر
 */
export async function submitServiceCharge(
  payload: ChargeValues,
): Promise<ChargeActionResult> {
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

  if (!isServiceTechnology(payload.technology)) {
    return { ok: false, message: "فناوری سرویس معتبر نیست." };
  }

  const packageId = readString(payload, "packageId");
  const chargePackage = findChargePackage(packageId, payload.technology);
  if (!chargePackage) {
    return { ok: false, message: "بستهٔ شارژ مورد نظر را انتخاب کنید." };
  }

  return {
    ok: true,
    data: {
      price: chargePackage.price,
      packageName: chargePackage.name,
      validityDays: chargePackage.validityDays,
    },
  };
}
