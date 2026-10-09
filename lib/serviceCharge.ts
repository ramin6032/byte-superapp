/**
 * داده‌های پایهٔ شارژ مجدد (خرید ترافیک) سرویس اینترنت.
 *
 * بسته‌های شارژ برای هر فناوری جداگانه تعریف شده‌اند؛ زیرا حجم مجاز و تعرفهٔ
 * هر بسته به فناوری ارائه‌دهندهٔ سرویس وابسته است.
 */

import { type ServiceTechnology } from "@/lib/internetRequest";

/**
 * ساختار یک بستهٔ شارژ مجدد ترافیک.
 *
 * @property id - شناسهٔ یکتای بسته که در اکشن سمت سرور اعتبارسنجی می‌شود
 * @property technology - فناوری سرویسی که این بسته برای آن قابل خریداری است
 * @property name - نام فارسی و قابل نمایش بسته
 * @property volume - حجم ترافیک بسته به‌صورت متن نمایشی، مانند «۵ گیگابایت»
 * @property volumeGb - حجم ترافیک بسته بر حسب گیگابایت، برای مرتب‌سازی
 * @property validityDays - مدت اعتبار بسته پس از فعال‌سازی بر حسب روز
 * @property price - قیمت بسته بر حسب ریال
 */
export type ChargePackage = {
  id: string;
  technology: ServiceTechnology;
  name: string;
  volume: string;
  volumeGb: number;
  validityDays: number;
  price: number;
};

/**
 * ساختار گزینه‌های شارژ که در پیام‌های سرور و اکشن‌ها استفاده می‌شود.
 */
export type ChargeValues = {
  /** شمارهٔ مجازی سرویسی که شارژ برای آن ثبت می‌شود. */
  virtualNumber: string;
  /** شناسهٔ بستهٔ شارژ انتخاب‌شده. */
  packageId: string;
  /** فناوری سرویس، برای اطمینان از تعلق بسته به سرویس درخواستی. */
  technology: ServiceTechnology;
};

/** فهرست کامل بسته‌های شارژ مجدد به تفکیک فناوری ارائه‌دهنده. */
export const CHARGE_PACKAGES: ChargePackage[] = [
  {
    id: "ftth-charge-5",
    technology: "FTTH",
    name: "بسته ۵ گیگابایت",
    volume: "۵ گیگابایت",
    volumeGb: 5,
    validityDays: 30,
    price: 45000,
  },
  {
    id: "ftth-charge-10",
    technology: "FTTH",
    name: "بسته ۱۰ گیگابایت",
    volume: "۱۰ گیگابایت",
    volumeGb: 10,
    validityDays: 30,
    price: 80000,
  },
  {
    id: "ftth-charge-20",
    technology: "FTTH",
    name: "بسته ۲۰ گیگابایت",
    volume: "۲۰ گیگابایت",
    volumeGb: 20,
    validityDays: 30,
    price: 140000,
  },
  {
    id: "ftth-charge-50",
    technology: "FTTH",
    name: "بسته ۵۰ گیگابایت",
    volume: "۵۰ گیگابایت",
    volumeGb: 50,
    validityDays: 60,
    price: 300000,
  },
  {
    id: "adsl-charge-2",
    technology: "ADSL",
    name: "بسته ۲ گیگابایت",
    volume: "۲ گیگابایت",
    volumeGb: 2,
    validityDays: 30,
    price: 25000,
  },
  {
    id: "adsl-charge-5",
    technology: "ADSL",
    name: "بسته ۵ گیگابایت",
    volume: "۵ گیگابایت",
    volumeGb: 5,
    validityDays: 30,
    price: 55000,
  },
  {
    id: "adsl-charge-10",
    technology: "ADSL",
    name: "بسته ۱۰ گیگابایت",
    volume: "۱۰ گیگابایت",
    volumeGb: 10,
    validityDays: 30,
    price: 95000,
  },
  {
    id: "adsl-charge-20",
    technology: "ADSL",
    name: "بسته ۲۰ گیگابایت",
    volume: "۲۰ گیگابایت",
    volumeGb: 20,
    validityDays: 45,
    price: 165000,
  },
  {
    id: "vdsl-charge-5",
    technology: "VDSL",
    name: "بسته ۵ گیگابایت",
    volume: "۵ گیگابایت",
    volumeGb: 5,
    validityDays: 30,
    price: 40000,
  },
  {
    id: "vdsl-charge-10",
    technology: "VDSL",
    name: "بسته ۱۰ گیگابایت",
    volume: "۱۰ گیگابایت",
    volumeGb: 10,
    validityDays: 30,
    price: 72000,
  },
  {
    id: "vdsl-charge-20",
    technology: "VDSL",
    name: "بسته ۲۰ گیگابایت",
    volume: "۲۰ گیگابایت",
    volumeGb: 20,
    validityDays: 30,
    price: 125000,
  },
  {
    id: "vdsl-charge-50",
    technology: "VDSL",
    name: "بسته ۵۰ گیگابایت",
    volume: "۵۰ گیگابایت",
    volumeGb: 50,
    validityDays: 60,
    price: 275000,
  },
];

/**
 * یافتن فهرست بسته‌های شارژ یک فناوری مشخص.
 *
 * @param technology - فناوری سرویس موردنظر
 * @returns بسته‌های شارژ منطبق با فناوری، مرتب‌شده بر اساس حجم ترافیک
 */
export const getChargePackages = (technology: ServiceTechnology) =>
  CHARGE_PACKAGES.filter((item) => item.technology === technology).sort(
    (first, second) => first.volumeGb - second.volumeGb,
  );

/**
 * یافتن یک بستهٔ شارژ بر اساس شناسه و فناوری سرویس.
 *
 * @param packageId - شناسهٔ بستهٔ موردنظر
 * @param technology - فناوری سرویسی که بسته باید متعلق به آن باشد
 * @returns بستهٔ شارژ منطبق، یا `undefined` در صورت نبودن تطابق
 */
export const findChargePackage = (
  packageId: string,
  technology: ServiceTechnology,
) =>
  CHARGE_PACKAGES.find(
    (item) => item.id === packageId && item.technology === technology,
  );