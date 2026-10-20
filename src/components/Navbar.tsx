"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Phone,
  Menu,
  X,
  MessageCircle,
  Globe,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Film,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "./BookingDialog";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { trackEvent, buildAttributedWhatsAppUrl } from "@/lib/tracker";
import { hotelConfig } from "@/config/hotel.config";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, isEn } = useLanguage();
  const t = translations[language];

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "#home", label: t.nav.home },
    {
      href: "#reels",
      label: t.nav.reels,
      badge: isEn ? "Videos" : "ویدیوها",
      badgeColor: "bg-[#0494D6]/10 text-[#0494D6]",
      icon: Film,
    },
    { href: "#story", label: t.nav.story },
    {
      href: "#rooms",
      label: t.nav.rooms,
      badge: isEn ? "4x Snapp! Pay" : "۴ قسطه با اسنپ‌پی",
      badgeColor: "bg-[#0085FF]/10 text-[#0085FF]",
    },
    { href: "#gallery", label: t.nav.gallery },
    { href: "#amenities", label: t.nav.amenities },
    { href: "#location", label: t.nav.location },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <>
      {/* Top Notice Bar - Hidden on small mobile screens to preserve viewport height */}
      <aside
        className={`hidden sm:block bg-[#0494D6] text-white/80 text-xs py-2 transition-all duration-300 ${
          scrolled ? "max-h-0 opacity-0 overflow-hidden py-0" : "max-h-12 opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="truncate font-light text-white/90">{t.nav.address}</span>
          </div>
          <div className="flex items-center gap-5">
            {hotelConfig.contact.phone.raw && (
              <a
                href={`tel:${hotelConfig.contact.phone.raw}`}
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Phone className="w-3 h-3 text-[#c59b27]" />
                <span className="font-semibold" dir="ltr">{t.nav.phone}</span>
              </a>
            )}
            <a
              href={`https://wa.me/${hotelConfig.contact.whatsapp.number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#25D366] transition-colors"
            >
              <MessageCircle className="w-3 h-3 text-[#25D366]" />
              <span dir="ltr">{t.nav.mobile}</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Header - Normal scroll on mobile (non-sticky), floating pill on sm+ */}
      <header
        className={`absolute sm:fixed z-50 transition-all duration-300 ease-out inset-x-0 w-full bg-white/95 backdrop-blur-md border-b border-[#dfd9cc] px-4 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] top-0 ${
          scrolled
            ? "sm:top-4 sm:mx-auto sm:w-[calc(100%-2rem)] lg:w-max max-w-[96vw] sm:backdrop-blur-xl sm:shadow-[0_10px_35px_-5px_rgba(4,148,214,0.12)] sm:border sm:rounded-full sm:px-5 lg:px-6 sm:py-2.5 sm:border-b-transparent"
            : "sm:top-8 sm:bg-white/90 sm:px-8 sm:py-3.5"
        }`}
      >
        <div className="w-full flex items-center justify-between gap-2.5 sm:gap-4 lg:gap-8">
          {/* Brand Logo & Name */}
          <a
            href="#home"
            className="flex items-center gap-2 sm:gap-2.5 group flex-shrink-0 whitespace-nowrap"
          >
            <div
              className={`relative rounded-full overflow-hidden border border-[#dfd9cc] bg-white flex items-center justify-center transition-all flex-shrink-0 ${
                scrolled ? "w-8 h-8 sm:w-9 sm:h-9" : "w-9 h-9 sm:w-11 sm:h-11"
              }`}
            >
              <Image
                src="/images/logo.jpg"
                alt={t.brand.title}
                fill
                sizes="44px"
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className={`flex flex-col whitespace-nowrap ${isEn ? "text-left" : "text-right"}`}>
              <span
                className={`font-bold tracking-tight text-[#0494D6] transition-all whitespace-nowrap ${
                  scrolled ? "text-sm sm:text-base" : "text-sm sm:text-xl font-black"
                }`}
              >
                {t.brand.name}
              </span>
              {!scrolled && (
                <span className="hidden sm:block text-[10px] text-[#8c7b64] whitespace-nowrap">
                  {t.brand.subtitle}
                </span>
              )}
            </div>
          </a>

          {/* Desktop Nav - Hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-center flex-nowrap whitespace-nowrap">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs xl:text-sm font-medium text-[#0494D6] hover:text-[#8c7b64] transition-colors whitespace-nowrap py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 whitespace-nowrap">
            {/* Language Switcher Pill */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-full border border-[#dfd9cc] bg-white hover:bg-[#faf8f5] text-[#0494D6] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs whitespace-nowrap flex-shrink-0"
              title={isEn ? "تغییر زبان به فارسی" : "Switch language to English"}
              aria-label="Language switcher"
            >
              <Globe className="w-3.5 h-3.5 text-[#8c7b64] flex-shrink-0" />
              <span className="font-bold whitespace-nowrap">{isEn ? "فارسی" : "EN"}</span>
            </button>

            {/* Direct Booking CTA - Visible on Tablet and Desktop */}
            <div className="hidden sm:inline-flex">
              <BookingDialog
                trigger={
                  <Button
                    className={`bg-[#0494D6] hover:bg-[#0379ad] text-white font-medium transition-all shadow-sm cursor-pointer whitespace-nowrap flex-shrink-0 ${
                      scrolled
                        ? "rounded-full px-3 sm:px-4 py-1.5 h-8 sm:h-9 text-xs"
                        : "rounded-full px-3.5 sm:px-5 py-2 h-8.5 sm:h-10 text-xs sm:text-sm"
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5 text-white/80 flex-shrink-0" />
                    <span className="whitespace-nowrap">{t.nav.bookBtn}</span>
                  </Button>
                }
              />
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-8.5 h-8.5 sm:w-10 sm:h-10 text-[#0494D6] bg-[#faf8f5] sm:bg-transparent border border-[#dfd9cc] sm:border-transparent hover:bg-slate-100 rounded-full flex items-center justify-center transition-all cursor-pointer flex-shrink-0 active:scale-95 shadow-2xs sm:shadow-none"
              aria-label={isEn ? "Open navigation menu" : "باز کردن منو"}
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#0494D6]" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Native-Feeling Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isEn ? "Navigation Menu" : "منوی ناوبری"}
          className="fixed inset-0 z-[100] lg:hidden bg-[#faf8f5]/98 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto overscroll-contain animate-in fade-in duration-200"
        >
          {/* Top Bar inside Drawer */}
          <div className="pt-[max(1rem,env(safe-area-inset-top))] px-5 pb-4 border-b border-[#dfd9cc] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#dfd9cc] bg-white flex items-center justify-center flex-shrink-0">
                <Image
                  src="/images/logo.jpg"
                  alt={t.brand.title}
                  fill
                  sizes="36px"
                  className="object-contain p-0.5"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-[#0494D6]">
                  {t.brand.name}
                </span>
                <span className="text-[10px] text-[#8c7b64]">
                  {t.brand.subtitle}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleLanguage}
                className="h-9 px-3 rounded-full border border-[#dfd9cc] bg-white text-[#0494D6] text-xs font-bold flex items-center gap-1.5 shadow-2xs"
              >
                <Globe className="w-3.5 h-3.5 text-[#8c7b64]" />
                <span>{isEn ? "فارسی" : "EN"}</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-white border border-[#dfd9cc] text-[#0494D6] flex items-center justify-center shadow-2xs hover:bg-[#faf8f5] active:scale-95 transition-all cursor-pointer"
                aria-label={isEn ? "Close menu" : "بستن منو"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Links List */}
          <nav className="flex-1 py-4 px-4 overflow-y-auto flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const Chevron = isEn ? ChevronRight : ChevronLeft;

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[52px] px-4 rounded-2xl bg-white border border-[#e8e4db] text-[#0494D6] hover:bg-[#0494D6] hover:text-white hover:border-[#0494D6] transition-all flex items-center justify-between gap-3 shadow-2xs active:scale-[0.98] group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base font-bold tracking-tight">
                      {link.label}
                    </span>
                    {link.badge && (
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${link.badgeColor} group-hover:bg-white group-hover:text-[#0494D6] transition-colors`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </div>

                  <Chevron className="w-4 h-4 text-[#8c7b64] group-hover:text-white transition-colors" />
                </a>
              );
            })}
          </nav>

          {/* Bottom Direct Contacts & Social Strip */}
          <div className="p-4 sm:p-5 border-t border-[#dfd9cc] bg-white/60 pb-[max(1.5rem,env(safe-area-inset-bottom))] flex flex-col gap-3">
            <div className={hotelConfig.contact.phone.raw ? "grid grid-cols-2 gap-2.5" : "grid grid-cols-1 gap-2.5"}>
              {hotelConfig.contact.phone.raw && (
                <a
                  href={`tel:${hotelConfig.contact.phone.raw}`}
                  onClick={() => {
                    trackEvent("phone_call_click", {
                      type: "landline",
                      number: hotelConfig.contact.phone.raw,
                      location: "mobile_drawer",
                    });
                  }}
                  className="h-12 rounded-xl bg-[#0494D6] text-white flex items-center justify-center gap-2 text-xs font-bold shadow-sm active:scale-98 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#c59b27]" />
                  <span dir="ltr">{t.nav.phone}</span>
                </a>
              )}

              <a
                href={buildAttributedWhatsAppUrl(hotelConfig.contact.whatsapp.number, undefined, isEn ? "en" : "fa")}
                onClick={() => {
                  trackEvent("whatsapp_click", {
                    location: "mobile_drawer",
                  });
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center gap-2 text-xs font-bold shadow-sm active:scale-98 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isEn ? "WhatsApp" : "پیام واتساپ"}</span>
              </a>
            </div>

            <a
              href={hotelConfig.contact.social.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 rounded-xl bg-white border border-[#dfd9cc] text-[#0494D6] hover:text-[#E1306C] flex items-center justify-center gap-2 text-xs font-bold shadow-2xs active:scale-98 transition-all"
            >
              <InstagramIcon className="w-4 h-4 text-[#E1306C]" />
              <span dir="ltr">{hotelConfig.contact.social.instagramHandle}</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
