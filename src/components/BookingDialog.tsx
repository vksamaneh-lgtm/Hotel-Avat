"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Phone, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

import { trackEvent, buildAttributedWhatsAppUrl } from "@/lib/tracker";
import { hotelConfig } from "@/config/hotel.config";

interface BookingDialogProps {
  initialRoom?: string;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  location?: string;
}

export function BookingDialog({
  initialRoom,
  trigger,
  isOpen,
  onOpenChange,
  location,
}: BookingDialogProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const isEn = language === "en";

  const [internalOpen, setInternalOpen] = useState(false);

  const openState = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = (open: boolean) => {
    if (open) {
      trackEvent("booking_dialog_open", { room: initialRoom || "general", location: location || "booking_dialog" });
    }
    if (onOpenChange) onOpenChange(open);
    else setInternalOpen(open);
  };

  const defaultRoomName = isEn ? hotelConfig.meta.nameEn : hotelConfig.meta.fullNameFa;
  const currentRoom = initialRoom || defaultRoomName;

  const attributedWhatsAppUrl = buildAttributedWhatsAppUrl(
    hotelConfig.contact.whatsapp.number,
    currentRoom,
    isEn ? "en" : "fa"
  );

  const renderedTrigger = trigger && React.isValidElement(trigger)
    ? React.cloneElement(trigger as React.ReactElement<{ onClick?: () => void }>, {
        onClick: () => setOpen(true),
      })
    : trigger ? (
      <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
        {trigger}
      </div>
    ) : null;

  return (
    <>
      {renderedTrigger}
      <Dialog open={openState} onOpenChange={setOpen}>
        <DialogContent className={`sm:max-w-[440px] p-6 sm:p-8 bg-white rounded-[24px] border border-[#dfd9cc] shadow-xl ${isEn ? "text-left" : "text-right"}`}>
          <DialogHeader className={`pb-3 border-b border-[#dfd9cc] ${isEn ? "text-left" : "text-right"}`}>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-[#172554]">
              {t.booking.title}
            </DialogTitle>
            {initialRoom && initialRoom !== defaultRoomName && (
              <p className="text-xs sm:text-sm text-[#8c7b64] font-medium mt-1">
                {t.booking.selectedRoomPrefix} {initialRoom}
              </p>
            )}
          </DialogHeader>

          {/* Minimal Harmonious Snapp Pay Note in Dialog */}
          <div className="mt-4 py-2 px-3.5 rounded-xl bg-[#faf8f5] border border-[#e8e4db] flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-4 relative flex-shrink-0">
                <Image src="/images/snapp-pay.png" alt="اسنپ پی Snapp Pay" fill className="object-contain" />
              </div>
              <span className="font-semibold text-[#172554]">
                {isEn ? "Pay in 4 installments with Snapp! Pay" : "امکان پرداخت در ۴ قسط ماهانه با اسنپ‌پی"}
              </span>
            </div>
            <span className="text-[11px] text-[#8c7b64] font-light whitespace-nowrap">
              {isEn ? "0% fee · No check" : "بدون کارمزد و ضامن"}
            </span>
          </div>

          <p className="text-xs sm:text-sm leading-6 text-[#555f6d] mt-3 mb-5 font-light">
            {t.booking.desc}
          </p>

          <div className="space-y-3">
            {/* WhatsApp Direct */}
            <a
              href={attributedWhatsAppUrl}
              onClick={() => {
                trackEvent("whatsapp_click", {
                  room: currentRoom,
                  location: location || "booking_dialog",
                });
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-[16px] bg-[#25D366] hover:bg-[#20ba59] text-white transition-colors shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-semibold">{t.booking.whatsappText}</span>
              </div>
              <span className="text-xs font-light text-white/90">
                {t.booking.whatsappQuick}
              </span>
            </a>

            {/* Landline */}
            {hotelConfig.contact.phone.raw && (
              <a
                href={`tel:${isEn ? hotelConfig.contact.phone.international : hotelConfig.contact.phone.raw}`}
                onClick={() => {
                  trackEvent("phone_call_click", {
                    room: currentRoom,
                    type: "landline",
                    number: hotelConfig.contact.phone.raw,
                    location: location || "booking_dialog",
                  });
                }}
                className="flex items-center justify-between p-4 rounded-[16px] bg-[#faf8f5] hover:bg-[#f3efe6] border border-[#dfd9cc] text-[#172554] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#8c7b64]" />
                  <span className="text-sm font-semibold">{t.booking.landlineText}</span>
                </div>
                <span className="text-base font-bold tabular-nums tracking-wide" dir="ltr">{t.nav.phone}</span>
              </a>
            )}

            {/* Mobile */}
            <a
              href={`tel:${isEn ? hotelConfig.contact.mobile.international : hotelConfig.contact.mobile.raw}`}
              onClick={() => {
                trackEvent("phone_call_click", {
                  room: currentRoom,
                  type: "mobile",
                  number: hotelConfig.contact.mobile.raw,
                  location: location || "booking_dialog",
                });
              }}
              className="flex items-center justify-between p-4 rounded-[16px] bg-[#faf8f5] hover:bg-[#f3efe6] border border-[#dfd9cc] text-[#172554] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#8c7b64]" />
                <span className="text-sm font-semibold">{t.booking.mobileText}</span>
              </div>
              <span className="text-base font-bold tabular-nums tracking-wide" dir="ltr">{t.nav.mobile}</span>
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

