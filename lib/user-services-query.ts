/**
 * @file کلید و تنظیمات مشترک React Query برای اطلاعات سرویس‌های کاربر.
 * queryFn با فراخوانی getUserServices، بررسی و نوسازی نشست را به Server Action
 * واگذار می‌کند و فقط اطلاعات کاربر را در cache نگه می‌دارد، نه توکن‌ها را.
 * UserServicesError خطای نشست نامعتبر را از اختلال سرویس جدا می‌کند؛
 * داده‌ها برای یک دقیقه تازه محسوب می‌شوند و retry خودکار غیرفعال است.
 */
import { queryOptions } from "@tanstack/react-query";
import { getUserServices } from "@/actions/authActions";

export const userServicesQueryKey = ["auth", "user-services"] as const;

export class UserServicesError extends Error {
  constructor(
    message: string,
    public readonly reason: "unauthorized" | "unavailable",
  ) {
    super(message);
    this.name = "UserServicesError";
  }
}

export function userServicesQueryOptions() {
  return queryOptions({
    queryKey: userServicesQueryKey,
    queryFn: async () => {
      const result = await getUserServices();
      if (!result.ok) {
        throw new UserServicesError(result.message, result.reason);
      }
      return result.data;
    },
    staleTime: 60 * 1000,
    retry: false,
  });
}
