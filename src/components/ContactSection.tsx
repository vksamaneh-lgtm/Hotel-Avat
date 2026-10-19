"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { hotelConfig } from "@/config/hotel.config";

export function ContactSection() {
  const { language } = useLanguage();
  const t = translations[language];
  const isEn = language === "en";

  return (
    <section id="contact" className="py-24 md:py-36 bg-white border-t border-[#e8e4db]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Heading - Dignified & Restrained */}
        <div className={`max-w-2xl mb-16 md:mb-20 ${isEn ? "text-left" : "text-right"}`}>
          <h2 className="text-[32px] sm:text-[44px] lg:text-[48px] font-bold leading-tight text-[#172554] tracking-tight mb-4">
            {t.contact.heading}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-[#555f6d] font-light">
            {t.contact.desc}
          </p>
        </div>

        {/* Reception Channels & Essential Info */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 ${isEn ? "text-left" : "text-right"}`}>
          {/* Direct Lines */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[#172554] pb-3 border-b border-[#dfd9cc]">
              {t.contact.phoneHeading}
            </h3>

            {/* Landline */}
            {hotelConfig.contact.phone.raw ? (
              <div className="py-3">
                <span className="block text-xs text-[#8c7b64] font-medium mb-1">{t.contact.landlineLabel}</span>
                <a
                  href={`tel:${isEn ? hotelConfig.contact.phone.international : hotelConfig.contact.phone.raw}`}
                  className="text-2xl sm:text-3xl font-bold text-[#172554] hover:text-[#0f172a] transition-colors inline-block"
                  dir="ltr"
                >
                  {t.nav.phone}
                </a>
              </div>
            ) : (
              <div className="py-3">
                <span className="block text-xs text-[#8c7b64] font-medium mb-1">{t.contact.landlineLabel}</span>
                <span className="text-base font-semibold text-[#555f6d]">{t.nav.phone}</span>
              </div>
            )}

            {/* Mobile */}
            <div className="py-3 border-t border-[#dfd9cc]">
              <span className="block text-xs text-[#8c7b64] font-medium mb-1">{t.contact.mobileLabel}</span>
              <a
                href={`tel:${isEn ? hotelConfig.contact.mobile.international : hotelConfig.contact.mobile.raw}`}
                className="text-2xl sm:text-3xl font-bold text-[#172554] hover:text-[#0f172a] transition-colors inline-block"
                dir="ltr"
              >
                {t.nav.mobile}
              </a>
            </div>

            {/* Direct Channels: WhatsApp & Instagram */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/${hotelConfig.contact.whatsapp.number}?text=${encodeURIComponent(
                  isEn
                    ? `Hello, I would like to inquire about booking at ${hotelConfig.meta.nameEn}.`
                    : `سلام، جهت رزرو اقامت در ${hotelConfig.meta.nameFa} پیام می‌دهم.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-6 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white inline-flex items-center gap-2.5 font-semibold text-sm transition-colors shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t.contact.whatsappBtn}</span>
              </a>

              <a
                href={hotelConfig.contact.social.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-6 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white inline-flex items-center gap-2.5 font-semibold text-sm transition-all shadow-sm hover:scale-[1.02] cursor-pointer"
              >
                <InstagramIcon className="w-5 h-5 text-white" />
                <span>{t.contact.instagramBtn}</span>
              </a>
            </div>
          </div>

          {/* Practical Stay Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[#172554] pb-3 border-b border-[#dfd9cc]">
              {t.contact.stayInfoHeading}
            </h3>

            <div className="space-y-4 text-sm leading-7 text-[#555f6d] font-light">
              <div>
                <strong className="block text-sm font-semibold text-[#172554] mb-0.5">{t.contact.addressTitle}</strong>
                <p>{t.contact.addressDesc}</p>
              </div>

              <div className="pt-2 border-t border-[#dfd9cc]">
                <strong className="block text-sm font-semibold text-[#172554] mb-0.5">{t.contact.checkInOutTitle}</strong>
                <p>{t.contact.checkInOutDesc}</p>
              </div>

              <div className="pt-2 border-t border-[#dfd9cc]">
                <strong className="block text-sm font-semibold text-[#172554] mb-0.5">{t.contact.buyoutTitle}</strong>
                <p>{t.contact.buyoutDesc}</p>
              </div>

              <div className="pt-2 border-t border-[#dfd9cc]">
                <strong className="block text-sm font-semibold text-[#172554] mb-0.5">{t.contact.emailTitle}</strong>
                <p dir="ltr" className={`text-[#172554] ${isEn ? "text-left" : "text-right"}`}>
                  {hotelConfig.contact.social.email ?? hotelConfig.contact.social.instagramHandle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

