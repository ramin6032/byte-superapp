"use client";

/**
 * انتخاب‌کننده اشتراک‌ها با گروه‌بندی و دکمه اشتراک جدید.
 *
 * کامپوننت کلاینت که گروه‌ها و اشتراک‌ها را لیست می‌کند، انتخاب را مدیریت می‌کند
 * و پیش‌فرض ناوبری به داشبورد/ثبت‌نام را فراهم می‌کند (قابل override با onSelect/onRegisterNew).
 *
 * @param groups - گروه‌های اشتراک
 * @param selectedId - شناسه اشتراک انتخاب‌شده (اختیاری)
 * @param onSelect - کال‌بک انتخاب اشتراک (اختیاری؛ پیش‌فرض: push به `/subscription/:id/dashboard`)
 * @param onRegisterNew - کال‌بک ثبت اشتراک جدید (اختیاری؛ پیش‌فرض: push به `/subscription/register`)
 * @returns بخش انتخاب اشتراک
 */
import { ChevronLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * مدل اشتراک منفرد.
 */
type Subscription = {
  /** شناسه اشتراک */
  id: string;
  /** نام کاربری */
  username: string;
  /** برچسب نمایشی */
  label: string;
};

/**
 * گروه اشتراک‌ها.
 */
type SubscriptionGroup = {
  /** شناسه گروه */
  id: string;
  /** برچسب گروه */
  label: string;
  /** لیست اشتراک‌های گروه */
  subscriptions: Subscription[];
};

export function SubscriptionSelector({
  groups,
  selectedId,
  onSelect,
  onRegisterNew,
}: {
  groups: SubscriptionGroup[];
  selectedId?: string;
  onSelect?: (subscription: Subscription) => void;
  onRegisterNew?: () => void;
}) {
  const router = useRouter();

  const handleSelect = (sub: Subscription) => {
    if (onSelect) {
      onSelect(sub);
    } else {
      router.push(`/subscription/${sub.id}/dashboard`);
    }
  };

  const handleRegisterNew = () => {
    if (onRegisterNew) {
      onRegisterNew();
    } else {
      router.push("/subscription/register");
    }
  };

  const hasGroups = groups.length > 0;

  return (
    <section className="bg-white rounded-3xl shadow-[0px_4px_12px_0px_rgba(175,186,205,0.37)] p-4 space-y-2">
      {hasGroups ? (
        <div className="space-y-3">
          {groups.map((group) => (
            <SubscriptionGroup
              key={group.id}
              group={group}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          ))}
        </div>
      ) : (
        <p className="text-[#52759F] text-[12px] font-light text-center py-4">
          هیچ اشتراکی یافت نشد
        </p>
      )}

      <button
        type="button"
        onClick={handleRegisterNew}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 text-[#0C6FFF] text-[13px] font-medium rounded-[18px] border border-dashed border-[#0C6FFF]/30 hover:bg-[#F3F6FE] transition-colors"
      >
        <Plus strokeWidth={1.5} size={18} />
        اشتراک جدید
      </button>
    </section>
  );
}

function SubscriptionGroup({
  group,
  selectedId,
  onSelect,
}: {
  group: SubscriptionGroup;
  selectedId?: string;
  onSelect: (subscription: Subscription) => void;
}) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-[#081D5D] text-[13px] font-bold text-right">
        {group.label}
      </h3>
      <div className="space-y-1">
        {group.subscriptions.map((sub) => (
          <SubscriptionItem
            key={sub.id}
            subscription={sub}
            selected={sub.id === selectedId}
            onClick={() => onSelect(sub)}
          />
        ))}
      </div>
    </div>
  );
}

function SubscriptionItem({
  subscription,
  selected,
  onClick,
}: {
  subscription: Subscription;
  selected?: boolean;
  onClick: () => void;
}) {
  const isSelected = selected;

  return (
    <button
      type="button"
      onClick={onClick}
      className={
        isSelected
          ? "w-full flex items-center justify-between p-3 rounded-[18px] bg-[#0C6FFF]/10 border border-[#0C6FFF] text-right transition-colors"
          : "w-full flex items-center justify-between p-3 rounded-[18px] bg-[#F3F6FE] hover:bg-[#F3F6FE]/70 text-right transition-colors"
      }
    >
      <div className="flex flex-col items-end text-right">
        <span
          className={
            isSelected
              ? "text-[#0C6FFF] text-[13px] font-medium"
              : "text-[#081D5D] text-[13px] font-medium"
          }
        >
          {subscription.username}
        </span>
        <span
          className={
            isSelected
              ? "text-[#0C6FFF] text-[11px] font-light"
              : "text-[#52759F] text-[11px] font-light"
          }
        >
          {subscription.label}
        </span>
      </div>
      <ChevronLeft
        strokeWidth={1}
        size={20}
        className={isSelected ? "text-[#0C6FFF]" : "text-[#52759F]"}
      />
    </button>
  );
}
