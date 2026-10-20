"use client";

import React from "react";
import { Phone, MessageCircle } from "lucide-react";
import { BookingDialog } from "./BookingDialog";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { trackEvent, buildAttributedWhatsAppUrl } from "@/lib/tracker";
import { hotelConfig } from "@/config/hotel.config";

export function FloatingCTA() {
  const { language } = useLanguage();
  const t = translations[language];
  const hotelName = language === "en" ? hotelConfig.meta.nameEn : hotelConfig.meta.fullNameFa;

  return (
    <aside
      aria-label={t.floatingCTA.receptionBtn}
      className={`fixed bottom-[max(1rem,calc(env(safe-area-inset-bottom)+0.75rem))] z-40 flex items-center gap-2 ${
        language === "fa" ? "left-3 sm:left-6" : "right-3 sm:right-6"
      }`}
    >
      {/* WhatsApp Quiet Link */}
      <a
        href={buildAttributedWhatsAppUrl(hotelConfig.contact.whatsapp.number, hotelName, language === "en" ? "en" : "fa")}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackEvent("whatsapp_click", {
            room: hotelName,
            location: "floating_cta",
          });
        }}
        className="w-11 h-11 rounded-full bg-white/95 hover:bg-white text-[#25D366] flex items-center justify-center shadow-lg border border-[#dfd9cc] backdrop-blur-md transition-colors"
        aria-label={t.floatingCTA.whatsappAria}
        title={t.floatingCTA.whatsappAria}
      >
        <MessageCircle className="w-5 h-5" />
      </a>

      {/* Reception Call Button with Installment Tag */}
      <BookingDialog
        location="floating_cta"
        trigger={
          <button className="h-11 px-4 sm:px-5 rounded-full bg-[#0494D6] hover:bg-[#0379ad] text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-xl transition-all cursor-pointer border border-white/10 hover:scale-105">
            <Phone className="w-4 h-4 text-white/80" />
            <span>{t.floatingCTA.receptionBtn}</span>
            {hotelConfig.features.snappPay.enabled && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0085FF] text-[10px] font-bold text-white shadow-2xs">
                {language === "fa" ? hotelConfig.features.snappPay.badgeFa : hotelConfig.features.snappPay.badgeEn}
              </span>
            )}
          </button>
        }
      />
    </aside>
  );
}

