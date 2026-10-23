/**
 * @file هوک کلاینت برای دسترسی به اطلاعات سرویس‌های کاربر از React Query.
 * داده‌های prefetch شده را مصرف می‌کند و در صورت نیاز، دریافت مجدد را
 * با تنظیمات مشترک query انجام می‌دهد. پس از موفقیت، Zustand را همگام
 * و در صورت ردشدن نشست، store را پاک و کاربر را به صفحه ورود هدایت می‌کند.
 */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  UserServicesError,
  userServicesQueryOptions,
} from "@/lib/user-services-query";
import { useUserServicesStore } from "@/stores/useUserServicesStore";

export function useUserServices(forceValidation = false) {
  const router = useRouter();
  const setUserServices = useUserServicesStore(
    (state) => state.setUserServices,
  );
  const clearUserServices = useUserServicesStore(
    (state) => state.clearUserServices,
  );
  const query = useQuery({
    ...userServicesQueryOptions(),
    refetchOnMount: forceValidation ? "always" : true,
  });

  useEffect(() => {
    if (query.isSuccess && !query.isFetching) {
      setUserServices(query.data);
    }
    if (
      query.error instanceof UserServicesError &&
      query.error.reason === "unauthorized"
    ) {
      clearUserServices();
      router.replace("/login");
    }
  }, [
    query.data,
    query.error,
    query.isSuccess,
    query.isFetching,
    setUserServices,
    clearUserServices,
    router,
  ]);

  return query;
}
