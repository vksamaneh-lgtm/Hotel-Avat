"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export function ArchitecturePhilosophy() {
  const { language } = useLanguage();
  const t = translations[language];
  const isEn = language === "en";

  const [roomImageIndex, setRoomImageIndex] = useState(0);

  return (
    <section
      id="story"
      className="relative py-24 md:py-36 bg-[#faf8f5] text-[#0494D6] border-b border-[#e8e4db] overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-center bg-repeat opacity-[0.08]"
        style={{
          backgroundImage: "url('/images/avat-story-background.jpg')",
          backgroundSize: "520px 520px",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Heading - Dignified & Natural */}
        <div className={`max-w-2xl mb-20 sm:mb-28 ${isEn ? "text-left" : "text-right"}`}>
          <h2 className="text-[32px] sm:text-[44px] lg:text-[48px] font-bold leading-[44px] sm:leading-[58px] tracking-tight text-[#0494D6] mb-4">
            {t.story.heading}
          </h2>
          <p className="text-base sm:text-lg text-[#555f6d] leading-relaxed font-light">
            {t.story.desc}
          </p>
        </div>

        {/* Parallax Cinematic Story Stream */}
        <div className="flex flex-col gap-20 sm:gap-28 lg:gap-32">
          {t.story.scenes.map((scene, index) => {
            const isEven = index % 2 === 0;
            const isRoomScene = scene.id === "rooms";
            const sceneImages = "images" in scene ? scene.images : [scene.image];
            const activeImageIndex = isRoomScene
              ? roomImageIndex % sceneImages.length
              : 0;

            return (
              <div
                key={scene.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
              >
                {/* Visual Frame */}
                <div
                  className={`lg:col-span-7 relative ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div
                    className="relative h-[360px] sm:h-[460px] lg:h-[500px] rounded-[24px] overflow-hidden border border-[#dfd9cc] shadow-lg group"
                  >
                    <Image
                      src={sceneImages[activeImageIndex]}
                      alt={scene.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />

                    {isRoomScene && sceneImages.length > 1 && (
                      <>
                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-gradient-to-t from-black/55 to-transparent px-4 pb-4 pt-12">
                          <button
                            type="button"
                            onClick={() =>
                              setRoomImageIndex(
                                (roomImageIndex - 1 + sceneImages.length) % sceneImages.length,
                              )
                            }
                            aria-label={isEn ? "Previous room image" : "تصویر قبلی اتاق"}
                            title={isEn ? "Previous room image" : "تصویر قبلی اتاق"}
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/60 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-[#0494D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                          >
                            {isEn ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                          </button>

                          <div
                            className="font-estedad text-sm font-medium text-white"
                            aria-live="polite"
                          >
                            {activeImageIndex + 1} / {sceneImages.length}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setRoomImageIndex((roomImageIndex + 1) % sceneImages.length)
                            }
                            aria-label={isEn ? "Next room image" : "تصویر بعدی اتاق"}
                            title={isEn ? "Next room image" : "تصویر بعدی اتاق"}
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/60 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-[#0494D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                          >
                            {isEn ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Narrative Text */}
                <div
                  className={`lg:col-span-5 space-y-4 ${
                    isEn ? "text-left" : "text-right"
                  } ${isEven ? "lg:order-2" : "lg:order-1"}`}
                >
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#0494D6] tracking-tight leading-snug">
                    {scene.title}
                  </h3>

                  <p className="text-base sm:text-lg leading-8 text-[#555f6d] font-light">
                    {scene.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}

