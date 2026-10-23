import { cookies } from "next/headers";

/**
 * پاسخ استاندارد API سیترا.
 */
export type CrmApiResponse<T = unknown> = {
  result: number;
  message: string;
  response: T;
};

/**
 * پاسخ استاندارد درخواست اعتبارسنجی کد یکبارمصرف.
 */
type validateOtpResponse = CrmApiResponse<{ token: string } | null>;

/**
 * پاسخ استاندارد اکشن های سمت سرور.
 */
export type ServerActionResponse<T = unknown> =
  | {
      ok: true;
      data: T;
    }
  | { ok: false; message: string };

const BASE_URL = process.env.CRM_API_URL || "";

export class CrmApiError extends Error {
  constructor(public readonly status: number) {
    super(`خطای سرور: ${status}`);
    this.name = "CrmApiError";
  }
}

/**
 * Reads the access token in a server-only context.
 */
export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("access-token")?.value;
}

/**
 * Optional configuration for CRM API requests.
 */
export type ApiOptions = {
  /** Optional authorization header override. */
  authorization?: string;

  /** Optional cookie header forwarded to the CRM. */
  cookie?: string;

  /** Value sent through the Senddatatype header. Defaults to "nohash". */
  Senddatatype?: string;

  signal?: AbortSignal;
};

/**
 * Sends a request to the CRM API using the stored access token by default.
 *
 * @param operation - CRM operation name.
 * @param payload - Optional operation payload.
 * @param options - Optional request headers and configuration.
 * @returns Parsed CRM response and any Set-Cookie headers.
 */
export async function callCrmApi<T = unknown>(
  operation: string,
  payload?: Record<string, unknown>,
  options?: ApiOptions,
): Promise<CrmApiResponse<T>> {
  return (await callCrmApiWithCookies<T>(operation, payload, options)).data;
}

export async function callCrmApiWithCookies<T = unknown>(
  operation: string,
  payload?: Record<string, unknown>,
  options?: ApiOptions,
): Promise<{ data: CrmApiResponse<T>; setCookies: string[] }> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access-token")?.value;

  const headers: Record<string, string> = {
    Senddatatype: options?.Senddatatype?.trim() || "nohash",
    "Content-Type": "application/json",
  };

  // Explicit authorization takes precedence over the stored access token.
  if (options?.authorization !== undefined) {
    if (options.authorization) headers.Authorization = options.authorization;
  } else if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  if (options?.cookie) {
    headers.Cookie = options.cookie;
  }

  const body: Record<string, unknown> = { operation };

  if (payload) {
    body.data = payload;
  }

  const response = await fetch(BASE_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    cache: "no-store",
    signal: options?.signal,
  });

  console.log("response", response);

  if (!response.ok) {
    throw new CrmApiError(response.status);
  }

  return {
    data: (await response.json()) as CrmApiResponse<T>,
    setCookies: response.headers.getSetCookie(),
  };
}

/**
 * Sends a request to the CRM API using the stored access token by default.
 *
 * @param operation - CRM operation name.
 * @param payload - Optional operation payload.
 * @param options - Optional request headers and configuration.
 * @returns Parsed CRM response and any Set-Cookie headers.
 */
export async function callValidateOtpApi(
  operation: string,
  payload?: Record<string, unknown>,
): Promise<{
  data: validateOtpResponse;
  setCookies: string[];
}> {
  // OTP validation must not send a potentially expired access token.
  return callCrmApiWithCookies<{ token: string } | null>(operation, payload, {
    authorization: "",
  });
}

/**
 * Transfers CRM cookies to the browser through Next.js.
 * Call this only from a Server Action or Route Handler.
 */
export async function persistCrmCookies(setCookies: string[]) {
  const cookieStore = await cookies();

  for (const cookieString of setCookies) {
    const firstPart = cookieString.split(";")[0];
    const separatorIndex = firstPart.indexOf("=");

    if (separatorIndex <= 0) continue;

    const name = firstPart.slice(0, separatorIndex).trim();
    const value = firstPart.slice(separatorIndex + 1);

    const parts = cookieString
      .split(";")
      .slice(1)
      .map((part) => part.trim());

    const isSecure = parts.some((part) => part.toLowerCase() === "secure");

    const isHttpOnly = parts.some((part) => part.toLowerCase() === "httponly");

    const sameSitePart = parts.find((part) =>
      part.toLowerCase().startsWith("samesite="),
    );

    const sameSiteValue = sameSitePart?.split("=")[1]?.toLowerCase();

    cookieStore.set(name, value, {
      path: "/",
      httpOnly: isHttpOnly,
      secure: isSecure,
      sameSite:
        sameSiteValue === "strict" ||
        sameSiteValue === "none" ||
        sameSiteValue === "lax"
          ? sameSiteValue
          : "lax",
    });
  }
}
