"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "./BookingDialog";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { hotelConfig } from "@/config/hotel.config";

export function Hero() {
  const { language } = useLanguage();
  const t = translations[language];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % t.hero.images.length);
    }, 6500);

    return () => clearInterval(interval);
  }, [t.hero.images.length]);

  return (
    <section
      id="home"
      className="relative w-full h-[100svh] min-h-[560px] flex flex-col justify-between items-center overflow-hidden bg-[#0a1120]"
    >
      {/* Cinematic Crossfading Background Images */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {t.hero.images.map((img, idx) => {
          const isActive = currentIndex === idx;
          return (
            <div
              key={img.src}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1500 ease-in-out ${
                isActive ? "opacity-100 z-1" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority={idx === 0}
                sizes="100vw"
                className={`object-cover object-center transition-transform duration-[7000ms] ease-out ${
                  isActive ? "scale-[1.03]" : "scale-100"
                }`}
              />
            </div>
          );
        })}

        {/* Whisper-Thin Cinematic Scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/65 z-2" />
      </div>

      {/* Top Spacer */}
      <div className="relative z-10 w-full pt-28" />

      {/* Hero Center - Pure, Weightless & Ultra-Minimal */}
      <div className="relative z-10 max-w-2xl mx-auto w-full px-6 text-center flex flex-col items-center">
        {/* The Essence: Hotel Name */}
        <h1 className="text-[40px] sm:text-[64px] lg:text-[84px] font-bold leading-tight text-white tracking-[-1.5px] drop-shadow-md">
          {t.hero.title}
        </h1>

        {/* Delicate Sub-label */}
        <span className="text-xs sm:text-sm font-light tracking-[0.25em] text-white/85 uppercase mt-3 mb-8 drop-shadow">
          {t.hero.subtitle}
        </span>

        {/* Minimal Quiet Action */}
        <BookingDialog
          trigger={
            <Button className="h-11 px-8 rounded-full bg-white/95 hover:bg-white text-[#0494D6] text-sm font-semibold shadow-xl backdrop-blur-md transition-all hover:scale-105 cursor-pointer">
              {t.hero.reserveBtn}
            </Button>
          }
        />

        {/* Snapp Pay 4-Installment Hero Badge */}
        {hotelConfig.features.snappPay.enabled && (
          <div className="mt-4 sm:mt-5 max-w-[94vw] inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-[#0085FF]/50 text-white shadow-xl transition-all">
            <div className="w-8 sm:w-10 h-4 sm:h-5 relative flex-shrink-0">
              <Image src="/images/snapp-pay.png" alt="اسنپ پی" fill className="object-contain" />
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-white/95 truncate sm:whitespace-normal">
              {t.hero.snappPayHeroBadge}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0085FF] text-white whitespace-nowrap flex-shrink-0">
              {language === "fa" ? hotelConfig.features.snappPay.badgeFa : hotelConfig.features.snappPay.badgeEn}
            </span>
          </div>
        )}
      </div>

      {/* Slide Progress Indicators */}
      <div
        aria-label="Slide Indicator"
        className={`absolute bottom-6 sm:bottom-8 z-20 flex items-center gap-2 ${
          language === "fa" ? "right-6 sm:right-8" : "left-6 sm:left-8"
        }`}
      >
        {t.hero.images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
              currentIndex === idx
                ? "w-7 bg-white shadow-sm"
                : "w-2 bg-white/35 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Subtle Scroll Hint */}
      <div className="relative z-10 pb-6">
        <a
          href="#reels"
          aria-label={t.hero.scrollHint}
          className="text-white/60 hover:text-white transition-colors block p-2"
        >
          <ChevronDown className="w-5 h-5 animate-pulse" />
        </a>
      </div>
    </section>
  );
}

