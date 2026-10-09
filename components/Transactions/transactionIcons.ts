/**
 * نگاشت انواع تراکنش به آیکون‌های lucide.
 *
 * این ماژول مشترک بین فهرست تراکنش‌ها و صفحه جزئیات استفاده می‌شود
 * تا هر نوع تراکنش در هر دو صفحه همیشه با یک آیکون نمایش داده شود.
 */

import {
  CreditCard,
  Globe,
  Package,
  RefreshCw,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import type { TransactionType } from "@/lib/transactions";

/**
 * نگاشت نوع تراکنش به کامپوننت آیکون lucide.
 */
export const TRANSACTION_ICONS: Record<TransactionType, LucideIcon> = {
  traffic: Wifi,
  renewal: RefreshCw,
  ip: Globe,
  equipment: Package,
  subscription: CreditCard,
};
