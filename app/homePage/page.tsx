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
import { UserSession } from "@/components/HomePage/UserSession";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { decodeToken } from "@/actions/authActions";
import { getAccessToken } from "@/actions/callApi";
import { getQueryClient } from "@/lib/get-query-client";
import {
  UserServicesError,
  userServicesQueryKey,
  userServicesQueryOptions,
} from "@/lib/user-services-query";

/**
 * رندر صفحه خانه.
 *
 * @returns ساختار کامل شامل هدر، محتوای اصلی و ناوبری پایین
 */
export default async function Home() {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    ...userServicesQueryOptions(),
    // Server rendering is read-only. A client-invoked action refreshes cookies.
    queryFn: async () => {
      const result = await decodeToken(token);
      if (!result.ok) {
        throw new UserServicesError(result.message, result.reason);
      }
      return result.data;
    },
  });
  const forceValidation =
    queryClient.getQueryState(userServicesQueryKey)?.status !== "success";

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserSession forceValidation={forceValidation}>
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
      </UserSession>
    </HydrationBoundary>
  );
}
