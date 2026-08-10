"use client";

import Image from "next/image";

export function Banner() {
  return (
    <div className="relative w-full h-[155px] rounded-[24px] overflow-hidden">
      <Image
        src="/images/banner-image-125d50.png"
        alt="Banner"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
