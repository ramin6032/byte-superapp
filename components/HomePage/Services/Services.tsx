"use client";

/**
 * بخش خدمات شرکت بایت در صفحه خانه.
 *
 * خدمات قابل ارائه شرکت در یک شبکهٔ چهارستونی از آیتم‌های آیکون‌دار نمایش
 * داده می‌شوند؛ فهرست خدمات از فایل JSON خوانده شده و با `map` رندر می‌شود
 * تا افزودن یا حذف کردن یک خدمت نیازی به تغییر کامپوننت نداشته باشد.
 */

import Image from "next/image";
import data from "@/components/HomePage/Services/servicesData.json";

/**
 * ساختار یک خدمت در فهرست خدمات شرکت بایت.
 *
 * @property id - شناسهٔ یکتای خدمت، برای کلید رندر استفاده می‌شود
 * @property icon - نام فایل آیکون خدمت در پوشهٔ عمومی تصاویر
 * @property label - برچسب متنی خدمت که زیر آیکون نمایش داده می‌شود
 */
type Service = {
  id: string;
  icon: string;
  label: string;
};

/**
 * شکل داده‌های JSON خدمات.
 */
type ServicesData = {
  /** فهرست خدمات قابل ارائه شرکت. */
  services: Service[];
};

/** مسیر پایهٔ تصاویر آیکون‌های خدمات. */
const ICONS_BASE_PATH = "/images";

/**
 * رندر کردن بخش خدمات شرکت بایت.
 *
 * عنوان بخش و آیتم‌های خدمات فایل JSON را در قالب یک شبکهٔ چهارستونی
 * نمایش می‌دهد؛ با توجه به تعداد آیتم‌ها، شبکه به‌صورت خودکار به چند
 * ردیف تقسیم می‌شود.
 *
 * @returns عنصر بخش شامل عنوان و شبکه آیتم‌های خدمات
 */
export function Services() {
  const { services } = data as ServicesData;

  return (
    <section className="bg-white rounded-3xl shadow-[0px_4px_12px_0px_rgba(175,186,205,0.37)] p-4 space-y-2">
      <h2 className="text-blue-900 text-[14px] font-bold flex-1 text-right ">
        خدمات شرکت بایت
      </h2>

      <div className="grid grid-cols-4 gap-2 font-medium">
        {services.map((service) => (
          <ServiceItem
            key={service.id}
            iconSrc={`${ICONS_BASE_PATH}/${service.icon}`}
            label={service.label}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * آیتم نمایش یک خدمت.
 *
 * آیکون و برچسب متنی یک خدمت را در یک کارت قابل کلیک نمایش می‌دهد و برای
 * سادگی دسترس‌پذیری، برچسب به‌عنوان متن جایگزین تصویر استفاده می‌شود.
 *
 * @param props.iconSrc - مسیر کامل فایل آیکون خدمت در پوشهٔ عمومی تصاویر
 * @param props.label - برچسب متنی خدمت که زیر آیکون نمایش داده می‌شود
 * @returns عنصر آیتم خدمت شامل آیکون و برچسب متنی
 */
function ServiceItem({ iconSrc, label }: { iconSrc: string; label: string }) {
  return (
    <div className="bg-[#F3F6FE] hover:bg-[#F3F6FE]/70 hover:shadow rounded-[18px] w-full py-1 flex flex-col items-center justify-center justify-self-center">
      <Image src={iconSrc} alt={label} width={38} height={38} />
      <p className="text-[#081D5D] text-[12px] font-medium">{label}</p>
    </div>
  );
}