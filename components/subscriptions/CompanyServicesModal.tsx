"use client";

/**
 * مودال انتخاب سرویس‌های کمپانی برای ثبت اشتراک جدید.
 *
 * لیست سرویس‌های قابل ثبت‌نام را به‌صورت مودال نمایش می‌دهد و
 * با کلیک روی هر سرویس، کاربر به صفحه ثبت‌نام مربوطه منتقل می‌شود.
 *
 * @param open - حالت باز/بسته مودال
 * @param onClose - کال‌بک بستن مودال
 * @param onServiceSelect - کال‌بک انتخاب سرویس (پیش‌فرض: router.push به route)
 * @returns المان مودال سرویس‌های کمپانی
 */
import { ChevronRight } from "lucide-react";
import { Modal, Space, Typography } from "antd";
import { companyServices, type CompanyService } from "./companyServices";

/**
 * پراپ‌های مودال سرویس‌های کمپانی.
 */
type CompanyServicesModalProps = {
  /** حالت باز/بسته مودال */
  open: boolean;
  /** کال‌بک بستن مودال */
  onClose: () => void;
  /** کال‌بک انتخاب سرویس (اختیاری) */
  onServiceSelect?: (service: CompanyService) => void;
};

/**
 * رندر مودال انتخاب سرویس‌های کمپانی.
 *
 * @returns المان مودال شامل لیست سرویس‌های قابل ثبت‌نام
 */
export function CompanyServicesModal({
  open,
  onClose,
  onServiceSelect,
}: CompanyServicesModalProps) {
  const handleSelect = (service: CompanyService) => {
    if (onServiceSelect) {
      onServiceSelect(service);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="سرویس مورد نظر را انتخاب کنید"
      footer={null}
      width={360}
      destroyOnHidden
      styles={{
        body: {
          maxHeight: "70vh",
          overflowY: "auto",
          padding: "12px 0",
        },
        header: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          borderBottom: "1px solid #f0f0f0",
        },
        title: {
          fontSize: 14,
          fontWeight: 600,
          color: "#081D5D",
        },
      }}
    >
      <Space orientation="vertical" size={12} className="w-full">
        {companyServices.map((service) => (
          <ServiceOption
            key={service.id}
            service={service}
            onClick={() => handleSelect(service)}
          />
        ))}
      </Space>
    </Modal>
  );
}

/**
 * گزینه یک سرویس در مودال.
 *
 * @param props - پراپ‌ها
 * @returns المان گزینه سرویس
 */
function ServiceOption({
  service,
  onClick,
}: {
  service: CompanyService;
  onClick: () => void;
}) {
  const Icon = service.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 rounded-[14px] bg-white border border-[#E8EEF8] hover:border-[#0C6FFF] hover:bg-[#F3F6FE] transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-[12px] flex items-center justify-center"
          style={{ backgroundColor: service.color + "18" }}
        >
          <Icon strokeWidth={1.5} size={22} style={{ color: service.color }} />
        </div>
        <div className="flex flex-col items-start">
          <Typography.Text className="!text-[13px] !font-medium !text-[#081D5D]">
            {service.title}
          </Typography.Text>
          <Typography.Text className="!text-[11px] !font-light !text-[#52759F]">
            {service.subtitle}
          </Typography.Text>
        </div>
      </div>
      <ChevronRight
        strokeWidth={1.5}
        size={16}
        className="text-[#52759F] opacity-40 rotate-180"
      />
    </button>
  );
}
