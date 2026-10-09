"use client";

/**
 * بخش اینترنت مخابرات در صفحه خانه.
 *
 * سرویس‌های اینترنتی موجود را به‌صورت شبکه‌ای از کارت‌های کوچک نمایش می‌دهد.
 */

/**
 * رندر کردن بخش اینترنت مخابرات.
 *
 * عنوان بخش و سه کارت سرویس اینترنت (ADSL، VDSL و فیبر نوری) را در یک شبکه سه‌ستونی نمایش می‌دهد.
 *
 * @returns عنصر بخش شامل عنوان و شبکه کارت‌های سرویس اینترنت
 */
export function Mokhaberat() {
  return (
    <section className="bg-white rounded-[24px] shadow-[0px_4px_12px_0px_rgba(175,186,205,0.37)] p-4 space-y-2">
      <h2 className="text-blue-900 text-[14px] font-bold flex-1 text-right ">
        اینترنت مخابرات
      </h2>

      <div className="grid grid-cols-3 gap-x-2 gap-y-2 text-[12px] font-medium">
        {/* Service Card 1 */}
        <ServiceCard title="اینترنت پرسرعت" latin="ADSL" />

        {/* Service Card 2 */}
        <ServiceCard title="اینترنت پرسرعت" latin="VDSL" />

        {/* Service Card 3 */}
        <ServiceCard title=" فیبر نوری" latin="FTTH" />
      </div>
    </section>
  );
}

/**
 * کارت نمایش یک سرویس اینترنت.
 *
 * نام سرویس را به همراه معادل لاتین آن (در صورت وجود) در یک کارت قابل کلیک نمایش می‌دهد.
 *
 * @param props.title - عنوان فارسی سرویس که در کارت نمایش داده می‌شود
 * @param props.latin - معادل لاتین اختیاری سرویس که در صورت تعریف شدن نمایش داده می‌شود
 * @returns عنصر کارت سرویس شامل عنوان فارسی و معادل لاتین اختیاری
 */
function ServiceCard({ title, latin }: { title: string; latin?: string }) {
  return (
    <div className="bg-[#F3F6FE] border border-[#0C6FFF] rounded-[18px] p-2 flex flex-col items-center justify-center ">
      <p className="text-[#0C6FFF]  text-center leading-5">{title}</p>
      {latin && (
        <p className="text-[#0C6FFF]  text-center leading-5">{latin}</p>
      )}
    </div>
  );
}
