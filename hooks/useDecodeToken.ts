/**
 * هوک دیکد کردن توکن برای دریافت اطلاعات کاربر.
 *
 * اکشن `decodeToken` را از طریق `useMutation` از TanStack Query صدا می‌زند و
 * وضعیت بارگذاری، خطا و نتیجه را مدیریت می‌کند.
 *
 *  * @returns شیء حاوی متد `decode` و وضعیت‌های `isPending`، `isError`، `error`، `data`
 */
import { useMutation } from "@tanstack/react-query";
import { decodeToken, type DecodeTokenResponse } from "@/actions/authActions";
import type { ServerActionResponse } from "@/actions/callApi";

export type UseDecodeTokenReturn = {
  decode: (token: string) => Promise<ServerActionResponse>;
  isPending: boolean;
  isError: boolean;
  error: string | null;
  data: DecodeTokenResponse[] | undefined;
  reset: () => void;
};

export function useDecodeToken(): UseDecodeTokenReturn {
  const mutation = useMutation({
    mutationFn: (token: string) => decodeToken(token),
  });

  const decode = async (token: string): Promise<ServerActionResponse> => {
    const result = await mutation.mutateAsync(token);
    return result;
  };

  return {
    decode,
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
