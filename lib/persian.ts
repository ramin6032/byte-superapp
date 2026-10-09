/**
 * ابزارهای مربوط به بومی‌سازی اعداد و قالب‌بندی مبالغ به زبان فارسی.
 */

/** نگاشت ارقام لاتین به ارقام فارسی. */
const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** ارقام عربی برای تبدیل به ارقام لاتین. */
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/**
 * تبدیل ارقام لاتین یک مقدار به ارقام فارسی.
 *
 * @param value - مقدار رشته‌ای یا عددی که باید تبدیل شود
 * @returns رشته‌ای که در آن تمام ارقام لاتین با ارقام فارسی جایگزین شده‌اند
 */
export const toPersianDigits = (value: string | number) =>
  String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);

/**
 * تبدیل ارقام فارسی و عربی یک مقدار به ارقام لاتین.
 *
 * @param value - مقدار رشته‌ای یا عددی که باید تبدیل شود
 * @returns رشته‌ای که در آن ارقام فارسی و عربی با ارقام لاتین جایگزین شده‌اند
 */
export const toEnglishDigits = (value: string | number) =>
  String(value)
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)));

/**
 * قالب‌بندی یک مبلغ به همراه واحد پول و ارقام فارسی.
 *
 * @param value - مبلغ به‌صورت عدد
 * @returns مبلغ با جداکنندهٔ هزارگان و ارقام فارسی به همراه پسوند «تومان»
 */
export const formatPrice = (value: number) =>
  `${toPersianDigits(new Intl.NumberFormat("en-US").format(value))} تومان`;