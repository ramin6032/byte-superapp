/**
 * هوک رفرش توکن دسترسی.
 *
 * اکشن `refreshToken` را از طریق `useMutation` از TanStack Query صدا می‌زند و
 * وضعیت بارگذاری، خطا و نتیجه را مدیریت می‌کند.
 *
 * @returns شیء حاوی متد `refresh` و وضعیت‌های `isPending`، `isError`، `error`، `data`
 */
import { useMutation } from "@tanstack/react-query";
import { refreshToken } from "@/actions/authActions";
import type { ServerActionResponse } from "@/actions/callApi";

export type UseRefreshTokenReturn = {
  refresh: (
    token: string,
  ) => Promise<ServerActionResponse<{ token?: string }> | undefined>;
  isPending: boolean;
  isError: boolean;
  error: string | null;
  data: { token?: string } | undefined;
  reset: () => void;
};

export function useRefreshToken(): UseRefreshTokenReturn {
  const mutation = useMutation({
    mutationFn: (token: string) => refreshToken(token),
  });

  const refresh = async (
    token: string,
  ): Promise<ServerActionResponse<{ token?: string }> | undefined> => {
    const result = await mutation.mutateAsync(token);
    return result;
  };

  return {
    refresh,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
      ? mutation.error instanceof Error
        ? mutation.error.message
        : String(mutation.error)
      : null,
    data: mutation.data?.ok ? mutation.data.data : undefined,
    reset: mutation.reset,
  };
}
