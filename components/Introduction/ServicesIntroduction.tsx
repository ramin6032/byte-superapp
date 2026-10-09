"use client";

/**
 * بخش معرفی خدمات (قابل فیلتر کردن با serviceId).
 *
 * کامپوننت کلاینت که داده‌ها را از JSON می‌خواند، بر اساس `serviceId` فیلتر می‌کند
 * و کارت‌های خدماتی را رندر می‌کند. اگر نتیجه‌ای نباشد null برمی‌گرداند.
 *
 * @param serviceId - شناسه خدمت برای فیلتر (اختیاری)
 * @returns_section با کارت‌های خدمت یا null
 */
import data from "./servicesIntroduction.json";

/**
 * بلوک محتوای خدمت: پاراگراف‌ها یا لیست.
 */
type ContentBlock =
  | { type: "paragraphs"; value: string[] }
  | { type: "list"; value: string[] };

/**
 * آیتم خدمت منفرد.
 */
type ServiceItem = {
  /** شناسه خدمت */
  id: string;
  /** عنوان خدمت */
  title: string;
  /** زیرعنوان خدمت */
  subtitle: string;
  /** محتوای خدمت */
  content: ContentBlock;
};

/**
 * کل داده‌های JSON خدمات.
 */
type ServicesData = {
  /** آرایه آیتم‌های خدمت */
  items: ServiceItem[];
};

export function ServicesIntroduction({
  serviceId,
}: { serviceId?: string }) {
  const { items } = data as ServicesData;

  const filteredItems = serviceId
    ? items.filter((item) => item.id === serviceId)
    : items;

  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-3xl shadow-[0px_4px_12px_0px_rgba(175,186,205,0.37)] p-4 space-y-4">
      {filteredItems.map((item) => (
        <ServiceCard key={item.id} item={item} />
      ))}
    </section>
  );
}

function ServiceCard({ item }: { item: ServiceItem }) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col items-start gap-0.5">
        <h3 className="text-[#081D5D] text-[15px] font-bold text-start">
          {item.title}
        </h3>
        <p className="text-[#52759F] text-[12px] font-medium text-start">
          {item.subtitle}
        </p>
      </div>

      <ContentBlock content={item.content} />
    </div>
  );
}

function ContentBlock({ content }: { content: ContentBlock }) {
  if (content.type === "list") {
    return (
      <ul className="space-y-1 list-disc list-inside text-right">
        {content.value.map((point, i) => (
          <li
            key={i}
            className="text-[#52759F] text-[12px] font-light leading-5"
          >
            {point}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="flex flex-col gap-2 text-right">
      {content.value.map((paragraph, i) => (
        <p key={i} className="text-[#52759F] text-[12px] font-light leading-5">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
