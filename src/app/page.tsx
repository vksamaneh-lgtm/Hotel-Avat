import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ArchitecturePhilosophy } from "@/components/ArchitecturePhilosophy";
import { RoomsSection } from "@/components/RoomsSection";
import { GallerySection } from "@/components/GallerySection";
import { ReelsSection } from "@/components/ReelsSection";
import { AmenitiesSection } from "@/components/AmenitiesSection";
import { LocationSection } from "@/components/LocationSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#172554] font-sans antialiased selection:bg-[#e7f6fc] selection:text-[#0494D6]">
      {/* Navigation Header */}
      <Navbar />


      <main className="flex-1">
        {/* Cinematic Hero */}
        <Hero />

        {/* Dynamic Instagram Reels Showcase */}
        <ReelsSection />

        {/* Architecture & Heritage Philosophy (Samara Style) */}
        <ArchitecturePhilosophy />

        {/* Rooms & Suites Showcase */}
        <RoomsSection />

        {/* Photo-Centric Categorized Gallery */}
        <GallerySection />

        {/* Hotel Amenities */}
        <AmenitiesSection />

        {/* Location & Interactive Map */}
        <LocationSection />

        {/* Direct Contact & Inquiry */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating CTA for Quick Call & WhatsApp */}
      <FloatingCTA />
    </div>
  );
}
