/**
 * داده‌های پایهٔ سرویس اینترنت شامل مدت‌های سرویس، فهرست سرویس‌ها، فهرست تجهیزات
 * و توابع کمکی برای یافتن برچسب و تعرفه‌ها.
 */

/** مدت‌های مجاز سرویس بر حسب تعداد ماه. */
export const SERVICE_DURATIONS = [3, 6, 12] as const;

/** نوع مدت سرویس که از مقادیر ثابت `SERVICE_DURATIONS` ساخته می‌شود. */
export type ServiceDuration = (typeof SERVICE_DURATIONS)[number];

/**
 * ساختار برچسب نمایشی یک مدت سرویس.
 *
 * @property value - مقدار عددی مدت سرویس بر حسب ماه
 * @property label - برچسب کامل فارسی، مانند «سه ماهه»
 * @property shortLabel - برچسب کوتاه با ارقام فارسی، مانند «۳ ماهه»
 */
export type DurationLabel = {
  value: ServiceDuration;
  label: string;
  shortLabel: string;
};

/** فهرست برچسب‌های نمایشی متناظر با مدت‌های مجاز سرویس. */
export const DURATION_LABELS: DurationLabel[] = [
  { value: 3, label: "سه ماهه", shortLabel: "۳ ماهه" },
  { value: 6, label: "شش ماهه", shortLabel: "۶ ماهه" },
  { value: 12, label: "یک‌ساله", shortLabel: "۱۲ ماهه" },
];

/**
 * فناوری‌های ارائه‌دهندهٔ سرویس اینترنت که در سامانه پشتیبانی می‌شوند.
 *
 * مقدار این ثابت مرجع اعتبارسنجی فناوری در اکشن‌های سمت سرور و همچنین فیلتر
 * طرح‌های سرویس و تجهیزات در کامپوننت‌های کلاینتی است.
 */
export const SERVICE_TECHNOLOGIES = ["FTTH", "ADSL", "VDSL", "BYTE"] as const;

/**
 * نوع فناوری سرویس که از مقادیر ثابت `SERVICE_TECHNOLOGIES` ساخته می‌شود.
 */
export type ServiceTechnology = (typeof SERVICE_TECHNOLOGIES)[number];

/**
 * نگاشت برچسب فارسی هر فناوری، برای نمایش در متن‌های رابط کاربری.
 */
export const TECHNOLOGY_LABELS: Record<ServiceTechnology, string> = {
  FTTH: "فیبر نوری",
  ADSL: "ای‌دی‌اس‌ال",
  VDSL: "وی‌دی‌اس‌ال",
  BYTE: "بایت",
};

/**
 * بررسی اینکه یک مقدار رشته‌ای متعلق به فناوری‌های پشتیبانی‌شده هست یا خیر.
 *
 * @param value - مقدار بررسی‌شده که احتمالاً از سمت کاربر یا فرم آمده است
 * @returns `true` در صورت معتبر بودن فناوری، در غیر این صورت `false`
 */
export const isServiceTechnology = (
  value: unknown,
): value is ServiceTechnology =>
  SERVICE_TECHNOLOGIES.find((item) => item === value) !== undefined;

/**
 * ساختار یک سرویس اینترنت موجود در سیستم.
 *
 * @property id - شناسهٔ یکتای سرویس
 * @property name - نام فارسی و قابل نمایش سرویس
 * @property technology - فناوری ارائهٔ سرویس، مانند `FTTH` یا `VDSL`
 * @property speed - سرعت اعلام‌شدهٔ سرویس برای نمایش به کاربر
 * @property tariffs - نگاشت تعرفهٔ هر مدت مجاز سرویس بر حسب ریال
 */
export type ServicePlan = {
  id: string;
  name: string;
  technology: ServiceTechnology;
  speed: string;
  tariffs: Record<ServiceDuration, number>;
};

/** فهرست سرویس‌های اینترنت قابل سفارش به همراه تعرفهٔ آن‌ها. */
export const SERVICE_PLANS: ServicePlan[] = [
  {
    id: "ftth-100",
    name: "اینترنت فیبر نوری ۱۰۰ مگابیت",
    technology: "FTTH",
    speed: "100 Mbps",
    tariffs: { 3: 690000, 6: 1290000, 12: 2400000 },
  },
  {
    id: "ftth-300",
    name: "اینترنت فیبر نوری ۳۰۰ مگابیت",
    technology: "FTTH",
    speed: "300 Mbps",
    tariffs: { 3: 990000, 6: 1890000, 12: 3500000 },
  },
  {
    id: "ftth-500",
    name: "اینترنت فیبر نوری ۵۰۰ مگابیت",
    technology: "FTTH",
    speed: "500 Mbps",
    tariffs: { 3: 1290000, 6: 2490000, 12: 4500000 },
  },
  {
    id: "ftth-1000",
    name: "اینترنت فیبر نوری ۱۰۰۰ مگابیت",
    technology: "FTTH",
    speed: "1000 Mbps",
    tariffs: { 3: 1890000, 6: 3590000, 12: 6500000 },
  },
  {
    id: "adsl-8",
    name: "اینترنت ADSL ۸ مگابیت",
    technology: "ADSL",
    speed: "8 Mbps",
    tariffs: { 3: 190000, 6: 350000, 12: 620000 },
  },
  {
    id: "adsl-plus",
    name: "اینترنت ADSL پلاس",
    technology: "ADSL",
    speed: "16 Mbps",
    tariffs: { 3: 290000, 6: 520000, 12: 920000 },
  },
  {
    id: "vdsl-50",
    name: "اینترنت VDSL ۵۰ مگابیت",
    technology: "VDSL",
    speed: "50 Mbps",
    tariffs: { 3: 390000, 6: 690000, 12: 1200000 },
  },
  {
    id: "vdsl-100",
    name: "اینترنت VDSL ۱۰۰ مگابیت",
    technology: "VDSL",
    speed: "100 Mbps",
    tariffs: { 3: 540000, 6: 990000, 12: 1750000 },
  },
  {
    id: "vdsl-plus",
    name: "اینترنت VDSL پلاس",
    technology: "VDSL",
    speed: "200 Mbps",
    tariffs: { 3: 790000, 6: 1450000, 12: 2600000 },
  },
];

/**
 * ساختار یک تجهیز جانبی قابل سفارش به‌همراه سرویس.
 *
 * @property id - شناسهٔ یکتای تجهیز
 * @property name - نام فارسی و قابل نمایش تجهیز
 * @property description - توضیح کوتاهی دربارهٔ کاربرد تجهیز
 * @property price - قیمت تجهیز بر حسب ریال
 * @property technologies - فهرست فناوری‌هایی که این تجهیز با آن‌ها سازگار است؛ نبودن این فیلد به‌معنای سازگاری با همهٔ فناوری‌هاست
 */
export type EquipmentOption = {
  id: string;
  name: string;
  description: string;
  price: number;
  technologies?: ServiceTechnology[];
};

/** فهرست تجهیزات جانبی قابل انتخاب در کنار سرویس اینترنت. */
export const EQUIPMENT_OPTIONS: EquipmentOption[] = [
  {
    id: "onu-basic",
    name: "مبدل نوری ONU",
    description: "مبدل فیبر نوری به‌صورت پیش‌فرض همراه سرویس ارائه می‌شود.",
    price: 0,
    technologies: ["FTTH"],
  },
  {
    id: "onu-plus",
    name: "مبدل نوری پیشرفته",
    description: "پشتیبانی از استاندارد GPON و قابلیت مدیریت از راه دور.",
    price: 4800000,
    technologies: ["FTTH"],
  },
  {
    id: "adsl-modem",
    name: "مودم ADSL",
    description: "مودم سازگار با سرویس ADSL و ADSL پلاس به‌همراه کابل شبکه.",
    price: 1200000,
    technologies: ["ADSL"],
  },
  {
    id: "vdsl-modem",
    name: "مودم VDSL",
    description: "مودم VDSL مناسب سرویس‌های پرسرعت با پوشش سیم‌کشی داخلی.",
    price: 2400000,
    technologies: ["VDSL"],
  },
  {
    id: "router-wifi6",
    name: "روتر وای‌فای ۶",
    description: "روتر سازگار با سرویس اینترنت همراه با پوشش وای‌فای.",
    price: 6500000,
  },
  {
    id: "power-saver",
    name: "ups منبع تغذیه",
    description: "منبع برق اضطراری برای مودم و روتر با نگهداری ۱ ساعت.",
    price: 3200000,
  },
  {
    id: "extender",
    name: "اکستندر تکرار سیگنال",
    description: "افزایش پوشش وای‌فای در نقاط دورتر ساختمان.",
    price: 4100000,
  },
];

/**
 * فیلتر کردن تجهیزات جانبی بر اساس فناوری‌های مجاز.
 *
 * تجهیزاتی که فیلد `technologies` ندارند، برای همهٔ فناوری‌ها در نظر گرفته
 * می‌شوند. اگر فهرست فناوری‌ها ارسال نشود، همهٔ تجهیزات بازگردانده می‌شوند.
 *
 * @param technologies - فهرست فناوری‌های مجاز؛ در صورت ارسال، فقط تجهیزات منطبق باقی می‌مانند
 * @returns فهرست تجهیزات مجاز برای فناوری‌های داده‌شده
 */
export const getEquipmentOptions = (technologies?: ServiceTechnology[]) => {
  if (!technologies) return EQUIPMENT_OPTIONS;
  return EQUIPMENT_OPTIONS.filter(
    (option) =>
      !option.technologies ||
      option.technologies.some((item) => technologies.includes(item)),
  );
};

/**
 * یافتن فهرست طرح‌های سرویس یک یا چند فناوری مشخص.
 *
 * @param technologies - فهرست فناوری‌های موردنظر؛ در صورت ارسال، فقط طرح‌های منطبق بازگردانده می‌شوند
 * @returns فهرست طرح‌های سرویس فیلترشده یا همهٔ طرح‌ها در صورت ارسال نشدن فناوری
 */
export const getServicePlans = (technologies?: ServiceTechnology[]) =>
  technologies
    ? SERVICE_PLANS.filter((plan) => technologies.includes(plan.technology))
    : SERVICE_PLANS;

/**
 * مقادیر فرم مرحلهٔ نخست ثبت درخواست که شامل اطلاعات هویتی مشترک است.
 *
 * @property fullName - نام و نام خانوادگی مشترک
 * @property mobile - شمارهٔ موبایل با قالب `09xxxxxxxxx`
 * @property address - نشانی کامل محل سکونت
 * @property nationalId - کد ملی ده‌رقمی مشترک
 */
export type IdentityFormValues = {
  fullName: string;
  mobile: string;
  address: string;
  nationalId: string;
};

/**
 * مقادیر فرم مرحلهٔ دوم ثبت درخواست که شامل انتخاب سرویس و تجهیزات است.
 *
 * @property duration - مدت سرویس به ماه
 * @property serviceId - شناسهٔ سرویس انتخاب‌شده
 * @property equipmentIds - آرایهٔ شناسهٔ تجهیزات جانبی انتخاب‌شده
 */
export type ServiceFormValues = {
  duration: ServiceDuration;
  serviceId: string;
  equipmentIds: string[];
};

/**
 * یافتن برچسب متنی متناظر با یک مدت سرویس.
 *
 * @param value - مدت سرویس بر حسب ماه
 * @returns برچسب فارسی مدت سرویس، یا رشتهٔ خالی در صورت نبودن تطابق
 */
export const getDurationLabel = (value: ServiceDuration) =>
  DURATION_LABELS.find((item) => item.value === value)?.label ?? "";

/**
 * یافتن تعرفهٔ یک سرویس بر اساس شناسه و مدت.
 *
 * @param serviceId - شناسهٔ سرویس موردنظر
 * @param duration - مدت سرویس بر حسب ماه
 * @returns تعرفهٔ سرویس، یا `0` در صورتی که سرویس با این شناسه یافت نشود
 */
export const getServiceTariff = (serviceId: string, duration: ServiceDuration) =>
  SERVICE_PLANS.find((plan) => plan.id === serviceId)?.tariffs[duration] ?? 0;

/**
 * یافتن قیمت یک تجهیز جانبی بر اساس شناسهٔ آن.
 *
 * @param equipmentId - شناسهٔ تجهیز موردنظر
 * @returns قیمت تجهیز، یا `0` در صورتی که تجهیز با این شناسه یافت نشود
 */
export const getEquipmentPrice = (equipmentId: string) =>
  EQUIPMENT_OPTIONS.find((item) => item.id === equipmentId)?.price ?? 0;
