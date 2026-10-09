"use client";

/**
 * فراهم‌کننده‌های سراسری اپلیکیشن (Ant Design، RTL، تم، لوکال).
 *
 * کامپوننت کلاینت که ConfigProvider و App را برای کل درخت React راه‌اندازی می‌کند.
 *
 * @param children - فرزندان React که در بستر Ant Design رندر می‌شوند
 * @returns Providers wrapper
 */
import { App as AntdApp, ConfigProvider, type ThemeConfig } from "antd";
import faIR from "antd/locale/fa_IR";

/**
 * پیکربندی تم Ant Design برای برند اپلیکیشن.
 *
 * @type {ThemeConfig}
 */
const theme: ThemeConfig = {
  token: {
    colorPrimary: "#0C6FFF",
    colorLink: "#0C6FFF",
    colorTextBase: "#0A2540",
    fontFamily: "var(--font-vazirmatn), Vazirmatn, system-ui, sans-serif",
    fontSize: 13,
    borderRadius: 12,
    controlHeight: 42,
  },
  components: {
    Button: {
      controlHeight: 42,
      fontWeight: 500,
      primaryShadow: "none",
      defaultShadow: "none",
    },
    Input: {
      activeShadow: "0 0 0 3px rgba(12, 111, 255, 0.12)",
      errorActiveShadow: "0 0 0 3px rgba(255, 0, 0, 0.12)",
      controlHeight: 42,
    },
    Segmented: {
      itemSelectedBg: "#607d8b",
      itemSelectedColor: "#fff",
      trackBg: "#fff",
      trackPadding: 4,
    },
    Alert: {
      borderRadiusLG: 16,
    },
  },
};

/**
 * رندر فراهم‌کننده‌های سراسری.
 *
 * @param props - تنظیمات فراهم‌کننده
 * @param props.children - درخت React که با تم، لوکال و جهت فارسی رندر می‌شود
 * @returns پوشش‌دهنده ConfigProvider و AntdApp
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider direction="rtl" locale={faIR} theme={theme}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}
