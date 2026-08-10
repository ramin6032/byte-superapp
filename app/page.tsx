import { Alerts } from "@/components/HomePage/Alerts/Alerts";
import { Banner } from "@/components/HomePage/Banner/Banner";
import { Header } from "@/components/HomePage/Header/Header";
import { Mokhaberat } from "@/components/HomePage/Mokhaberat/Mokhaberat";
import { Navbar } from "@/components/HomePage/Navbar/Navbar";
import { Services } from "@/components/HomePage/Services/Services";

export default function Home() {
  return (
    <div className="min-h-dvh h-dvh bg-[#F3F7FE] font-vazirmatn rtl ">
      <div className="w-full max-w-xl h-full flex flex-col justify-between mx-auto">
        {/* Header */}
        <Header />

        {/* Main Container */}
        <main className="w-full flex-1 mx-auto  p-2 space-y-4 overflow-y-auto overflow-x-hidden">
          {/* Banner */}
          <Banner />

          {/* Alerts Section */}
          <Alerts />

          {/* Mokhaberat Section */}
          <Mokhaberat />

          {/* Services Section */}
          <Services />
        </main>

        {/* Bottom Navigation */}
        <Navbar />
      </div>
    </div>
  );
}
