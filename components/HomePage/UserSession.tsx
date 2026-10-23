/**
 * @file پوشش کلاینت برای نمایش محتوای صفحه خانه پس از بررسی نشست کاربری.
 * با استفاده از useUserServices، وضعیت دریافت اطلاعات و اعتبارسنجی اجباری
 * را مدیریت می‌کند. هنگام انتظار یا انتقال به ورود، پیام وضعیت نمایش می‌دهد
 * و برای خطاهای ارتباطی امکان تلاش مجدد فراهم می‌کند.
 */
"use client";

import type { ReactNode } from "react";
import { useUserServices } from "@/hooks/useUserServices";
import { UserServicesError } from "@/lib/user-services-query";

export function UserSession({
  children,
  forceValidation,
}: {
  children: ReactNode;
  forceValidation: boolean;
}) {
  const query = useUserServices(forceValidation);

  if (query.isPending || (forceValidation && query.isFetching)) {
    return (
      <div role="status" className="p-6 text-center">
        در حال بررسی حساب کاربری...
      </div>
    );
  }

  if (query.isError) {
    if (
      query.error instanceof UserServicesError &&
      query.error.reason === "unauthorized"
    ) {
      return (
        <div role="status" className="p-6 text-center">
          در حال انتقال به صفحه ورود...
        </div>
      );
    }

    return (
      <div role="alert" className="rounded-[18px] bg-white p-6 text-center space-y-4">
        <p>{query.error.message}</p>
        <button
          type="button"
          className="rounded-xl bg-[#0C6FFF] px-4 py-2 text-white"
          onClick={() => void query.refetch()}
          disabled={query.isFetching}
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return children;
}
