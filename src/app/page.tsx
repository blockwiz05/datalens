import Image from "next/image";
import Hero from "@/components/Hero";
import Navbar from "@/components/ui/Navbar";
import DaoSection from "@/components/ssv-token/DaoSection";
import SsvAnalysis from "@/components/SsvAnalysis";

export default function Home() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Navbar />
      <Hero />
      <DaoSection />
      <SsvAnalysis />
     
    </div>
  );
}