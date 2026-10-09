"use client";

/**
 * بخش هشدارهای صفحه خانه با استفاده از message آنت‌دیزای.
 *
 * داده‌های هشدارها از فایل JSON خوانده شده و با استفاده از `message.config` و یک
 * نگهدارنده (container) داخلی به‌صورت پشته‌ای در بخش هشدارها نمایش داده می‌شوند.
 * هر هشدار شامل آیکون، عنوان، توضیح و دکمه بستن است.
 */

import { useEffect } from "react";
import { message } from "antd";
import { TriangleAlert, Info, X } from "lucide-react";
import alertsData from "./alertsData.json";

type AlertType = "warning" | "info" | "success" | "error";

type AlertItem = {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  icon: string;
  duration: number;
};

const ICONS = {
  "triangle-alert": TriangleAlert,
  info: Info,
} as const;

const TYPE_CONFIG = {
  warning: {
    borderColor: "border-amber-200",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  info: {
    borderColor: "border-blue-200",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  success: {
    borderColor: "border-green-200",
    bgColor: "bg-green-50",
    iconColor: "text-green-500",
  },
  error: {
    borderColor: "border-red-200",
    bgColor: "bg-red-50",
    iconColor: "text-red-500",
  },
} as const;

const iconProps = { strokeWidth: 1, size: 28 } as const;
const closeIconProps = { strokeWidth: 1, size: 20 } as const;

function AlertContent({
  item,
  onClose,
}: {
  item: AlertItem;
  onClose: () => void;
}) {
  const config = TYPE_CONFIG[item.type];
  const Icon = ICONS[item.icon as keyof typeof ICONS] ?? TriangleAlert;

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-[16px] border ${config.borderColor} ${config.bgColor} w-full max-w-md`}
      role="alert"
    >
      <Icon className={`shrink-0 ${config.iconColor}`} {...iconProps} />
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <p className="text-blue-900 text-[13px] font-medium leading-snug">
          {item.title}
        </p>
        <p className="text-[#52759F] text-[12px] font-light leading-snug">
          {item.description}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 text-black/60 hover:text-black/90 transition-colors p-1 -mt-1"
        aria-label="بستن هشدار"
      >
        <X {...closeIconProps} />
      </button>
    </div>
  );
}

/**
 * راه‌اندازی و نمایش پشته هشدارها با message آنت‌دیزای.
 * یک نگهدارنده DOM (ref) فراهم می‌کند و `message.config` را برای استفاده از آن تنظیم می‌کند.
 * در مونت، تمام هشدارها را با `message.open` در نگهدارنده نمایش می‌دهد.
 *
 * @returns المان شامل نگهدارنده پیام‌ها
 */
export function Alerts() {
  const alerts = alertsData as AlertItem[];

  const [messageApi, contextHolder] = message.useMessage({
    stack: { threshold: 1 },
  });

  useEffect(() => {
    alerts.forEach((item) => {
      messageApi.open({
        key: item.id,
        content: (
          <AlertContent
            item={item}
            onClose={() => {
              messageApi.destroy(item.id);
            }}
          />
        ),
        duration: item.duration,
      });
    });

    return () => {
      alerts.forEach((item) => messageApi.destroy(item.id));
    };
  }, [alerts, messageApi]);

  return <>{contextHolder}</>;
}
