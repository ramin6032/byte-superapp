import {
  Wifi,
  Cable,
  Radio,
  Signal,
  Router,
  type LucideIcon,
} from "lucide-react";

/**
 * مدل یک سرویس کمپانی قابل ثبت‌نام.
 */
export type CompanyService = {
  /** شناسه منحصربه‌فرد سرویس */
  id: string;
  /** عنوان سرویس */
  title: string;
  /** زیرعنوان/توضیح کوتاه */
  subtitle: string;
  /** آیکون نمایشی */
  icon: LucideIcon;
  /** رنگ آیکون */
  color: string;
  /** مسیر ثبت‌نام */
  route: string;
};

/**
 * لیست سرویس‌های کمپانی برای ثبت اشتراک جدید.
 *
 * هر سرویس با کلیک، کاربر را به صفحه ثبت‌نام مربوطه منتقل می‌کند.
 */
export const companyServices: CompanyService[] = [
  {
    id: "tci-adsl",
    title: "اینترنت خانگی مخابرات",
    subtitle: "ADSL",
    icon: Cable,
    color: "#0C6FFF",
    route: "/register/tci-adsl",
  },
  {
    id: "tci-fiber",
    title: "فیبر نوری",
    subtitle: "FTTH",
    icon: Wifi,
    color: "#22C55E",
    route: "/register/tci-fiber",
  },
  {
    id: "adsl",
    title: "اینترنت خانگی بایت",
    subtitle: "بایت",
    icon: Router,
    color: "#8B5CF6",
    route: "/register/adsl",
  },
  {
    id: "wireless",
    title: "وایرلس",
    subtitle: "Wireless",
    icon: Radio,
    color: "#F59E0B",
    route: "/register/wireless",
  },
  {
    id: "hotspot",
    title: "هوت اسپات",
    subtitle: "Hotspot",
    icon: Signal,
    color: "#EC4899",
    route: "/register/hotspot",
  },
];
