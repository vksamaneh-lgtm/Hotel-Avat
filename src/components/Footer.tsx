"use client";

import React from "react";
import Image from "next/image";
import { Phone, MapPin, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { BookingDialog } from "./BookingDialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { hotelConfig } from "@/config/hotel.config";

export function Footer() {
  const { language } = useLanguage();
  const t = translations[language];
  const isEn = language === "en";

  const navLinks = [
    { href: "#home", label: t.nav.home },
    { href: "#reels", label: t.nav.reels },
    { href: "#story", label: t.nav.story },
    { href: "#rooms", label: t.nav.rooms },
    { href: "#gallery", label: t.nav.gallery },
    { href: "#amenities", label: t.nav.amenities },
    { href: "#location", label: t.nav.location },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <footer className="relative bg-[#faf8f5] text-[#0494D6] border-t border-[#dfd9cc] pt-14 pb-10 overflow-hidden">
      {/* A single medallion watermark adds heritage without competing with the footer content. */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.055]"
        style={{
          backgroundImage: "url('/images/avat-pattern-medallion.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "min(420px, 78vw) auto",
        }}
      >
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        {/* Boutique Hotel Logo & Brand Identity */}
        <div className="mb-5 flex flex-col items-center">
          <a
            href="#home"
            className="group flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8c7b64] rounded-2xl p-1 transition-transform"
            aria-label={t.brand.name}
          >
            <div className="relative mb-3 flex items-center justify-center">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-[#dfd9cc] bg-white transition-all duration-300 group-hover:scale-105 group-hover:border-[#8c7b64]">
                <Image
                  src="/images/avat-logo.jpg"
                  alt={t.brand.name}
                  fill
                  sizes="(max-width: 640px) 64px, 80px"
                  className="object-contain scale-[1.1]"
                />
              </div>
            </div>

            {/* Hotel Identity */}
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0494D6] mb-1 transition-colors group-hover:text-[#8c7b64]">
              {t.brand.name}
            </h3>
            <span className="text-xs text-[#8c7b64] font-medium tracking-wide">
              {t.brand.subtitle}
            </span>
          </a>
        </div>

        {/* Short Editorial Heritage Note */}
        <p className="max-w-xl text-xs sm:text-sm text-[#555f6d] leading-relaxed font-light mb-8">
          {t.footer.desc}
        </p>

        {/* Minimal Clean Navigation Row */}
        <nav
          aria-label={t.footer.quickNav}
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-xs sm:text-sm text-[#475569] font-medium mb-8"
        >
          {navLinks.map((link, idx) => (
            <React.Fragment key={link.href}>
              <a
                href={link.href}
                className="hover:text-[#0494D6] transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
              {idx < navLinks.length - 1 && (
                <span className="text-[#8c7b64]/40 select-none hidden sm:inline">·</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Minimal Direct Contacts & Quick Action */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-[#555f6d] mb-8 pb-4">
          {hotelConfig.contact.phone.raw && (
            <>
              <a
                href={`tel:${isEn ? hotelConfig.contact.phone.international : hotelConfig.contact.phone.raw}`}
                className="flex items-center gap-2 hover:text-[#0494D6] transition-colors font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-[#8c7b64]" />
                <span dir="ltr">{t.nav.phone}</span>
              </a>
              <span className="text-[#8c7b64]/40 select-none hidden sm:inline">·</span>
            </>
          )}

          <a
            href={`https://wa.me/${hotelConfig.contact.whatsapp.number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-[#25D366] transition-colors font-semibold"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span dir="ltr">{t.nav.mobile}</span>
          </a>

          <span className="text-[#8c7b64]/40 select-none hidden sm:inline">·</span>

          <a
            href={hotelConfig.contact.social.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-[#E1306C] transition-colors font-semibold group"
            aria-label={`Instagram: ${hotelConfig.contact.social.instagramHandle}`}
          >
            <InstagramIcon className="w-3.5 h-3.5 text-[#E1306C] transition-transform group-hover:scale-110" />
            <span dir="ltr">{hotelConfig.contact.social.instagramHandle}</span>
          </a>

          <span className="text-[#8c7b64]/40 select-none hidden sm:inline">·</span>

          <div className="flex items-center gap-1.5 text-xs text-[#555f6d] font-light">
            <MapPin className="w-3.5 h-3.5 text-[#8c7b64] flex-shrink-0" />
            <span>{t.nav.address}</span>
          </div>

          <div className="w-full sm:w-auto mt-2 sm:mt-0 flex justify-center">
            <BookingDialog
              trigger={
                <Button className="h-8.5 px-4 rounded-full bg-[#0494D6] hover:bg-[#0379ad] text-white text-xs font-semibold shadow-xs cursor-pointer">
                  {t.footer.contactBtn}
                </Button>
              }
            />
          </div>
        </div>

        {/* Persian Ornamental Divider (نقش ترنج خطی مینیمال) */}
        <div className="w-full flex items-center justify-center my-4">
          <div className="flex-grow border-t border-[#dfd9cc]" />
          <div className="mx-3.5 flex items-center gap-1 text-[#8c7b64]/70">
            {/* Mini Persian Diamond Knot */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden="true">
              <path
                d="M 10 2 L 13 8 L 19 10 L 13 12 L 10 18 L 7 12 L 1 10 L 7 8 Z"
                fill="currentColor"
                opacity="0.85"
              />
              <circle cx="10" cy="10" r="2" fill="#faf8f5" />
            </svg>
          </div>
          <div className="flex-grow border-t border-[#dfd9cc]" />
        </div>

        {/* Bottom Dignified Bar */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8c7b64] font-light pt-2">
          <span>{t.footer.copyright}</span>
          <span>{t.footer.locationTag}</span>
        </div>
      </div>
    </footer>
  );
}
