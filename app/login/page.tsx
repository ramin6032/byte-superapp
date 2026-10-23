"use client";

/**
 * صفحه ورود کاربر.
 *
 * مسیر: `/login` — کامپوننت کلاینت با دو حالت «رمز عبور» و «رمز یکبارمصرف (OTP)».
 * شامل اعتبارسنجی موبایل، مدیریت آفلاین/آنلاین و فرم‌های Ant Design.
 *
 * @returns فرم ورود کامل
 */
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Button, Form, Input, Segmented, Space, Typography } from "antd";
import type { OTPRef } from "antd/es/input/OTP";
import type { Rule } from "antd/es/form";
import { Lock, Phone, Send, WifiOff } from "lucide-react";
import { useCreateOTP } from "@/hooks/useCreateOTP";
import { useValidateOTP } from "@/hooks/useValidateOTP";
import { useRefreshToken } from "@/hooks/useRefreshToken";
import { useDecodeToken } from "@/hooks/useDecodeToken";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { userServicesQueryKey } from "@/lib/user-services-query";
import { useUserServicesStore } from "@/stores/useUserServicesStore";

/**
 * حالت فعلی فرم ورود.
 * @type {"password" | "otp"}
 */
type LoginMode = "password" | "otp";

/**
 * مرحله فعلی در جریان OTP.
 * @type {"mobile" | "code" | "success"}
 */
type OtpStep = "mobile" | "code" | "success";

/**
 * مقادیر فرم حالت رمز عبور.
 */
type PasswordFormValues = {
  /** شناسه (موبایل یا نام کاربری) */
  identifier: string;
  /** رمز عبور */
  password: string;
};

/**
 * مقادیر فرم وارد کردن موبایل برای OTP.
 */
type MobileFormValues = {
  /** شماره موبایل ۱۱ رقمی با پیشوند ۰۹ */
  mobile: string;
};

/**
 * مقادیر فرم تایید کد OTP.
 */
type CodeFormValues = {
  /** کد ۵ رقمی دریافت‌شده */
  code: string;
};

/**
 * الگو برای اعتبارسنجی شماره موبایل ایران (۰۹XXXXXXXXX).
 * @type {RegExp}
 */
const MOBILE_PATTERN = /^09\d{9}$/;

/**
 * طول کد OTP (تعداد ارقام).
 * @type {number}
 */
const OTP_LENGTH = 6;

/**
 * تبدیل ارقام انگلیسی/عربی به ارقام فارسی.
 *
 * @param value - مقدار عددی یا رشته‌ای
 * @returns رشته با ارقام فارسی
 */
const toPersianDigits = (value: string | number) =>
  String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);

/**
 * کلاس‌های اشتراکی کارت فرم (سایه، گردی، پس‌زمینه).
 * @type {string}
 */
const cardCls =
  "w-full bg-white rounded-[18px] shadow-[0px_4px_12px_0px_rgba(175,186,205,0.37)]";

/**
 * پراپ‌های مشترک آیکون‌های Lucide در ورودی‌ها.
 * @type {{ strokeWidth: 1; size: 18 }}
 */
const iconProps = { strokeWidth: 1, size: 18 } as const;

/**
 * پراپ‌های مشترک کنترل‌های Input/Form.Item.
 * @type {{ variant: "outlined"; size: "large"; className: "text-[13px]" }}
 */
const inputSharedProps = {
  variant: "outlined" as const,
  size: "large" as const,
  className: "text-[13px]",
};

/**
 * ذخیره توکن در کوکی مرورگر.
 *
 * @param token - توکن دسترسی
 * @param days - تعداد روز تا انقضا (پیش‌فرض ۷ روز)
 */
function setAuthCookie(token: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000,
  ).toUTCString();
  document.cookie = `byte_token=${token}; path=/; expires=${expires}; SameSite=Lax`;
}

/**
 * خواندن توکن از کوکی مرورگر.
 *
 * @returns توکن ذخیره شده یا رشته خالی
 */
function getAuthCookie(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|; )byte_token=([^;]*)/);
  return match ? match[1] : "";
}

/**
 * حذف توکن از کوکی مرورگر.
 */
function removeAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie =
    "byte_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

/**
 * رندر صفحه ورود.
 *
 * بسته به `mode` فرم رمز عبور یا جریان دو مرحله‌ای OTP را نمایش می‌دهد و در صورت
 * قطع اینترنت، هشدار آفلاین نشان می‌دهد. پس از تایید موفق OTP، توکن دریافت‌شده
 * در کوکی ذخیره و اطلاعات کاربر از طریق decodeToken استخراج می‌شود.
 *
 * @returns المان فرم ورود
 */
export default function LoginPage() {
  const [mode, setMode] = useState<LoginMode>("password");
  const [isOnline, setIsOnline] = useState(true);
  const [otpStep, setOtpStep] = useState<OtpStep>("mobile");
  const otpInputRef = useRef<OTPRef | null>(null);
  const [otpMobile, setOtpMobile] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearUserServices = useUserServicesStore(
    (state) => state.clearUserServices,
  );

  useEffect(() => {
    queryClient.removeQueries({ queryKey: userServicesQueryKey });
    clearUserServices();
  }, [queryClient, clearUserServices]);

  const {
    sendOTP,
    isPending: isSendingOtp,
    error: otpError,
    reset: resetOTP,
  } = useCreateOTP();

  const {
    verifyOTP,
    isPending: isVerifyingOtp,
    error: verifyError,
    data: verifyData,
    reset: resetVerify,
  } = useValidateOTP();

  const {
    refresh: refreshToken,
    isPending: isRefreshing,
    error: refreshError,
    reset: resetRefresh,
  } = useRefreshToken();

  const {
    decode: decodeToken,
    isPending: isDecoding,
    error: decodeError,
    data: decodeData,
    reset: resetDecode,
  } = useDecodeToken();

  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  // وقتی مرحله وارد کردن کد نمایش داده می‌شود، فوکوس روی فیلد OTP قرار می‌گیرد
  useEffect(() => {
    if (otpStep === "code") {
      otpInputRef.current?.focus();
    }
  }, [otpStep]);

  const handleModeChange = useCallback(
    (value: LoginMode) => {
      setMode(value);
      setOtpStep("mobile");
      setOtpMobile("");
      resetOTP();
      resetVerify();
      resetRefresh();
      resetDecode();
    },
    [resetOTP, resetVerify, resetRefresh, resetDecode],
  );

  const handleSendCode = useCallback(
    async (values: MobileFormValues) => {
      const result = await sendOTP(values.mobile);
      if (result?.ok) {
        setOtpMobile(values.mobile);
        setOtpStep("code");
      }
    },
    [sendOTP],
  );

  const handleVerifyCode = useCallback(
    async (values: CodeFormValues) => {
      const result = await verifyOTP(otpMobile, values.code);
      if (result?.ok) {
        router.replace("/homePage");
      }
    },
    [otpMobile, verifyOTP, router],
  );

  const handleResendCode = useCallback(async () => {
    await sendOTP(otpMobile);
  }, [otpMobile, sendOTP]);

  const handleChangeMobile = useCallback(() => {
    setOtpStep("mobile");
    resetOTP();
    resetVerify();
  }, [resetOTP, resetVerify]);

  const passwordRules: Rule[] = [
    { required: true, message: "شماره موبایل یا نام کاربری را وارد کنید." },
    {
      validator: (_, value: string) => {
        if (!value || value.length >= 4) return Promise.resolve();
        return Promise.reject(
          new Error("شماره موبایل یا نام کاربری معتبر نیست."),
        );
      },
    },
  ];

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex justify-center pt-8 mb-6">
        <Image
          src="/logos/blue-logo.svg"
          alt="بایت"
          width={120}
          height={80}
          loading="eager"
        />
      </div>

      <div className="flex flex-1 flex-col px-4 ">
        {/* error messages */}
        <div className="mb-3">
          {!isOnline && (
            <Alert
              type="warning"
              showIcon
              icon={<WifiOff size={18} strokeWidth={1} />}
              title="ارتباط شبکه برقرار نیست."
              description="اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید."
            />
          )}

          {otpError && <Alert type="error" showIcon title={otpError} />}

          {verifyError && <Alert type="error" showIcon title={verifyError} />}

          {refreshError && <Alert type="error" showIcon title={refreshError} />}

          {decodeError && <Alert type="error" showIcon title={decodeError} />}
        </div>

        <div className={` p-1 mb-3`}>
          <Segmented
            block
            value={mode}
            onChange={(value) => handleModeChange(value as LoginMode)}
            options={[
              { label: "ورود با رمز عبور", value: "password" },
              { label: "ورود با رمز یکبار مصرف", value: "otp" },
            ]}
          />
        </div>

        <div className={`${cardCls} p-6`}>
          {mode === "password" ? (
            <Form<PasswordFormValues>
              layout="vertical"
              requiredMark={false}
              size="medium"
              preserve={false}
              disabled={!isOnline}
            >
              <Form.Item
                name="identifier"
                rules={passwordRules}
                className="!mb-4"
              >
                <Input
                  {...inputSharedProps}
                  prefix={<Phone className="text-[#52759F]" {...iconProps} />}
                  placeholder="شماره موبایل یا نام کاربری"
                  autoComplete="username"
                />
              </Form.Item>

              <Form.Item
                name="password"
                className="!mb-4"
                rules={[
                  { required: true, message: "رمز عبور را وارد کنید." },
                  {
                    min: 6,
                    message: "رمز عبور باید حداقل ۶ کاراکتر باشد.",
                  },
                ]}
              >
                <Input.Password
                  {...inputSharedProps}
                  prefix={<Lock className="text-[#52759F]" {...iconProps} />}
                  placeholder="رمز عبور"
                  autoComplete="current-password"
                />
              </Form.Item>

              <div className="mb-4 flex items-center justify-between text-[12px]">
                <Button type="link" size="small" className="!px-0 !text-[12px]">
                  فراموشی رمز عبور؟
                </Button>
                <Typography.Text className="!text-[12px] !text-[#52759F]">
                  ورود با رمز عبور
                </Typography.Text>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                block
                shape="round"
                icon={<Send {...iconProps} />}
              >
                ورود
              </Button>
            </Form>
          ) : otpStep === "mobile" ? (
            <Form<MobileFormValues>
              layout="vertical"
              requiredMark={false}
              size="medium"
              preserve={false}
              initialValues={otpMobile ? { mobile: otpMobile } : undefined}
              disabled={!isOnline}
              onFinish={handleSendCode}
            >
              <Form.Item
                name="mobile"
                className="!mb-4"
                rules={[
                  { required: true, message: "شماره موبایل را وارد کنید." },
                  {
                    pattern: MOBILE_PATTERN,
                    message: "شماره موبایل معتبر نیست.",
                  },
                ]}
              >
                <Input
                  {...inputSharedProps}
                  prefix={<Phone className="text-[#52759F]" {...iconProps} />}
                  placeholder="شماره موبایل"
                  inputMode="numeric"
                  maxLength={11}
                  autoComplete="tel"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                shape="round"
                loading={isSendingOtp}
                icon={<Send {...iconProps} />}
              >
                ارسال کد
              </Button>
            </Form>
          ) : (
            <Form<CodeFormValues>
              layout="vertical"
              requiredMark={false}
              size="medium"
              preserve={false}
              disabled={!isOnline}
              onFinish={handleVerifyCode}
            >
              <Typography.Paragraph className="!mb-4 !text-[12px] !text-[#52759F] text-center">
                کد ۵ رقمی ارسال شده به شماره {toPersianDigits(otpMobile)} را
                وارد کنید.
              </Typography.Paragraph>

              <Form.Item
                name="code"
                className="!mb-4 flex justify-center"
                rules={[
                  { required: true, message: "کد یکبار مصرف را وارد کنید." },
                  {
                    len: OTP_LENGTH,
                    message: `کد وارد کنید باید ${toPersianDigits(OTP_LENGTH)} رقم باشد.`,
                  },
                ]}
              >
                <Input.OTP
                  ref={otpInputRef}
                  length={OTP_LENGTH}
                  size="large"
                  className="w-full text-[13px]"
                  style={{ direction: "ltr" }}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
              </Form.Item>

              <Space orientation="vertical" size={12} className="w-full">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  shape="round"
                  loading={isVerifyingOtp}
                  icon={<Send {...iconProps} />}
                >
                  ورود
                </Button>

                <div className="flex items-center justify-between text-[12px]">
                  <Button
                    type="link"
                    size="small"
                    className="!px-0 !text-[12px]"
                    loading={isSendingOtp}
                    onClick={handleResendCode}
                  >
                    ارسال مجدد
                  </Button>
                  <Button
                    type="link"
                    size="small"
                    className="!px-0 !text-[12px]"
                    onClick={handleChangeMobile}
                  >
                    ویرایش شماره موبایل
                  </Button>
                </div>
              </Space>
            </Form>
          )}
        </div>

        <div className="mt-auto pt-4 text-center text-[12px] text-[#52759F]">
          <span>حساب ندارید؟ </span>
          <Button type="link" size="small" className="!px-0 !text-[12px]">
            ثبت نام کنید
          </Button>
        </div>
      </div>
    </div>
  );
}
