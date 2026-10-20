"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export function GallerySection() {
  const { language } = useLanguage();
  const t = translations[language];
  const isEn = language === "en";

  const [filter, setFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [mobileCurrentIndex, setMobileCurrentIndex] = useState<number>(0);
  const activeThumbRef = useRef<HTMLButtonElement | null>(null);
  const mobileCarouselRef = useRef<HTMLDivElement | null>(null);

  const filteredItems = useMemo(() => {
    return filter === "all"
      ? t.gallery.items
      : t.gallery.items.filter((item) => item.category === filter);
  }, [filter, t.gallery.items]);

  const gridContainerClass = useMemo(() => {
    if (filteredItems.length === 1) {
      return "grid-cols-1 max-w-2xl mx-auto";
    }
    if (filteredItems.length === 2) {
      return "grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto";
    }
    if (filteredItems.length === 4) {
      return "grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto";
    }
    return "grid-cols-2 lg:grid-cols-3";
  }, [filteredItems.length]);

  const scrollMobileCarousel = (direction: "left" | "right") => {
    if (!mobileCarouselRef.current) return;
    const container = mobileCarouselRef.current;
    const scrollAmount = container.clientWidth * 0.85;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleCarouselScroll = () => {
    if (!mobileCarouselRef.current) return;
    const container = mobileCarouselRef.current;
    const slideWidth = container.clientWidth * 0.85;
    if (slideWidth <= 0) return;
    const index = Math.round(Math.abs(container.scrollLeft) / slideWidth);
    setMobileCurrentIndex(Math.max(0, Math.min(filteredItems.length - 1, index)));
  };

  useEffect(() => {
    if (mobileCarouselRef.current) {
      mobileCarouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
      setMobileCurrentIndex(0);
    }
  }, [filter]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

  const showPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

  // Lock body scroll when gallery is active
  useEffect(() => {
    if (lightboxIndex !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [lightboxIndex]);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (lightboxIndex !== null && activeThumbRef.current) {
      activeThumbRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [lightboxIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        showPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        showNext();
      } else if (e.key === "Escape") {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, showNext, showPrev]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped left
        if (isEn) showNext();
        else showNext();
      } else {
        // Swiped right
        if (isEn) showPrev();
        else showPrev();
      }
    }
    setTouchStart(null);
  };

  // Count items per category
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return t.gallery.items.length;
    return t.gallery.items.filter((i) => i.category === categoryId).length;
  };

  // Convert digits to Persian format if language is FA
  const formatNumber = (num: number) => {
    if (language === "fa") {
      const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
      return String(num).replace(/\d/g, (d) => persianDigits[Number(d)]);
    }
    return String(num);
  };

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-[#faf8f5] border-t border-[#e8e4db] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header - Dignified & Restrained */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-14 ${isEn ? "text-left" : "text-right"}`}>
          <div className="max-w-2xl">
            <h2 className="text-[30px] sm:text-[42px] font-bold text-[#0494D6] tracking-tight leading-tight mb-3">
              {t.gallery.heading}
            </h2>
            <p className="text-sm sm:text-base text-[#555f6d] leading-relaxed font-light">
              {t.gallery.desc}
            </p>
          </div>

          {/* Minimalist Segmented Filter Bar */}
          <div
            role="tablist"
            aria-label="Gallery Categories"
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none [scrollbar-width:none] flex-shrink-0"
          >
            {t.gallery.categories.map((tab) => {
              const isActive = filter === tab.id;
              const count = getCategoryCount(tab.id);
              return (
                <button
                  key={tab.id}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls="gallery-grid"
                  onClick={() => setFilter(tab.id)}
                  className={`h-9 px-3.5 sm:px-4 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#0494D6] ${
                    isActive
                      ? "bg-[#0494D6] text-white shadow-xs"
                      : "bg-white/80 hover:bg-white text-[#555f6d] hover:text-[#0494D6] border border-[#dfd9cc]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold tabular-nums ${
                      isActive ? "bg-white/20 text-white" : "bg-[#faf8f5] text-[#8c7b64]"
                    }`}
                  >
                    {formatNumber(count)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Gallery Carousel (< sm) */}
        <div className="block sm:hidden">
          <div
            ref={mobileCarouselRef}
            onScroll={handleCarouselScroll}
            style={{ touchAction: "pan-y" }}
            className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 px-1 scrollbar-none [scrollbar-width:none] [-webkit-overflow-scrolling:touch]"
          >
            {filteredItems.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openLightbox(idx)}
                className="group relative w-[86vw] max-w-[340px] aspect-[4/3] rounded-[22px] overflow-hidden snap-center flex-shrink-0 border border-[#dfd9cc] bg-[#f0ece1]/50 shadow-md text-right focus:outline-none"
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="86vw"
                  className="object-cover"
                />

                {/* Mobile Scrim with Permanent Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-4 text-white z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-white/90 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
                      {item.categoryName}
                    </span>
                  </div>
                  <p className="text-sm font-semibold leading-snug text-white drop-shadow-sm line-clamp-1">
                    {item.title}
                  </p>
                </div>

                <div
                  className={`absolute top-3 ${
                    isEn ? "right-3" : "left-3"
                  } w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/25 flex items-center justify-center text-white z-20`}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>

          {/* Mobile Carousel Controls & Progress */}
          <div className="mt-3 flex items-center justify-between px-2">
            <div className="text-xs text-[#8c7b64] font-semibold tabular-nums flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-[#dfd9cc] shadow-2xs">
              <span>{formatNumber(mobileCurrentIndex + 1)}</span>
              <span className="text-[#8c7b64]/40">/</span>
              <span>{formatNumber(filteredItems.length)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollMobileCarousel("left")}
                className="w-9 h-9 rounded-full bg-white border border-[#dfd9cc] text-[#0494D6] flex items-center justify-center shadow-2xs hover:bg-[#faf8f5] active:scale-95 transition-all cursor-pointer"
                aria-label={isEn ? "Previous image" : "تصویر قبلی"}
                title={isEn ? "Previous image" : "تصویر قبلی"}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollMobileCarousel("right")}
                className="w-9 h-9 rounded-full bg-white border border-[#dfd9cc] text-[#0494D6] flex items-center justify-center shadow-2xs hover:bg-[#faf8f5] active:scale-95 transition-all cursor-pointer"
                aria-label={isEn ? "Next image" : "تصویر بعدی"}
                title={isEn ? "Next image" : "تصویر بعدی"}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Seamless Architectural Gallery Grid (>= sm) */}
        <div
          id="gallery-grid"
          role="region"
          aria-label="Gallery Grid"
          className={`hidden sm:grid ${gridContainerClass} gap-3 sm:gap-4 lg:gap-4.5`}
        >
          {filteredItems.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openLightbox(idx)}
              aria-label={item.title}
              className={`group relative rounded-[18px] sm:rounded-[22px] overflow-hidden border border-[#dfd9cc] bg-[#f0ece1]/50 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0494D6] col-span-1 aspect-[4/3] ${
                isEn ? "text-left" : "text-right"
              }`}
            >
              {/* Visual Image Asset */}
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />

              {/* Quiet Editorial Scrim on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white pointer-events-none z-10">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-medium text-white/90 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
                    {item.categoryName}
                  </span>
                </div>
                <p className="text-sm sm:text-base font-medium leading-snug text-white/95 drop-shadow-sm line-clamp-2">
                  {item.title}
                </p>
              </div>

              {/* Floating Subtle Expand Icon */}
              <div
                className={`absolute top-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/25 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105 z-20 ${
                  isEn ? "right-4" : "left-4"
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Full-Screen Immersive Interactive Photo Gallery Viewer */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={filteredItems[lightboxIndex]?.title || "Gallery Viewer"}
          className="fixed inset-0 z-50 bg-[#070b14]/98 backdrop-blur-2xl flex flex-col justify-between text-white select-none animate-in fade-in duration-200"
        >
          {/* Top Bar: Title, Counter & Close */}
          <div className="relative z-20 w-full px-4 sm:px-8 py-4 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md">
            <div className={`flex items-center gap-3.5 max-w-[70%] ${isEn ? "text-left" : "text-right"}`}>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/15 text-[#93c5fd] border border-white/20 whitespace-nowrap">
                {filteredItems[lightboxIndex].categoryName}
              </span>
              <p className="text-xs sm:text-sm font-medium text-white/90 truncate hidden sm:block">
                {filteredItems[lightboxIndex].title}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Photo Counter */}
              <span className="text-xs sm:text-sm font-semibold tabular-nums text-white/70 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                {formatNumber(lightboxIndex + 1)} {t.gallery.of} {formatNumber(filteredItems.length)}
              </span>

              {/* Close Button */}
              <button
                type="button"
                onClick={closeLightbox}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-white hover:scale-105"
                aria-label={t.gallery.close}
                title={t.gallery.close}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Stage: Large High-Fidelity Image with Next / Prev */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative flex-1 w-full flex items-center justify-center p-2 sm:p-6 overflow-hidden touch-pan-y"
          >
            {/* Main Stage Image */}
            <div className="relative w-full h-full max-h-[62vh] sm:max-h-[68vh] flex items-center justify-center">
              <Image
                src={filteredItems[lightboxIndex].src}
                alt={filteredItems[lightboxIndex].title}
                fill
                priority
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {/* Left Navigation Button */}
            <button
              type="button"
              onClick={showPrev}
              className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-6 w-12 h-12 rounded-full bg-black/50 hover:bg-black/85 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-all z-20 cursor-pointer shadow-2xl hover:scale-110 focus-visible:outline-2 focus-visible:outline-white"
              aria-label={t.gallery.prev}
              title={t.gallery.prev}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Navigation Button */}
            <button
              type="button"
              onClick={showNext}
              className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-6 w-12 h-12 rounded-full bg-black/50 hover:bg-black/85 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-all z-20 cursor-pointer shadow-2xl hover:scale-110 focus-visible:outline-2 focus-visible:outline-white"
              aria-label={t.gallery.next}
              title={t.gallery.next}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Bar: Caption + Interactive Filmstrip Thumbnails */}
          <div className="relative z-20 w-full bg-black/60 backdrop-blur-xl border-t border-white/10 pt-3 pb-4 px-4 sm:px-8 flex flex-col gap-3">
            {/* Active Photo Caption Title */}
            <div className={`w-full flex items-center justify-between ${isEn ? "text-left" : "text-right"}`}>
              <p className="text-xs sm:text-sm font-medium text-white/95 truncate">
                {filteredItems[lightboxIndex].title}
              </p>
              <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/50 flex-shrink-0">
                <span>{t.gallery.arrowsHint}</span>
                <span>·</span>
                <span>{t.gallery.escHint}</span>
              </div>
            </div>

            {/* Filmstrip / Thumbnail Row: Browse Entire Gallery Directly */}
            <div
              className="w-full flex items-center justify-start sm:justify-center gap-2.5 sm:gap-3 overflow-x-auto py-1 scrollbar-none [scrollbar-width:none]"
            >
              {filteredItems.map((thumbItem, thumbIdx) => {
                const isCurrent = thumbIdx === lightboxIndex;
                return (
                  <button
                    key={thumbItem.id}
                    ref={isCurrent ? activeThumbRef : null}
                    type="button"
                    onClick={() => setLightboxIndex(thumbIdx)}
                    aria-label={thumbItem.title}
                    className={`relative flex-shrink-0 w-14 sm:w-18 h-10 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                      isCurrent
                        ? "ring-2 ring-white ring-offset-2 ring-offset-[#070b14] scale-105 opacity-100 shadow-lg"
                        : "opacity-45 hover:opacity-90 border border-white/15"
                    }`}
                  >
                    <Image
                      src={thumbItem.src}
                      alt={thumbItem.title}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
