import { Alerts } from "@/components/HomePage/Alerts/Alerts";
import { Banner } from "@/components/HomePage/Banner/Banner";
import { Header } from "@/components/HomePage/Header/Header";
import { Mokhaberat } from "@/components/HomePage/Mokhaberat/Mokhaberat";
import { Navbar } from "@/components/HomePage/Navbar/Navbar";
import { Services } from "@/components/HomePage/Services/Services";
import {
  ArrowLeft,
  Bell,
  ChessQueen,
  ChevronLeft,
  HomeIcon,
  Info,
  Menu,
  TriangleAlert,
  User,
  Wallet,
  X,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-dvh h-dvh bg-[#F3F7FE] font-vazirmatn rtl ">
      <div className="w-full max-w-3xl h-full flex flex-col justify-between mx-auto">
        {/* Header */}
        <Header />

        {/* Main Container */}
        <main className="w-full flex-1 max-w-[805px] mx-auto  p-2 space-y-4 overflow-y-auto overflow-x-hidden">
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
