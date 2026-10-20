"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "./BookingDialog";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Images,
  Phone,
  MessageCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { trackEvent, buildAttributedWhatsAppUrl } from "@/lib/tracker";
import { hotelConfig } from "@/config/hotel.config";

export function RoomsSection() {
  const { language } = useLanguage();
  const t = translations[language];
  const isEn = language === "en";

  const [filter, setFilter] = useState<string>("all");
  const [roomImageIndexes, setRoomImageIndexes] = useState<Record<string, number>>({});
  const [selectedRoomForDialog, setSelectedRoomForDialog] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  // Dedicated Room Gallery Modal State
  const [galleryModalRoom, setGalleryModalRoom] = useState<(typeof t.rooms.items)[0] | null>(null);
  const [galleryPhotoIndex, setGalleryPhotoIndex] = useState<number>(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const activeGalleryThumbRef = useRef<HTMLButtonElement | null>(null);

  const filteredRooms = t.rooms.items.filter((room) => {
    if (filter === "all") return true;
    return room.category === filter;
  });

  const handleOpenBooking = (roomTitle: string) => {
    setSelectedRoomForDialog(roomTitle);
    setDialogOpen(true);
  };

  const getCategoryCount = (catId: string) => {
    if (catId === "all") return t.rooms.items.length;
    return t.rooms.items.filter((r) => r.category === catId).length;
  };

  // Convert digits to Persian format if language is FA
  const formatNumber = (num: number) => {
    if (language === "fa") {
      const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
      return String(num).replace(/\d/g, (d) => persianDigits[Number(d)]);
    }
    return String(num);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(language === "fa" ? "fa-IR" : "en-US").format(price);

  // Inline card photo switching
  const handlePrevImage = (roomId: string, total: number) => {
    setRoomImageIndexes((prev) => {
      const cur = prev[roomId] || 0;
      return { ...prev, [roomId]: (cur - 1 + total) % total };
    });
  };

  const handleNextImage = (roomId: string, total: number) => {
    setRoomImageIndexes((prev) => {
      const cur = prev[roomId] || 0;
      return { ...prev, [roomId]: (cur + 1) % total };
    });
  };

  // Open Room Gallery Modal
  const openRoomGallery = (room: (typeof t.rooms.items)[0], initialIndex = 0) => {
    trackEvent("view_room_gallery", { room: room.title, photosCount: room.images?.length || 1 });
    setGalleryModalRoom(room);
    setGalleryPhotoIndex(initialIndex);
  };

  const closeRoomGallery = () => {
    setGalleryModalRoom(null);
  };

  const showNextGalleryPhoto = useCallback(() => {
    if (!galleryModalRoom) return;
    const total = galleryModalRoom.images?.length || 1;
    setGalleryPhotoIndex((prev) => (prev + 1) % total);
  }, [galleryModalRoom]);

  const showPrevGalleryPhoto = useCallback(() => {
    if (!galleryModalRoom) return;
    const total = galleryModalRoom.images?.length || 1;
    setGalleryPhotoIndex((prev) => (prev - 1 + total) % total);
  }, [galleryModalRoom]);

  // Lock body scroll when room gallery is open
  useEffect(() => {
    if (galleryModalRoom !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [galleryModalRoom]);

  // Auto-scroll active thumbnail in room gallery into view
  useEffect(() => {
    if (galleryModalRoom !== null && activeGalleryThumbRef.current) {
      activeGalleryThumbRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [galleryModalRoom, galleryPhotoIndex]);

  // Keyboard navigation for room gallery
  useEffect(() => {
    if (galleryModalRoom === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        showPrevGalleryPhoto();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        showNextGalleryPhoto();
      } else if (e.key === "Escape") {
        closeRoomGallery();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [galleryModalRoom, showNextGalleryPhoto, showPrevGalleryPhoto]);

  // Touch swipe support for mobile in room gallery
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        showNextGalleryPhoto();
      } else {
        showPrevGalleryPhoto();
      }
    }
    setTouchStart(null);
  };

  return (
    <section id="rooms" className="py-14 sm:py-28 md:py-36 bg-white border-t border-[#dfd9cc]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header - Editorial & Restrained */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-16 pb-6 sm:pb-8 border-b border-[#dfd9cc]">
          <div className={`max-w-2xl ${isEn ? "text-left" : "text-right"}`}>
            <h2 className="text-[30px] sm:text-[42px] lg:text-[46px] font-bold leading-tight text-[#0494D6] tracking-tight mb-3">
              {t.rooms.heading}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#555f6d] font-light">
              {t.rooms.desc}
            </p>
          </div>

          <div className="flex-shrink-0">
            <BookingDialog
              trigger={
                <Button className="bg-[#0494D6] hover:bg-[#0379ad] text-white rounded-full h-11 px-7 text-sm font-semibold shadow-sm cursor-pointer">
                  {t.rooms.inquireBtn}
                </Button>
              }
            />
          </div>
        </div>

        {/* Minimalist Room Category Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 sm:pb-6 mb-6 sm:mb-10 scrollbar-none [scrollbar-width:none]">
          {t.rooms.categories?.map((cat) => {
            const isActive = filter === cat.id;
            const count = getCategoryCount(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilter(cat.id)}
                className={`h-10 px-4 sm:px-5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? "bg-[#0494D6] text-white shadow-xs"
                    : "bg-[#faf8f5] hover:bg-white text-[#555f6d] hover:text-[#0494D6] border border-[#dfd9cc]"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold tabular-nums ${
                    isActive ? "bg-white/20 text-white" : "bg-white text-[#8c7b64] border border-[#dfd9cc]"
                  }`}
                >
                  {formatNumber(count)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Room Showcases - Alternating Editorial Layout with Gallery */}
        <div className="flex flex-col gap-12 sm:gap-28">
          {filteredRooms.map((room, index) => {
            const isEven = index % 2 === 0;
            const imagesList = room.images && room.images.length > 0 ? room.images : [room.image];
            const hasMultipleImages = imagesList.length > 1;
            const currentImgIdx = (roomImageIndexes[room.id] || 0) % imagesList.length;
            const currentSrc = imagesList[currentImgIdx];

            return (
              <div
                key={room.id}
                className="bg-[#faf8f5] rounded-[24px] border border-[#dfd9cc] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch shadow-xs hover:shadow-md transition-shadow duration-300"
              >
                {/* Photo Frame with Multi-Image Support & Click-to-Open Gallery */}
                <div
                  onClick={() => openRoomGallery(room, currentImgIdx)}
                  className={`lg:col-span-7 relative min-h-[360px] sm:min-h-[440px] lg:min-h-[500px] overflow-hidden group cursor-pointer ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${room.title} - ${isEn ? "View Photo Gallery" : "مشاهده گالری تصاویر"}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openRoomGallery(room, currentImgIdx);
                    }
                  }}
                >
                  <Image
                    src={currentSrc}
                    alt={room.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent lg:hidden" />

                  {/* Room Category Pill */}
                  {room.categoryLabel && (
                    <div className={`absolute top-4 ${isEn ? "left-4" : "right-4"} z-20`}>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/95 text-[#0494D6] backdrop-blur-md shadow-sm border border-white/60">
                        {room.categoryLabel}
                      </span>
                    </div>
                  )}

                  {/* Prominent Gallery Badge on Photo */}
                  {hasMultipleImages && (
                    <div className={`absolute top-4 ${isEn ? "right-4" : "left-4"} z-20`}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openRoomGallery(room, currentImgIdx);
                        }}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/25 shadow-sm transition-all group-hover:scale-105 cursor-pointer"
                        title={isEn ? "Open full gallery" : "مشاهده گالری تصاویر این اتاق"}
                      >
                        <Images className="w-3.5 h-3.5 text-amber-300" />
                        <span>
                          {formatNumber(imagesList.length)} {isEn ? "Photos" : "تصویر"}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Inline Prev/Next Chevrons on Card Photo */}
                  {hasMultipleImages && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevImage(room.id, imagesList.length);
                        }}
                        className="absolute top-1/2 -translate-y-1/2 left-3 w-9 h-9 rounded-full bg-black/45 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/25 opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer shadow-md hover:scale-110"
                        aria-label={isEn ? "Previous Photo" : "تصویر قبلی"}
                        title={isEn ? "Previous Photo" : "تصویر قبلی"}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextImage(room.id, imagesList.length);
                        }}
                        className="absolute top-1/2 -translate-y-1/2 right-3 w-9 h-9 rounded-full bg-black/45 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/25 opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer shadow-md hover:scale-110"
                        aria-label={isEn ? "Next Photo" : "تصویر بعدی"}
                        title={isEn ? "Next Photo" : "تصویر بعدی"}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Multi-Photo Dots & Counter Indicator */}
                  {hasMultipleImages && (
                    <div className={`absolute bottom-4 ${isEn ? "right-4" : "left-4"} z-20 flex items-center gap-2 bg-black/55 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20`}>
                      <div className="flex items-center gap-1.5">
                        {imagesList.map((_, imgIdx) => (
                          <button
                            key={imgIdx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRoomImageIndexes((prev) => ({ ...prev, [room.id]: imgIdx }));
                            }}
                            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                              currentImgIdx === imgIdx
                                ? "bg-white scale-125 shadow-xs"
                                : "bg-white/40 hover:bg-white/80"
                            }`}
                            aria-label={`Photo ${imgIdx + 1}`}
                            title={`تصویر ${formatNumber(imgIdx + 1)}`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-white/90 font-semibold tabular-nums pr-1.5 border-r border-white/25">
                        {formatNumber(currentImgIdx + 1)}/{formatNumber(imagesList.length)}
                      </span>
                    </div>
                  )}

                  <div className={`absolute bottom-5 right-5 left-5 text-white lg:hidden z-10 ${isEn ? "text-left" : "text-right"}`}>
                    <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-sm">{room.title}</h3>
                    <p className="text-xs text-white/90 drop-shadow-sm">{room.subtitle}</p>
                  </div>
                </div>

                {/* Content Panel */}
                <div
                  className={`lg:col-span-5 p-7 sm:p-9 lg:p-11 flex flex-col justify-between ${
                    isEn ? "text-left" : "text-right"
                  } ${isEven ? "lg:order-2" : "lg:order-1"}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-2xl sm:text-3xl font-bold text-[#0494D6] leading-snug">
                        {room.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm font-medium text-[#8c7b64] mb-3">
                      {room.subtitle}
                    </p>

                    <div className="flex items-center justify-between gap-4 border-y border-[#dfd9cc] py-3 mb-5">
                      <span className="text-xs sm:text-sm text-[#555f6d]">{t.rooms.priceLabel}</span>
                      <strong className="text-base sm:text-lg text-[#0494D6] font-bold whitespace-nowrap">
                        {formatPrice(room.pricePerNight)} {t.rooms.currency}
                      </strong>
                    </div>

                    <p className="text-sm sm:text-base text-[#555f6d] mb-5 leading-relaxed font-light">
                      {room.description}
                    </p>

                    {/* Button to Open Full Room Photo Gallery */}
                    {hasMultipleImages && (
                      <button
                        type="button"
                        onClick={() => openRoomGallery(room, currentImgIdx)}
                        className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-[#0494D6] hover:text-[#0379ad] bg-[#faf8f5] hover:bg-white px-3.5 py-1.5 rounded-full border border-[#dfd9cc] transition-all cursor-pointer group/btn shadow-2xs hover:shadow-xs"
                      >
                        <Images className="w-3.5 h-3.5 text-[#8c7b64] group-hover/btn:scale-110 transition-transform" />
                        <span>
                          {isEn
                            ? `View all ${imagesList.length} photos of this room`
                            : `مشاهده گالری (${formatNumber(imagesList.length)} تصویر این اتاق)`}
                        </span>
                        <ChevronLeft className={`w-3.5 h-3.5 ${isEn ? "rotate-180" : ""}`} />
                      </button>
                    )}

                    {/* Room Specs - Editorial Line */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 py-3 border-y border-[#dfd9cc] text-xs sm:text-sm text-[#555f6d] mb-5">
                      <span>
                        {t.rooms.capacityLabel} <strong className="text-[#0494D6] font-semibold">{room.capacity}</strong>
                      </span>
                    </div>

                    {/* Highlights */}
                    <ul className="space-y-2 mb-5 text-xs sm:text-sm text-[#475569] font-light">
                      {room.highlights.map((item, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2.5">
                          <span className="text-[#8c7b64] font-bold select-none">—</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Minimal Harmonious Snapp Pay Note */}
                    {hotelConfig.features.snappPay.enabled && (
                      <div className="mb-6 py-2 px-3.5 rounded-xl bg-[#faf8f5] border border-[#e8e4db] flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-4 relative flex-shrink-0">
                            <Image src="/images/snapp-pay.png" alt="اسنپ پی" fill className="object-contain" />
                          </div>
                          <span className="text-[#8c7b64]/30 select-none hidden sm:inline">|</span>
                          <span className="font-medium text-[#0494D6]">
                            {isEn ? "Pay in 4 installments with Snapp! Pay" : "امکان پرداخت در ۴ قسط با اسنپ‌پی"}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#8c7b64] font-light whitespace-nowrap">
                          {isEn ? "0% fee · No check" : "بدون کارمزد و ضامن"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#dfd9cc] flex items-center gap-3">
                    <Button
                      onClick={() => {
                        trackEvent("booking_dialog_open", { room: room.title, location: "room_card" });
                        handleOpenBooking(room.title);
                      }}
                      className="flex-1 bg-[#0494D6] hover:bg-[#0379ad] text-white rounded-full h-11 text-sm font-semibold gap-2 shadow-sm cursor-pointer"
                    >
                      <Phone className="w-4 h-4 text-white/80" />
                      {t.rooms.callToBook}
                    </Button>

                    <a
                      href={buildAttributedWhatsAppUrl(hotelConfig.contact.whatsapp.number, room.title, isEn ? "en" : "fa")}
                      onClick={() => {
                        trackEvent("whatsapp_click", { room: room.title, location: "room_card" });
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-11 px-5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center gap-2 text-sm font-semibold transition-colors shadow-sm cursor-pointer"
                      aria-label={`${t.rooms.whatsapp} - ${room.title}`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{t.rooms.whatsapp}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Dialog triggered from cards */}
        <BookingDialog
          initialRoom={selectedRoomForDialog}
          isOpen={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>

      {/* Full-Screen Dedicated Room Photo Gallery Modal */}
      {galleryModalRoom && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={galleryModalRoom.title}
          className="fixed inset-0 z-50 bg-[#070b14]/98 backdrop-blur-2xl flex flex-col justify-between text-white select-none animate-in fade-in duration-200"
        >
          {/* Top Bar: Room Title, Category, Counter, Quick Book, Close */}
          <div className="relative z-20 w-full px-4 sm:px-8 py-4 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md">
            <div className={`flex items-center gap-3.5 max-w-[65%] ${isEn ? "text-left" : "text-right"}`}>
              {galleryModalRoom.categoryLabel && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/15 text-[#93c5fd] border border-white/20 whitespace-nowrap">
                  {galleryModalRoom.categoryLabel}
                </span>
              )}
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                {galleryModalRoom.title}
              </h3>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-4">
              {/* Photo Counter */}
              <span className="text-xs sm:text-sm font-semibold tabular-nums text-white/70 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                {formatNumber(galleryPhotoIndex + 1)} {isEn ? "of" : "از"}{" "}
                {formatNumber(galleryModalRoom.images?.length || 1)}
              </span>

              {/* Quick Book from Inside Gallery */}
              <Button
                onClick={() => {
                  const title = galleryModalRoom.title;
                  trackEvent("booking_dialog_open", { room: title, location: "gallery_modal" });
                  closeRoomGallery();
                  handleOpenBooking(title);
                }}
                className="hidden sm:flex bg-[#0494D6] hover:bg-[#0379ad] text-white rounded-full h-9 px-4 text-xs font-semibold gap-1.5 shadow-sm border border-white/20 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-white/80" />
                <span>{isEn ? "Book This Room" : "رزرو این اتاق"}</span>
              </Button>

              {/* Close Button */}
              <button
                type="button"
                onClick={closeRoomGallery}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-white hover:scale-105"
                aria-label={isEn ? "Close" : "بستن"}
                title={isEn ? "Close (Esc)" : "بستن (Esc)"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Stage: Large High-Fidelity Room Photo with Next / Prev */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative flex-1 w-full flex items-center justify-center p-2 sm:p-6 overflow-hidden touch-pan-y"
          >
            <div className="relative w-full h-full max-h-[62vh] sm:max-h-[68vh] flex items-center justify-center">
              <Image
                src={galleryModalRoom.images[galleryPhotoIndex]}
                alt={`${galleryModalRoom.title} - photo ${galleryPhotoIndex + 1}`}
                fill
                priority
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {/* Left Button */}
            <button
              type="button"
              onClick={showPrevGalleryPhoto}
              className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-6 w-12 h-12 rounded-full bg-black/50 hover:bg-black/85 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-all z-20 cursor-pointer shadow-2xl hover:scale-110 focus-visible:outline-2 focus-visible:outline-white"
              aria-label={isEn ? "Previous" : "تصویر قبلی"}
              title={isEn ? "Previous (Arrow Left)" : "تصویر قبلی (کلید چپ)"}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Button */}
            <button
              type="button"
              onClick={showNextGalleryPhoto}
              className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-6 w-12 h-12 rounded-full bg-black/50 hover:bg-black/85 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-all z-20 cursor-pointer shadow-2xl hover:scale-110 focus-visible:outline-2 focus-visible:outline-white"
              aria-label={isEn ? "Next" : "تصویر بعدی"}
              title={isEn ? "Next (Arrow Right)" : "تصویر بعدی (کلید راست)"}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Bar: Filmstrip Thumbnails of all photos of this room */}
          <div className="relative z-20 w-full bg-black/60 backdrop-blur-xl border-t border-white/10 pt-3 pb-4 px-4 sm:px-8 flex flex-col gap-3">
            <div className={`w-full flex items-center justify-between ${isEn ? "text-left" : "text-right"}`}>
              <p className="text-xs sm:text-sm font-medium text-white/95 truncate">
                {galleryModalRoom.title} · {galleryModalRoom.subtitle}
              </p>
              <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/50 flex-shrink-0">
                <span>{isEn ? "Arrow keys to navigate" : "کلیدهای جهت‌نما برای جابجایی"}</span>
                <span>·</span>
                <span>{isEn ? "Esc to close" : "Esc برای بستن"}</span>
              </div>
            </div>

            {/* Filmstrip Row */}
            <div className="w-full flex items-center justify-start sm:justify-center gap-2.5 sm:gap-3 overflow-x-auto py-1 scrollbar-none [scrollbar-width:none]">
              {galleryModalRoom.images.map((thumbSrc, thumbIdx) => {
                const isCurrent = thumbIdx === galleryPhotoIndex;
                return (
                  <button
                    key={thumbIdx}
                    ref={isCurrent ? activeGalleryThumbRef : null}
                    type="button"
                    onClick={() => setGalleryPhotoIndex(thumbIdx)}
                    aria-label={`Photo ${thumbIdx + 1}`}
                    className={`relative flex-shrink-0 w-16 sm:w-20 h-12 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                      isCurrent
                        ? "ring-2 ring-white ring-offset-2 ring-offset-[#070b14] scale-105 opacity-100 shadow-lg"
                        : "opacity-45 hover:opacity-90 border border-white/15"
                    }`}
                  >
                    <Image
                      src={thumbSrc}
                      alt={`Thumbnail ${thumbIdx + 1}`}
                      fill
                      sizes="80px"
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
