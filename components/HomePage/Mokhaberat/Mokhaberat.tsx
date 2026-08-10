"use client";

export function Mokhaberat() {
  return (
    <section className="bg-white rounded-[24px] shadow-[0px_4px_12px_0px_rgba(175,186,205,0.37)] p-4 space-y-2">
      <h2 className="text-blue-900 text-[14px] font-bold flex-1 text-right ">
        اینترنت مخابرات
      </h2>

      <div className="grid grid-cols-3 gap-x-2 gap-y-2 text-[13px] font-medium">
        {/* Service Card 1 */}
        <div className="bg-[#F3F6FE] border border-[#0C6FFF] rounded-[18px] p-3 flex flex-col items-center justify-center ">
          <p className="text-[#0C6FFF]  text-center leading-5">
            اینترنت پرسرعت ADSL
          </p>
        </div>

        {/* Service Card 2 */}
        <div className="bg-[#F3F6FE] border border-[#0C6FFF] rounded-[18px]  flex flex-col items-center justify-center  ">
          <p className="text-[#0C6FFF]  text-center leading-5">
            اینترنت پرسرعت VDSL
          </p>
        </div>

        {/* Service Card 3 */}
        <div className="bg-[#F3F6FE] border border-[#0C6FFF] rounded-[18px]  flex flex-col items-center justify-center ">
          <p className="text-[#0C6FFF]  text-center leading-5 ">
            اینترنت فیبر نوری FTTH
          </p>
        </div>
      </div>
    </section>
  );
}
