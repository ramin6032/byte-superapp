/**
 * کتابخانه آیکون‌های سفارشی برنامه.
 *
 * آیکون‌ها به‌صورت SVG درون‌خطی و بدون وابستگی بیرونی تعریف می‌شوند تا در صورت نیاز
 * بتوان ظاهر آن‌ها را متناسب با تم برنامه تغییر داد.
 */

/**
 * آیکون هشدار مثلثی.
 *
 * برای نمایش وضعیت‌های هشدار یا پیام‌های تذکر استفاده می‌شود و رنگ آن از رنگ متن جاری
 * (currentColor) ارث می‌برد.
 *
 * @returns عنصر SVG آیکون مثلث هشدار با اندازه پیش‌فرض ۲۴
 */
export function TriangleAlert() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-triangle-alert-icon lucide-triangle-alert"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
