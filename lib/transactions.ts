/**
 * داده‌های پایه و ابزارهای مشترک مربوط به تراکنش‌های کاربر.
 *
 * تراکنش‌ها به‌صورت یک فهرست یکنواخت مدیریت می‌شوند؛ نوع هر تراکنش
 * (خرید ترافیک، تمدید سرویس، خرید آی‌پی و ...) و وضعیت آن با مقادیر
 * ثابت این ماژول توصیف می‌شوند تا نمایش در لیست و جزئیات یکدست باشد.
 */

/**
 * انواع تراکنش‌های قابل نمایش.
 *
 * هر کلید معادل یک دسته از تراکنش‌های کاربر است و برچسب فارسی آن در
 * `TRANSACTION_TYPE_LABELS` تعریف شده است.
 */
export const TRANSACTION_TYPES = {
  traffic: "خرید ترافیک",
  renewal: "تمدید سرویس",
  ip: "خرید آی‌پی",
  equipment: "خرید تجهیزات",
  subscription: "خرید اشتراک",
} as const;

/**
 * نوع تراکنش که از کلیدهای ثابت `TRANSACTION_TYPES` ساخته می‌شود.
 */
export type TransactionType = keyof typeof TRANSACTION_TYPES;

/**
 * وضعیت‌های یک تراکنش به‌همراه برچسب فارسی و رنگ برچسب آنت‌دیزای.
 *
 * @property label - متن نمایشی وضعیت
 * @property tagColor - رنگ برچسب آنت‌دیزای برای نمایش وضعیت
 */
export const TRANSACTION_STATUS_CONFIG: Record<
  string,
  { label: string; tagColor: string }
> = {
  success: { label: "موفق", tagColor: "green" },
  pending: { label: "در انتظار پرداخت", tagColor: "orange" },
  failed: { label: "ناموفق", tagColor: "red" },
};

/**
 * وضعیت‌های مجاز یک تراکنش.
 */
export type TransactionStatus = keyof typeof TRANSACTION_STATUS_CONFIG;

/**
 * ساختار یک ردیف اطلاعاتی در جزئیات تراکنش.
 *
 * @property label - عنوان ردیف، مانند «کد پیگیری»
 * @property value - مقدار ردیف، مانند «TR-98234512»
 */
export type TransactionInfoItem = {
  label: string;
  value: string;
};

/**
 * ساختار یک تراکنش کاربر.
 *
 * @property id - شناسهٔ یکتای تراکنش که در مسیر جزئیات استفاده می‌شود
 * @property type - نوع تراکنش از `TransactionType`
 * @property title - عنوان نمایشی تراکنش
 * @property description - توضیح کوتاه تراکنش برای نمایش در لیست
 * @property amount - مبلغ تراکنش بر حسب ریال
 * @property date - تاریخ تراکنش به‌صورت رشتهٔ فارسی
 * @property status - وضعیت تراکنش از `TransactionStatus`
 * @property info - ردیف‌های اطلاعاتی اضافی نمایش داده‌شده در جزئیات
 */
export type Transaction = {
  id: string;
  type: TransactionType;
  title: string;
  description: string;
  amount: number;
  date: string;
  status: TransactionStatus;
  info: TransactionInfoItem[];
};

/**
 * ساختار فایل JSON تراکنش‌ها.
 *
 * @property transactions - فهرست تراکنش‌های کاربر
 */
export type TransactionsData = {
  transactions: Transaction[];
};

/**
 * یافتن یک تراکنش بر اساس شناسهٔ آن.
 *
 * @param transactions - فهرست تراکنش‌های موجود
 * @param id - شناسهٔ تراکنش موردنظر
 * @returns تراکنش منطبق، یا `undefined` در صورت یافت نشدن
 */
export const findTransaction = (
  transactions: Transaction[],
  id: string,
) => transactions.find((item) => item.id === id);
