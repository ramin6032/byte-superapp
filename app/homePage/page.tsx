/**
 * صفحه خانه.
 *
 * مسیر: `/homePage` — کامپوننت سرور که هدر، بنر، هشدارها، مکالمات، فهرست خدمات و نوار ناوبری پایین را کنار هم می‌چیند.
 *
 * @returns صفحه کامل خانه
 */
import { Alerts } from "@/components/HomePage/Alerts/Alerts";
import { Banner } from "@/components/HomePage/Banner/Banner";
import { Header } from "@/components/HomePage/Header/Header";
import { Mokhaberat } from "@/components/HomePage/Mokhaberat/Mokhaberat";
import { Services } from "@/components/HomePage/Services/Services";

/**
 * رندر صفحه خانه.
 *
 * @returns ساختار کامل شامل هدر، محتوای اصلی و ناوبری پایین
 */
export default function Home() {
  return (
    <>
      {/* Header */}
      <Header />
      <main className="w-full flex-1 mx-auto  p-2 space-y-4 overflow-y-auto overflow-x-hidden">
        {/* Banner */}
        <Banner />

        {/* Alerts Section */}
        <Alerts />

        {/* Mokhaberat Section */}
        <Mokhaberat />

        {/* Services Section */}
        <Services />
      </main>
    </>
  );
}
