"use client";

import { ChevronLeft, Info, X, TriangleAlert } from "lucide-react";

export function Alerts() {
  return (
    <section className="bg-white rounded-[24px] shadow-[0px_4px_12px_0px_rgba(175,186,205,0.37)] p-2">
      <div className="flex items-center justify-between py-2 text-black/60">
        <h2 className="text-blue-900 text-[14px] font-bold flex-1 text-right pr-4">
          هشدارها (3)
        </h2>
        <span className=" text-[10px] font-normal">مشاهده همه</span>
        <ChevronLeft strokeWidth={1} size={18} />
      </div>

      {/* Alert Cards */}
      <div className=" rounded-[16px] space-y-2 ">
        {/* Alert 1 */}
        <div className="bg-[#F3F7FE] rounded-[16px] p-2 flex items-center gap-2.5">
          <div className="flex items-center gap-2 w-full">
            <TriangleAlert
              strokeWidth={1}
              size={28}
              className="text-amber-500"
            />
            <div className="flex-1 flex flex-col gap-1">
              <p className="text-blue-900 text-[13px] font-medium">
                ترافیک مصرفی شما به 80% رسید
              </p>
              <p className="text-[#52759F] text-[12px] font-light">
                برای جلوگیری از کاهش سرعت بسته افزایش حجم تهیه کنید.
              </p>
            </div>
          </div>
          <X strokeWidth={1} size={20} className="text-black/60" />
        </div>

        {/* Alert 2 */}
        {/* <div className="bg-[#F3F7FE] rounded-[16px] p-2 flex items-center gap-2.5">
          <div className="flex items-center gap-2 w-full">
            <Info strokeWidth={1} size={28} className="text-blue-500" />
            <div className="flex-1 flex flex-col gap-1">
              <p className="text-blue-900 text-[13px] font-medium">
                تعمیرات در منطقه شما
              </p>
              <p className="text-[#52759F] text-[12px] font-light">
                از ساعت 18:00 الی 20:00
              </p>
            </div>
          </div>
          <X strokeWidth={1} size={20} className="text-black/60" />
        </div> */}
      </div>
    </section>
  );
}
