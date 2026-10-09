/**
 * صفحه جزئیات سرویس.
 *
 * مسیر: `/services/[serviceId]` — کامپوننت سرور (async) که `params` را await می‌کند و
 * محتوای متناظر `serviceId` را از JSON می‌خواند. در صورت یافتن نشدن 404 برمی‌گرداند.
 *
 * @param params - Promise حاوی `{ serviceId: string }` (Next.js 15+)
 * @returns صفحه جزئیات سرویس یا notFound
 */
import { notFound } from "next/navigation";
import { IntroductionHeader } from "@/components/Introduction/Header";
import { ServicesIntroduction } from "@/components/Introduction/ServicesIntroduction";
import { SubmitRequestButton } from "@/components/Introduction/SubmitRequestButton";
import data from "@/components/Introduction/servicesIntroduction.json";

/**
 * شکل داده‌های JSON معرفی خدمات.
 */
type ServicesData = {
  /** آیتم‌های خدمات */
  items: {
    /** شناسه منحصر‌به‌فرد خدمت */
    id: string;
    /** عنوان خدمت */
    title: string;
    /** زیرعنوان/توضیح کوتاه */
    subtitle: string;
    /** بلوک‌های محتوا (پاراگراف‌ها یا لیست) */
    content: { type: string; value: string[] };
  }[];
};

/**
 * رندر صفحه جزئیات سرویس متناسب با پارامتر داینامیک مسیر.
 *
 * @param props - پارامترهای روت داینامیک
 * @param props.params - Promise حاوی `serviceId` که پیش از استفاده await می‌شود
 * @returns المان صفحه جزئیات، یا فراخوانی `notFound` در صورت نبود سرویس
 */
export default async function ServiceDetailPage({
  params,
}: {
  /** پارامترهای داینامیک روت (Promise در Next 15+) */
  params: Promise<{ serviceId: string }>;
}) {
  const { items } = data as ServicesData;
  const { serviceId } = await params;

  const service = items.find((item) => item.id === serviceId);

  if (!service) {
    notFound();
  }

  return (
    <main className="flex flex-col gap-3">
      <IntroductionHeader title={service.title} />
      <ServicesIntroduction serviceId={serviceId} />
      <SubmitRequestButton />
    </main>
  );
}
