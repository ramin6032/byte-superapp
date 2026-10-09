/**
 * صفحه اشتراک‌ها (ADSL).
 *
 * مسیر: `/subscriptions` — کامپوننت سرور که هدر مقدمه و انتخاب‌کننده اشتراک را رندر می‌کند.
 *
 * @returns صفحه اشتراک‌ها
 */
import { IntroductionHeader } from "@/components/Introduction/Header";
import { SubscriptionSelector } from "@/components/subscriptions/SubscriptionSelector";
import data from "@/components/subscriptions/subscriptionsData.json";

/**
 * شکل داده‌های JSON اشتراک‌ها.
 */
type SubscriptionsData = {
  /** گروه‌های اشتراک */
  groups: {
    /** شناسه گروه */
    id: string;
    /** برچسب گروه */
    label: string;
    /** لیست اشتراک‌های گروه */
    subscriptions: {
      /** شناسه اشتراک */
      id: string;
      /** نام کاربری */
      username: string;
      /** برچسب نمایشی */
      label: string;
    }[];
  }[];
};

/**
 * رندر صفحه اشتراک‌ها.
 *
 * اولین اشتراک هر گروه به‌عنوان گزینه انتخاب‌شده به انتخاب‌کننده داده می‌شود.
 *
 * @returns المان صفحه شامل هدر بازگشت و انتخاب‌کننده اشتراک
 */
export default function AdslPage() {
  const { groups } = data as SubscriptionsData;
  const allSubscriptions = groups.flatMap((g) => g.subscriptions);

  return (
    <main className="flex flex-col gap-3">
      <IntroductionHeader title="اشتراک های من" />
      <SubscriptionSelector
        groups={groups}
        selectedId={allSubscriptions[0].id}
      />
    </main>
  );
}
