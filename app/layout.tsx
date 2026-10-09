/**
 * چیدمان ریشه اپلیکیشن (Root Layout).
 *
 * این فایل پوسته اصلی وب اپلیکیشن موبایل را فراهم می‌کند: زبان و جهت صفحه روی فارسی و
 * راست‌به‌چپ تنظیم می‌شود، قاب محتوا با عرض محدود و ارتفاع کامل در مرکز قرار می‌گیرد و
 * استایل‌های سراسری، رجیستری سمت‌سرور آنت‌دیزاین و ارائه‌دهنده‌های برنامه در آن ثبت می‌شوند.
 *
 * همچنین متادیتای سند، تنظیمات ویوپورت و فونت محلی وزیرمتن را برای کل برنامه تعریف می‌کند.
 */

import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Providers } from "./providers";

/**
 * متادیتای سند برای صفحات برنامه.
 *
 * عنوان، توضیح، نام اپلیکیشن و کلیدواژه‌هایی است که موتورهای جستجو و مرورگرها استفاده می‌کنند.
 *
 * @returns شیء متادیتای ایستا شامل عنوان «بایت»، توضیح برنامه، نام اپلیکیشن و کلیدواژه‌ها
 */
export const metadata = {
  title: "بایت",
  description: "وب اپلیکیشن شرکت بایت",
  applicationName: "بایت",
  keywords: ["بایت", "وب اپلیکیشن"],
};

/**
 * تنظیمات ویوپورت برای رفتار صفحه در دستگاه‌های موبایل.
 *
 * عرض صفحه برابر عرض دستگاه قرار می‌گیرد، بزرگ‌نمایی و زوم کاربر غیرفعال می‌شود تا چیدمان
 * اپلیکیشن موبایل ثابت بماند و رنگ نوار مرورگر برای هر دو حالت روشن و تاریک مشخص می‌گردد.
 *
 * @returns شیء ویوپورت شامل عرض، مقیاس اولیه، محدودیت زوم، رنگ تم و طرح رنگی صفحه
 */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2A5CAA" },
    { media: "(prefers-color-scheme: dark)", color: "#2A5CAA" },
  ],
  colorScheme: "light",
};

/**
 * تعریف فونت محلی وزیرمتن برای کل برنامه.
 *
 * چهار وزن Light، Regular، Medium و Bold از فایل‌های woff2 در پوشه فونت بارگذاری می‌شوند و
 * کلاس و متغیر CSS آن‌ها برای اعمال فونت روی ریشه سند در دسترس قرار می‌گیرد.
 *
 * @returns خروجی تنظیمات localFont شامل کلاس فونت و نام متغیر CSS برای استفاده در layout
 */
const myFont = localFont({
  src: [
    {
      path: "../assets/fonts/Vazirmatn-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/Vazirmatn-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Vazirmatn-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/Vazirmatn-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  preload: true,
  variable: "--font-vazirmatn",
});

/**
 * کامپوننت پیش‌فرض چیدمان ریشه که ساختار HTML و پوسته اپلیکیشن موبایل را می‌سازد.
 *
 * سند را با زبان فارسی و جهت راست‌به‌چپ تولید می‌کند، فونت وزیرمتن را اعمال می‌کند و محتوا را
 * درون قابی با عرض محدود و ارتفاع کامل در مرکز صفحه قرار می‌دهد. سپس محتوا را داخل
 * AntdRegistry برای استایل‌های سمت‌سرور آنت‌دیزاین و Providers برای ارائه‌دهنده‌های برنامه قرار می‌دهد.
 *
 * @param props.children - محتوای صفحه که باید درون پوسته چیدمان ریشه رندر شود
 * @returns عنصر ریشه سند شامل تگ‌های html و body با پوسته اپلیکیشن موبایل
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={cn(
        "h-full",
        "antialiased",
        myFont.className,
        myFont.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full flex flex-col">
        <div className="min-h-dvh h-dvh bg-[#F3F7FE] ">
          <div className="w-full max-w-xl h-full flex flex-col justify-between mx-auto">
            <AntdRegistry>
              <Providers>{children}</Providers>
            </AntdRegistry>
          </div>
        </div>
      </body>
    </html>
  );
}
