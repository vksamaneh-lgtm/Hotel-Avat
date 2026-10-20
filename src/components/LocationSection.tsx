"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Navigation,
  ExternalLink,
  ArrowUpRight,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { ATTRACTIONS_DATA } from "./HotelMap";
import { hotelConfig } from "@/config/hotel.config";

// Dynamic import of Leaflet map to prevent SSR issues
const HotelMap = dynamic(() => import("./HotelMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] bg-[#f0ece1]/50 rounded-[28px] flex items-center justify-center text-[#555f6d] text-sm font-medium animate-pulse">
      در حال بارگذاری نقشه تعاملی {hotelConfig.location.cityFa}...
    </div>
  ),
});

export function LocationSection() {
  const { language } = useLanguage();
  const t = translations[language];
  const isEn = language === "en";

  const [activeAttractionIndex, setActiveAttractionIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <section id="location" className="py-14 md:py-28 bg-[#faf8f5] border-t border-[#e8e4db] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div className={`max-w-2xl ${isEn ? "text-left" : "text-right"}`}>
            <h2 className="text-[30px] sm:text-[40px] lg:text-[44px] font-bold leading-tight text-[#0494D6] tracking-tight mb-3">
              {t.location.heading}
            </h2>
            <p className="text-sm sm:text-base text-[#555f6d] leading-relaxed font-light">
              {t.location.desc}
            </p>
          </div>

          {/* Direct Navigation Links */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`https://maps.google.com/?q=${hotelConfig.location.coordinates[0]},${hotelConfig.location.coordinates[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#dfd9cc] bg-white hover:bg-[#faf8f5] text-xs font-semibold text-[#0494D6] shadow-2xs transition-all hover:scale-105"
            >
              <Navigation className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>{t.location.googleMaps}</span>
            </a>
            <a
              href={`https://neshan.org/maps/@${hotelConfig.location.coordinates[0]},${hotelConfig.location.coordinates[1]},${hotelConfig.location.mapZoom}z`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#dfd9cc] bg-white hover:bg-[#faf8f5] text-xs font-semibold text-[#0494D6] shadow-2xs transition-all hover:scale-105"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#8c7b64]" />
              <span>{t.location.neshan}</span>
            </a>
            <a
              href={`https://balad.ir/location?latitude=${hotelConfig.location.coordinates[0]}&longitude=${hotelConfig.location.coordinates[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#dfd9cc] bg-white hover:bg-[#faf8f5] text-xs font-semibold text-[#0494D6] shadow-2xs transition-all hover:scale-105"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#8c7b64]" />
              <span>{t.location.balad}</span>
            </a>
          </div>
        </div>

        {/* Main Full Map Container with Expandable Floating Landmark Selector */}
        <div className="relative w-full h-[540px] sm:h-[620px] lg:h-[680px] rounded-[28px] sm:rounded-[32px] overflow-hidden border border-[#dfd9cc] shadow-xl bg-white">
          {/* Interactive Leaflet Map */}
          <div className="absolute inset-0 w-full h-full">
            <HotelMap
              activeAttractionIndex={activeAttractionIndex}
              onSelectAttraction={(idx) => setActiveAttractionIndex(idx)}
            />
          </div>

          {/* Desktop Floating Landmark Panel - Collapsed State */}
          {!isExpanded && (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className={`hidden lg:flex absolute top-5 z-[400] items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-[#dfd9cc] text-[#0494D6] shadow-xl hover:scale-105 transition-all cursor-pointer font-bold text-xs animate-in fade-in duration-200 ${
                isEn ? "left-5" : "right-5"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#c59b27] animate-ping" />
              <span>{t.location.attractionsHeading}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#faf8f5] border border-[#dfd9cc] text-[#8c7b64]">
                {t.location.landmarksCount}
              </span>
              <ChevronDown className="w-4 h-4 text-[#8c7b64]" />
            </button>
          )}

          {/* Desktop Floating Landmark Panel - Expanded State */}
          {isExpanded && (
            <div
              className={`hidden lg:flex absolute top-5 bottom-5 ${
                isEn ? "left-5" : "right-5"
              } w-[380px] xl:w-[410px] z-[400] flex-col justify-between bg-white/95 backdrop-blur-md rounded-[24px] border border-[#dfd9cc]/90 shadow-2xl p-5 overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95`}
            >
              {/* Panel Header */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#dfd9cc]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#c59b27] animate-ping" />
                    <span className="text-xs font-bold text-[#0494D6]">
                      {t.location.attractionsHeading}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeAttractionIndex !== null && (
                      <button
                        onClick={() => setActiveAttractionIndex(null)}
                        className="inline-flex items-center gap-1 text-[11px] text-[#8c7b64] hover:text-[#0494D6] font-medium transition-colors cursor-pointer"
                        title={t.location.resetView}
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{t.location.resetView}</span>
                      </button>
                    )}

                    {/* Collapse Button */}
                    <button
                      type="button"
                      onClick={() => setIsExpanded(false)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8c7b64] hover:text-[#0494D6] px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title={t.location.collapseBtn}
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span>{t.location.collapseBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Helper Hint */}
                <p className="text-[11px] text-[#8c7b64] pt-2 pb-1 font-light leading-relaxed">
                  {t.location.traceHint}
                </p>
              </div>

              {/* Attractions List with Diagonal Connect Trigger */}
              <div className="flex flex-col gap-2.5 my-2 overflow-y-auto pr-1 pl-1">
                {ATTRACTIONS_DATA.map((att, idx) => {
                  const isActive = activeAttractionIndex === idx;
                  const name = isEn ? att.nameEn : att.nameFa;
                  const dist = isEn ? att.distEn : att.distFa;
                  const time = isEn ? att.timeEn : att.timeFa;

                  return (
                    <button
                      key={att.id}
                      onClick={() =>
                        setActiveAttractionIndex(isActive ? null : idx)
                      }
                      className={`group w-full text-right p-3 rounded-[16px] border transition-all duration-200 cursor-pointer flex items-center justify-between gap-2.5 ${
                        isActive
                          ? "bg-[#0494D6] border-[#0494D6] text-white shadow-md scale-[1.02]"
                          : "bg-white/80 hover:bg-[#faf8f5] border-[#dfd9cc] text-[#0494D6] hover:border-[#c59b27]/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl flex-shrink-0">{att.icon}</span>
                        <div className={`min-w-0 ${isEn ? "text-left" : "text-right"}`}>
                          <span
                            className={`block text-xs sm:text-[13px] font-bold truncate ${
                              isActive ? "text-white" : "text-[#0494D6]"
                            }`}
                          >
                            {name}
                          </span>
                          <span
                            className={`block text-[10px] truncate ${
                              isActive ? "text-white/80" : "text-[#8c7b64]"
                            }`}
                          >
                            {time}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                            isActive
                              ? "bg-[#c59b27] text-white"
                              : "bg-[#faf8f5] text-[#0494D6] border border-[#dfd9cc]"
                          }`}
                        >
                          {dist}
                        </span>
                        <ArrowUpRight
                          className={`w-4 h-4 transition-transform ${
                            isActive
                              ? "text-[#c59b27] translate-x-0.5 -translate-y-0.5 scale-110"
                              : "text-[#8c7b64]/50 group-hover:text-[#0494D6]"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Mansion Address Footer */}
              <div className="pt-3 border-t border-[#dfd9cc] bg-white/40 rounded-xl p-2.5">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#c59b27] flex-shrink-0 mt-0.5" />
                  <div className={`text-[11px] ${isEn ? "text-left" : "text-right"}`}>
                    <strong className="block font-bold text-[#0494D6] mb-0.5">
                      {t.location.addressLabel}
                    </strong>
                    <p className="text-[#555f6d] leading-normal font-light line-clamp-2">
                      {t.location.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile / Tablet Accordion (< lg) */}
        <div className="lg:hidden mt-5 flex flex-col gap-3">
          {/* Accordion Header Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-3.5 sm:p-4 rounded-2xl bg-white border border-[#dfd9cc] shadow-2xs flex items-center justify-between transition-all cursor-pointer active:scale-[0.99]"
            aria-expanded={isExpanded}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c59b27]" />
              <span className="text-xs sm:text-sm font-bold text-[#0494D6]">
                {t.location.attractionsHeading}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#faf8f5] border border-[#dfd9cc] text-[#8c7b64]">
                {t.location.landmarksCount}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#8c7b64] font-medium">
              <span>{isExpanded ? t.location.collapseBtn : t.location.expandBtn}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {/* Accordion Content */}
          {isExpanded && (
            <div className="flex flex-col gap-3 animate-in fade-in duration-200">
              <p className="text-[11px] text-[#8c7b64] px-1">
                {t.location.traceHint}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ATTRACTIONS_DATA.map((att, idx) => {
                  const isActive = activeAttractionIndex === idx;
                  const name = isEn ? att.nameEn : att.nameFa;
                  const dist = isEn ? att.distEn : att.distFa;
                  const time = isEn ? att.timeEn : att.timeFa;

                  return (
                    <button
                      key={att.id}
                      onClick={() =>
                        setActiveAttractionIndex(isActive ? null : idx)
                      }
                      className={`p-3 rounded-[16px] border transition-all text-right flex items-center justify-between gap-2 cursor-pointer ${
                        isActive
                          ? "bg-[#0494D6] border-[#0494D6] text-white shadow-md"
                          : "bg-white border-[#dfd9cc] text-[#0494D6]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-lg">{att.icon}</span>
                        <div className="min-w-0">
                          <span className="block text-xs font-bold truncate">
                            {name}
                          </span>
                          <span
                            className={`block text-[10px] truncate ${
                              isActive ? "text-white/80" : "text-[#8c7b64]"
                            }`}
                          >
                            {time}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                          isActive
                            ? "bg-[#c59b27] text-white"
                            : "bg-[#faf8f5] text-[#0494D6] border border-[#dfd9cc]"
                        }`}
                      >
                        {dist}
                      </span>
                    </button>
                  );
                })}
              </div>

              {activeAttractionIndex !== null && (
                <button
                  onClick={() => setActiveAttractionIndex(null)}
                  className="mt-1 py-2 rounded-full border border-[#dfd9cc] bg-white text-xs font-semibold text-[#0494D6] flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#8c7b64]" />
                  <span>{t.location.resetView}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
