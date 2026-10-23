"use server";

import { cookies } from "next/headers";
import {
  CrmApiError,
  callCrmApi,
  callCrmApiWithCookies,
  callValidateOtpApi,
  getAccessToken,
  type ServerActionResponse,
} from "./callApi";

/**
 * createOTP / validateOTP / refreshToken / decodeToken
 */

/**
 * پاسخ درخواست دیکد کردن توکن
 */
export type DecodeTokenResponse = {
  intUserID: string;
  username: string;
  serviceType: string;
  providerID: string;
};

export type AuthActionResponse<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      message: string;
      reason: "unauthorized" | "unavailable";
    };

/**
 * ایجاد کد یکبار مصرف (OTP) برای شماره موبایل.
 *
 * @param cellPhone - شماره موبایل ۱۱ رقمی با پیشوند ۰۹
 * @returns نتیجه ایجاد OTP
 */
export async function createOTP(
  cellPhone: string,
): Promise<ServerActionResponse> {
  try {
    const api = await callCrmApi<{ result: number; message: string }>(
      "createOTP",
      {
        cellPhone,
      },
    );

    if (api.result === 1) {
      return { ok: true, data: api.response };
    }

    return {
      ok: false,
      message: api.message || "خطا در ایجاد کد یکبار مصرف.",
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("fetch failed")) {
      return {
        ok: false,
        message: "خطای ارتباط با سرور. اینترنت خود را چک کنید",
      };
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "خطا در ارتباط با سرور.",
    };
  }
}

/**
 * Persists the CRM refresh token as a secure Next.js cookie.
 *
 * Only the expected refreshToken cookie is accepted.
 * Cookie attributes are parsed from the original Set-Cookie header.
 */
async function persistRefreshToken(setCookies: string[]): Promise<void> {
  const refreshCookie = setCookies.find((cookie) =>
    /^refreshToken=/i.test(cookie),
  );

  if (!refreshCookie) {
    throw new Error("کوکی refreshToken در پاسخ سرور دریافت نشد.");
  }

  const segments = refreshCookie.split(";");
  const firstSegment = segments[0];
  const separatorIndex = firstSegment.indexOf("=");

  if (separatorIndex < 0) {
    throw new Error("فرمت کوکی refreshToken معتبر نیست.");
  }

  const value = firstSegment.slice(separatorIndex + 1);

  const attributes = new Map<string, string | true>();

  for (const segment of segments.slice(1)) {
    const index = segment.indexOf("=");
    const key = (index < 0 ? segment : segment.slice(0, index))
      .trim()
      .toLowerCase();

    const attributeValue = index < 0 ? true : segment.slice(index + 1).trim();

    attributes.set(key, attributeValue);
  }

  const maxAgeValue = attributes.get("max-age");
  const expiresValue = attributes.get("expires");
  const sameSiteValue = attributes.get("samesite");

  const maxAge =
    typeof maxAgeValue === "string" ? Number(maxAgeValue) : undefined;

  const expires =
    typeof expiresValue === "string" ? new Date(expiresValue) : undefined;

  const sameSite =
    typeof sameSiteValue === "string" &&
    ["strict", "lax", "none"].includes(sameSiteValue.toLowerCase())
      ? (sameSiteValue.toLowerCase() as "strict" | "lax" | "none")
      : "strict";

  const cookieStore = await cookies();

  cookieStore.set("refreshToken", value, {
    httpOnly: attributes.has("httponly"),
    secure: attributes.has("secure"),
    sameSite,
    path:
      typeof attributes.get("path") === "string"
        ? (attributes.get("path") as string)
        : "/",
    ...(maxAge !== undefined && Number.isFinite(maxAge) ? { maxAge } : {}),
    ...(expires && !Number.isNaN(expires.getTime()) ? { expires } : {}),
  });
}

/**
 * اعتبار سنجی کد یکبار مصرف (OTP) برای شماره موبایل.
 *
 * @param cellPhone - شماره موبایل ۱۱ رقمی با پیشوند ۰۹
 * @param secret - کد ۵ رقمی دریافت‌شده
 * @returns نتیجه اعتبار سنجی OTP (حاوی توکن در صورت موفقیت)
 */
export async function validateOTP({
  cellPhone,
  secret,
}: {
  cellPhone: string;
  secret: string;
}): Promise<ServerActionResponse<{ token: string } | null>> {
  try {
    const { data: api, setCookies } = await callValidateOtpApi("validateOTP", {
      cellPhone,
      secret,
    });

    if (api.result !== 1) {
      return {
        ok: false,
        message: api.message || "کد یکبار مصرف معتبر نیست.",
      };
    }

    const token = api.response?.token;

    if (!token) {
      return {
        ok: false,
        message: "توکن احراز هویت از سرور دریافت نشد.",
      };
    }

    const cookieStore = await cookies();

    cookieStore.set("access-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    await persistRefreshToken(setCookies);

    return {
      ok: true,
      data: api.response,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "خطا در ارتباط با سرور.",
    };
  }
}

/**
 * رفرش توکن دسترسی با استفاده از توکن فعلی.
 *
 * @param token - توکن دسترسی فعلی
 * @returns نتیجه رفرش توکن (حاوی توکن جدید در صورت موفقیت)
 */
export async function refreshToken(
  token: string,
): Promise<AuthActionResponse<{ token: string }>> {
  try {
    const cookieStore = await cookies();
    const refreshCookie = cookieStore.get("refreshToken")?.value;

    if (!token || !/^[\x21-\x7e]+$/.test(token) || !refreshCookie) {
      return {
        ok: false,
        reason: "unauthorized",
        message: "نشست کاربری منقضی شده است. دوباره وارد شوید.",
      };
    }

    const { data: api, setCookies } = await callCrmApiWithCookies<{
      token?: string;
    }>("refreshToken", undefined, {
      authorization: `Bearer ${token}`,
      cookie: `refreshToken=${encodeURIComponent(refreshCookie)}`,
      signal: AbortSignal.timeout(10000),
    });

    if (typeof api?.result !== "number") {
      throw new Error("پاسخ سرور برای نوسازی توکن معتبر نیست.");
    }

    if (api.result === 1) {
      const newToken = api.response?.token;
      if (typeof newToken !== "string" || !/^[\x21-\x7e]+$/.test(newToken)) {
        throw new Error("توکن جدید از سرور دریافت نشد.");
      }

      if (setCookies.some((cookie) => /^refreshToken=/i.test(cookie))) {
        await persistRefreshToken(setCookies);
      }

      cookieStore.set("access-token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return { ok: true, data: { token: newToken } };
    }

    return {
      ok: false,
      reason: "unauthorized",
      message: api.message || "خطا در رفرش توکن.",
    };
  } catch (error) {
    return {
      ok: false,
      reason:
        error instanceof CrmApiError && [401, 403].includes(error.status)
          ? "unauthorized"
          : "unavailable",
      message:
        error instanceof Error ? error.message : "خطا در ارتباط با سرور.",
    };
  }
}

/**
 * دیکد کردن توکن برای دریافت اطلاعات کاربر.
 *
 * @param token - توکن دسترسی
 * @returns نتیجه دیکد توکن (حاوی اطلاعات کاربر در صورت موفقیت)
 */
export async function decodeToken(
  token: string,
): Promise<AuthActionResponse<DecodeTokenResponse[]>> {
  try {
    if (!token || !/^[\x21-\x7e]+$/.test(token)) {
      return {
        ok: false,
        reason: "unauthorized",
        message: "توکن احراز هویت معتبر نیست.",
      };
    }

    const api = await callCrmApi<DecodeTokenResponse[]>(
      "decodeToken",
      { token },
      {
        authorization: `Bearer ${token}`,
        signal: AbortSignal.timeout(10000),
      },
    );

    console.log("api", api);

    if (typeof api?.result !== "number") {
      throw new Error("پاسخ سرور برای اعتبارسنجی توکن معتبر نیست.");
    }

    ///TODO: edit this line and remove response
    if (api.result === 1) {
      if (!Array.isArray(api.response)) {
        throw new Error("اطلاعات کاربر از سرور دریافت نشد.");
      }
      return { ok: true, data: api.response };
    }

    return {
      ok: false,
      reason: "unauthorized",
      message: api.message || "خطا در دیکد توکن.",
    };
  } catch (error) {
    return {
      ok: false,
      reason:
        error instanceof CrmApiError && [401, 403].includes(error.status)
          ? "unauthorized"
          : "unavailable",
      message:
        error instanceof Error ? error.message : "خطا در ارتباط با سرور.",
    };
  }
}

/** Reads the HttpOnly session, refreshes it once if needed, and returns no tokens.
 * خواندن توکن و تولید توکن جدید در صورت نیاز
 * اعتبارسنجی توکن و حذف توکن ها در صورت عدم اعتبار
 */
export async function getUserServices(): Promise<
  AuthActionResponse<DecodeTokenResponse[]>
> {
  const cookieStore = await cookies();
  const token = await getAccessToken();

  if (!token) {
    return {
      ok: false,
      reason: "unauthorized",
      message: "برای ادامه وارد حساب کاربری شوید.",
    };
  }

  let result = await decodeToken(token);

  if (!result.ok && result.reason === "unauthorized") {
    const refreshed = await refreshToken(token);
    if (!refreshed.ok) {
      if (refreshed.reason === "unauthorized") {
        cookieStore.delete("access-token");
        cookieStore.delete("refreshToken");
      }
      return refreshed;
    }

    result = await decodeToken(refreshed.data.token);
    if (!result.ok && result.reason === "unauthorized") {
      cookieStore.delete("access-token");
      cookieStore.delete("refreshToken");
    }
  }

  return result;
}
