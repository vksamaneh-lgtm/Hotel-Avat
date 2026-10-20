"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX, ChevronRight, ChevronLeft, X, Film } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { hotelConfig } from "@/config/hotel.config";

export function ReelsSection() {
  const { language } = useLanguage();
  const t = translations[language];
  const isEn = language === "en";

  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const stories = t.reels.items;
  const activeStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  useEffect(() => {
    setIsPlaying(true);
    setProgress(0);
    setVideoError(false);
  }, [activeStoryIndex]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    if (total > 0) {
      setProgress((current / total) * 100);
    }
  };

  const nextStory = () => {
    if (activeStoryIndex === null) return;
    setActiveStoryIndex((activeStoryIndex + 1) % stories.length);
  };

  const prevStory = () => {
    if (activeStoryIndex === null) return;
    setActiveStoryIndex((activeStoryIndex - 1 + stories.length) % stories.length);
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const cardWidth = 300;
    const offset = direction === "left" ? -cardWidth : cardWidth;
    carouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section id="reels" className="py-10 md:py-14 relative overflow-hidden">
      {/* Pure Carousel Container with navigation controls */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header row with Instagram channel link */}
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-xs sm:text-sm font-bold text-[#0494D6] tracking-tight">
            {isEn ? "Avat Hotel Video Stories" : "ویدیوهای هتل آوات"}
          </span>

          <a
            href={hotelConfig.contact.social.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 hover:bg-white text-[#0494D6] hover:text-[#E1306C] border border-[#dfd9cc] text-xs font-semibold shadow-2xs transition-all hover:scale-105 cursor-pointer"
          >
            <InstagramIcon className="w-3.5 h-3.5 text-[#E1306C]" />
            <span dir="ltr">{hotelConfig.contact.social.instagramHandle}</span>
          </a>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={() => scrollCarousel(isEn ? "left" : "right")}
          aria-label={t.reels.prev}
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-[#0494D6] backdrop-blur-md border border-[#dfd9cc] items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg hover:shadow-xl cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <button
          onClick={() => scrollCarousel(isEn ? "right" : "left")}
          aria-label={t.reels.next}
          className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-[#0494D6] backdrop-blur-md border border-[#dfd9cc] items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg hover:shadow-xl cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Video Stories Horizontal Carousel */}
        <div
          ref={carouselRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth py-2 px-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]"
        >
          {stories.map((story, index) => (
            <div
              key={story.id}
              onClick={() => setActiveStoryIndex(index)}
              className="group relative flex-shrink-0 w-[240px] sm:w-[270px] lg:w-[290px] aspect-[9/16] rounded-[24px] overflow-hidden bg-[#0494D6] border border-[#dfd9cc]/70 hover:border-[#8c7b64] shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1.5 snap-start"
            >
              {/* Poster Image */}
              <Image
                src={story.poster}
                alt={story.caption}
                fill
                sizes="(max-width: 640px) 240px, (max-width: 1024px) 270px, 290px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Bottom Scrim for Caption Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity group-hover:from-black/90" />

              {/* Center Play Button Indicator */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-[#0494D6]/90 group-hover:border-white">
                  <Play className="w-6 h-6 text-white fill-white translate-x-0.5" />
                </div>
              </div>

              {/* Only Caption on Video */}
              <div className={`absolute bottom-0 inset-x-0 p-5 z-10 ${isEn ? "text-left" : "text-right"}`}>
                <p className="text-sm sm:text-base font-medium text-white drop-shadow-md leading-relaxed line-clamp-2 group-hover:text-[#93c5fd] transition-colors">
                  {story.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-Screen Vertical Video Player Modal */}
      {activeStory && (
        <Dialog open={activeStoryIndex !== null} onOpenChange={(open) => !open && setActiveStoryIndex(null)}>
          <DialogContent
            className="sm:max-w-[430px] w-[95vw] h-[85vh] max-h-[780px] p-0 bg-black border border-white/20 text-white rounded-[28px] overflow-hidden shadow-2xl flex flex-col justify-between"
            aria-describedby={undefined}
          >
            <DialogTitle className="sr-only">{activeStory.caption}</DialogTitle>

            {/* Video Container */}
            <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden select-none">
              {/* Native Video Element */}
              <video
                ref={videoRef}
                src={activeStory.videoSrc}
                poster={activeStory.poster}
                playsInline
                autoPlay
                loop
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onError={() => setVideoError(true)}
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
              />

              {/* Interactive Fallback if local MP4 is pending */}
              {videoError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/80 backdrop-blur-sm z-20">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-3">
                    <Film className="w-7 h-7 text-[#60a5fa]" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2 max-w-xs">{activeStory.caption}</h4>
                  <p className="text-xs text-white/70 mb-3 max-w-xs leading-5">
                    {t.reels.videoPending}
                  </p>
                  <code className="bg-white/10 text-[#93c5fd] px-3 py-1 rounded-lg text-xs font-mono mb-3 text-ltr" dir="ltr">
                    public{activeStory.videoSrc}
                  </code>
                </div>
              )}

              {/* Top & Bottom Ambient Gradients */}
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />

              {/* Top Controls Bar */}
              <div className="absolute top-0 inset-x-0 p-4 z-30 flex flex-col gap-3">
                {/* Timeline Progress */}
                <div className="w-full h-1 bg-white/25 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-150 ease-linear rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <a
                    href={hotelConfig.contact.social.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:opacity-85 transition-opacity group cursor-pointer"
                    title={`Instagram: ${hotelConfig.contact.social.instagramHandle}`}
                  >
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-white relative border border-white/30">
                      <Image src="/images/avat-logo.jpg" alt="Logo" fill sizes="28px" className="object-contain" />
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-xs font-bold text-white drop-shadow leading-tight">{t.reels.hotelTitle}</span>
                      <span className="text-[10px] text-white/70 group-hover:underline leading-tight" dir="ltr">{hotelConfig.contact.social.instagramHandle}</span>
                    </div>
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                      title={isMuted ? t.reels.unmute : t.reels.mute}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setActiveStoryIndex(null)}
                      className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Prev / Next Buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  isEn ? prevStory() : prevStory();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all z-20 cursor-pointer"
                title={t.reels.prev}
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  isEn ? nextStory() : nextStory();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all z-20 cursor-pointer"
                title={t.reels.next}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Center Play Icon when paused */}
              {!isPlaying && !videoError && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center z-20 bg-black/30 cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-2xl">
                    <Play className="w-8 h-8 fill-current translate-x-[-1px]" />
                  </div>
                </div>
              )}

              {/* Bottom Caption in Modal */}
              <div className={`absolute bottom-0 inset-x-0 p-5 z-30 space-y-2 pointer-events-auto ${isEn ? "text-left" : "text-right"}`}>
                <p className="text-base font-bold text-white drop-shadow leading-relaxed">
                  {activeStory.caption}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs text-white/60 border-t border-white/15">
                  <button
                    onClick={togglePlay}
                    className="flex items-center gap-1.5 text-white/90 hover:text-white cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isPlaying ? t.reels.pause : t.reels.play}</span>
                  </button>

                  <span className="text-[11px] text-white/50">
                    {(activeStoryIndex ?? 0) + 1} {t.reels.of} {stories.length}
                  </span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}

