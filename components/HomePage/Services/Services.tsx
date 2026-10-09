"use client";

/**
 * بخش خدمات شرکت بایت در صفحه خانه.
 *
 * خدمات قابل ارائه شرکت را در دو ردیف چهارتایی از آیتم‌های آیکون‌دار نمایش می‌دهد.
 */

import Image from "next/image";

/**
 * رندر کردن بخش خدمات شرکت بایت.
 *
 * عنوان بخش و هشت آیتم خدمات را در قالب دو شبکه چهارستونی نمایش می‌دهد.
 *
 * @returns عنصر بخش شامل عنوان و شبکه آیتم‌های خدمات
 */
export function Services() {
  return (
    <section className="bg-white rounded-3xl shadow-[0px_4px_12px_0px_rgba(175,186,205,0.37)] p-4 space-y-2">
      <h2 className="text-blue-900 text-[14px] font-bold flex-1 text-right ">
        خدمات شرکت بایت
      </h2>

      {/* Row 1 */}
      <div className="grid grid-cols-4 gap-2 font-medium">
        <ServiceItem iconSrc="/images/radio-tower-icon.png" label="وایرلس" />

        <ServiceItem iconSrc="/images/wifi-icon.png" label="هات اسپات" />

        <ServiceItem iconSrc="/images/network-icon.png" label="شبکه" />

        <ServiceItem iconSrc="/images/router-icon.png" label="ADSL" />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-4 gap-2">
        <ServiceItem iconSrc="/images/camera-icon.png" label="دوربین" />
        <ServiceItem iconSrc="/images/building-icon.png" label="مجتمع" />
        <ServiceItem iconSrc="/images/signal-icon.png" label="LTE" />
        <ServiceItem iconSrc="/images/network-icon.png" label="شبکه" />
      </div>
    </section>
  );
}

/**
 * آیتم نمایش یک خدمت.
 *
 * آیکون و برچسب متنی یک خدمت را در یک کارت قابل کلیک نمایش می‌دهد و برای سادگی دسترس‌پذیری،
 * برچسب به‌عنوان متن جایگزین تصویر استفاده می‌شود.
 *
 * @param props.iconSrc - مسیر فایل آیکون خدمت در پوشه عمومی تصاویر
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
