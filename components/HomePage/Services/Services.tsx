"use client";

import Image from "next/image";

export function Services() {
  return (
    <section className="bg-white rounded-[24px] shadow-[0px_4px_12px_0px_rgba(175,186,205,0.37)] p-4 space-y-2">
      <h2 className="text-blue-900 text-[14px] font-bold flex-1 text-right ">
        خدمات شرکت بایت
      </h2>

      {/* Row 1 */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-[#F3F6FE] rounded-[18px] w-full py-1.5 flex flex-col items-center justify-center justify-self-center">
          <Image
            src="/images/router-icon.png"
            alt="Router"
            width={42}
            height={42}
          />
          <p className="text-[#011961] text-[13px] font-bold">ADSL2+</p>
        </div>

        <div className="bg-[#F3F6FE] rounded-[18px] w-full py-1.5 flex flex-col items-center justify-center justify-self-center">
          <Image
            src="/images/radio-tower-icon.png"
            alt="Radio Tower"
            width={42}
            height={42}
          />
          <p className="text-[#081D5D] text-[13px] font-bold  text-center">
            وایرلس
          </p>
        </div>

        <div className="bg-[#F3F6FE] rounded-[18px] w-full py-1.5 flex flex-col items-center justify-center justify-self-center">
          <Image
            src="/images/wifi-icon.png"
            alt="WiFi"
            width={42}
            height={42}
          />
          <p className="text-[#081D5D] text-[13px] font-bold">هات اسپات</p>
        </div>

        <div className="bg-[#F3F6FE] rounded-[18px] w-full py-1.5 flex flex-col items-center justify-center justify-self-center">
          <Image
            src="/images/network-icon.png"
            alt="Network"
            width={42}
            height={42}
          />
          <p className="text-[#081D5D] text-[13px] font-bold">شبکه</p>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-[#F3F6FE] rounded-[18px] w-full py-1.5 flex flex-col items-center justify-center justify-self-center">
          <Image
            src="/images/camera-icon.png"
            alt="Router"
            width={42}
            height={42}
          />
          <p className="text-[#011961] text-[13px] font-bold">دوربین</p>
        </div>

        <div className="bg-[#F3F6FE] rounded-[18px] w-full py-1.5 flex flex-col items-center justify-center justify-self-center">
          <Image
            src="/images/building-icon.png"
            alt="Radio Tower"
            width={42}
            height={42}
          />
          <p className="text-[#081D5D] text-[13px] font-bold  text-center">
            مجتمع
          </p>
        </div>

        <div className="bg-[#F3F6FE] rounded-[18px] w-full py-1.5 flex flex-col items-center justify-center justify-self-center">
          <Image
            src="/images/signal-icon.png"
            alt="WiFi"
            width={42}
            height={42}
          />
          <p className="text-[#081D5D] text-[13px] font-bold">LTE</p>
        </div>

        <div className="bg-[#F3F6FE] rounded-[18px] w-full py-1.5 flex flex-col items-center justify-center justify-self-center">
          <Image
            src="/images/network-icon.png"
            alt="Network"
            width={42}
            height={42}
          />
          <p className="text-[#081D5D] text-[13px] font-bold">شبکه</p>
        </div>
      </div>

      {/* Row 3 (duplicate of Row 1) */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-[#F3F6FE] rounded-[18px] w-full py-1.5 flex flex-col items-center justify-center justify-self-center">
          <Image
            src="/images/router-icon.png"
            alt="Router"
            width={42}
            height={42}
          />
          <p className="text-[#011961] text-[13px] font-bold">ADSL2+</p>
        </div>

        <div className="bg-[#F3F6FE] rounded-[18px] w-full py-1.5 flex flex-col items-center justify-center justify-self-center">
          <Image
            src="/images/radio-tower-icon.png"
            alt="Radio Tower"
            width={42}
            height={42}
          />
          <p className="text-[#081D5D] text-[13px] font-bold  text-center">
            وایرلس
          </p>
        </div>

        <div className="bg-[#F3F6FE] rounded-[18px] w-full py-1.5 flex flex-col items-center justify-center justify-self-center">
          <Image
            src="/images/wifi-icon.png"
            alt="WiFi"
            width={42}
            height={42}
          />
          <p className="text-[#081D5D] text-[13px] font-bold">هات اسپات</p>
        </div>

        <div className="bg-[#F3F6FE] rounded-[18px] w-full py-1.5 flex flex-col items-center justify-center justify-self-center">
          <Image
            src="/images/network-icon.png"
            alt="Network"
            width={42}
            height={42}
          />
          <p className="text-[#081D5D] text-[13px] font-bold">شبکه</p>
        </div>
      </div>
    </section>
  );
}
