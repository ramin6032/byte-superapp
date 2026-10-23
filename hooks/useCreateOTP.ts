/**
 * هوک ایجاد کد یکبار مصرف (OTP).
 *
 * اکشن `createOTP` را از طریق `useMutation` از TanStack Query صدا می‌زند و
 * وضعیت بارگذاری، خطا و نتیجه را مدیریت می‌کند.
 *
 * @returns شیء حاوی متد `sendOTP` و وضعیت‌های `isPending`، `isError`، `error`، `data`
 */
import { useMutation } from "@tanstack/react-query";
import { createOTP } from "@/actions/authActions";
import { ServerActionResponse } from "@/actions/callApi";

export type UseCreateOTPReturn = {
  sendOTP: (cellPhone: string) => Promise<ServerActionResponse>;
  isPending: boolean;
  isError: boolean;
  error: string | null;
  reset: () => void;
};

export function useCreateOTP(): UseCreateOTPReturn {
  const mutation = useMutation({
    mutationFn: (cellPhone: string) => createOTP(cellPhone),
  });

  const sendOTP = async (cellPhone: string): Promise<ServerActionResponse> => {
    const result = await mutation.mutateAsync(cellPhone);
    return result;
  };

  return {
    sendOTP,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
      ? mutation.error instanceof Error
        ? mutation.error.message
        : String(mutation.error)
      : !mutation.data?.ok && mutation.data?.message
        ? mutation.data.message
        : null,
    reset: mutation.reset,
  };
}
