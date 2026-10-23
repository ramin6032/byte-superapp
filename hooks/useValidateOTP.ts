"use client";

import { useMutation } from "@tanstack/react-query";
import { validateOTP } from "@/actions/authActions";
import type { ServerActionResponse } from "@/actions/callApi";

/**
 * Return type for the OTP validation hook.
 */
export type UseValidateOTPReturn<T = unknown> = {
  verifyOTP: (
    cellPhone: string,
    secret: string,
  ) => Promise<ServerActionResponse>;
  isPending: boolean;
  isError: boolean;
  error: string | null;
  data: T | undefined;
  reset: () => void;
};

/**
 * Provides mutation state and executes OTP validation through a Server Action.
 */
export function useValidateOTP(): UseValidateOTPReturn {
  const mutation = useMutation({
    mutationFn: ({
      cellPhone,
      secret,
    }: {
      cellPhone: string;
      secret: string;
    }) => validateOTP({ cellPhone, secret }),
  });

  /**
   * Validates the OTP and returns the action result.
   */
  const verifyOTP = async (
    cellPhone: string,
    secret: string,
  ): Promise<ServerActionResponse> => {
    return mutation.mutateAsync({ cellPhone, secret });
  };

  return {
    verifyOTP,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
      ? mutation.error instanceof Error
        ? mutation.error.message
        : String(mutation.error)
      : !mutation.data?.ok
        ? (mutation.data?.message ?? null)
        : null,
    data: mutation.data?.ok ? mutation.data.data : undefined,
    reset: mutation.reset,
  };
}
