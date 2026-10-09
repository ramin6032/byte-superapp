import { ChessQueen, HomeIcon, User, Wallet, Smartphone } from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
  route?: string;
  isActive?: boolean;
  badge?: string | number;
};

export const NAV_ITEMS: NavItem[] = [
  {
    id: "club",
    label: "باشگاه",
    icon: ChessQueen,
    route: "/club",
  },
  {
    id: "profile",
    label: "پروفایل",
    icon: User,
    route: "/profile",
  },
  {
    id: "home",
    label: "خانه",
    icon: HomeIcon,
    route: "/homePage",
    isActive: true,
  },
  {
    id: "my-services",
    label: "سرویس من",
    icon: Smartphone,
    route: "/my-services",
  },
  {
    id: "transactions",
    label: "تراکنش‌ها",
    icon: Wallet,
    route: "/transactions",
  },
];
