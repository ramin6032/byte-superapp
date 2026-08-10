"use client";

import { ChevronLeft, Info, X, TriangleAlert } from "lucide-react";
import { useState } from "react";

export function Alerts() {
  const [isClose, setIsClose] = useState(false);

  if (isClose) return;

  return (
    <section>
      {/* Alert Cards */}
      <div className=" rounded-[16px] space-y-2 ">
        {/* Alert 1 */}
        <div className="bg-white rounded-[16px] p-2 flex items-center gap-2.5 border border-blue-950/20">
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
          <X
            strokeWidth={1}
            size={20}
            className="text-black/60"
            onClick={() => setIsClose(true)}
          />
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
