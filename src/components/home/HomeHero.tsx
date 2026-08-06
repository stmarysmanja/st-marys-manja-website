"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface HeroSlide {
  id: number;
  imageUrl: string;
  altText: string | null;
  mediaType: string;
  title?: string | null;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
}

interface Props {
  slides: HeroSlide[];
  heroTitle: string;
  heroSubtitle: string;
  centreCode: string;
  admissionsText: string;
  admissionsLink: string;
  whatsappNumber: string;
}

export default function HomeHero({
  slides,
  heroTitle,
  heroSubtitle,
  centreCode,
  admissionsText,
  admissionsLink,
  whatsappNumber,
}: Props) {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const touchStart = useRef<number | null>(null);

  const next = useCallback(() => {
    if (slides.length) setCurrent((value) => (value + 1) % slides.length);
  }, [slides.length]);

  const previous = useCallback(() => {
    if (slides.length) {
      setCurrent((value) => (value - 1 + slides.length) % slides.length);
    }
  }, [slides.length]);

  useEffect(() => {
    if (!playing || slides.length <= 1) return;
    const timer = window.setInterval(next, 6500);
    return () => window.clearInterval(timer);
  }, [next, playing, slides.length]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, previous]);

  const active = slides[current];
  const title = active?.title?.trim() || heroTitle;
  const subtitle = active?.subtitle?.trim() || heroSubtitle;
  const buttonText = active?.buttonText?.trim() || admissionsText;
  const buttonLink = active?.buttonLink?.trim() || admissionsLink;

  return (
    <section
      className="group/hero relative flex min-h-[82vh] items-center overflow-hidden bg-[#08296f]"
      onMouseEnter={() => setPlaying(false)}
      onMouseLeave={() => setPlaying(true)}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const end = event.changedTouches[0]?.clientX ?? touchStart.current;
        const difference = touchStart.current - end;
        if (difference > 55) next();
        if (difference < -55) previous();
        touchStart.current = null;
      }}
    >
      {slides.length ? (
        slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-[1600ms] ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          >
            {slide.mediaType === "video" ? (
              <video
                src={slide.imageUrl}
                muted
                loop
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className={`h-full w-full bg-cover bg-center ${
                  index === current
                    ? "animate-[heroKenBurns_8s_ease-out_forwards]"
                    : ""
                }`}
                style={{ backgroundImage: `url("${slide.imageUrl}")` }}
              />
            )}
          </div>
        ))
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#08296f] via-[#2453d4] to-[#6f99ff]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-[#041b50]/92 via-[#08296f]/62 to-[#08296f]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20 text-center text-white lg:text-left">
        <div
          key={`badge-${current}`}
          className="relative mx-auto mb-6 h-32 w-24 animate-[heroFadeDown_.8s_ease-out] overflow-hidden rounded-2xl bg-white shadow-2xl ring-4 ring-white/25 lg:mx-0"
        >
          <Image
            src="/branding/school-badge.png"
            alt="School badge"
            fill
            priority
            sizes="96px"
            className="object-contain p-2"
          />
        </div>

        <p
          key={`code-${current}`}
          className="mx-auto w-fit animate-[heroFadeUp_.8s_.05s_both] rounded-full border border-white/25 bg-white/10 px-5 py-2 text-xs font-extrabold uppercase tracking-[0.2em] backdrop-blur-md lg:mx-0"
        >
          UNEB Centre Code: {centreCode}
        </p>

        <h1
          key={`title-${current}`}
          className="mt-5 max-w-4xl animate-[heroFadeUp_.85s_.12s_both] text-4xl font-black uppercase leading-tight tracking-tight drop-shadow-2xl md:text-6xl lg:text-7xl"
        >
          {title}
        </h1>

        <p
          key={`subtitle-${current}`}
          className="mx-auto mt-5 max-w-2xl animate-[heroFadeUp_.9s_.22s_both] text-lg leading-8 text-blue-50 md:text-2xl lg:mx-0"
        >
          {subtitle}
        </p>

        <div
          key={`buttons-${current}`}
          className="mt-8 flex animate-[heroFadeUp_.9s_.32s_both] flex-col justify-center gap-4 sm:flex-row lg:justify-start"
        >
          <Link
            href={buttonLink}
            className="rounded-xl bg-white px-7 py-4 font-extrabold text-[#08296f] shadow-xl transition hover:-translate-y-1 hover:bg-blue-100"
          >
            {buttonText} →
          </Link>
          <Link
            href="/academics"
            className="rounded-xl border border-white/35 bg-white/10 px-7 py-4 font-extrabold text-white backdrop-blur-md transition hover:-translate-y-1 hover:bg-white hover:text-[#08296f]"
          >
            Explore Our School
          </Link>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={previous}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-black/20 p-3 text-white opacity-0 backdrop-blur transition hover:bg-white hover:text-[#08296f] group-hover/hero:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={next}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-black/20 p-3 text-white opacity-0 backdrop-blur transition hover:bg-white hover:text-[#08296f] group-hover/hero:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/20 bg-black/20 px-4 py-3 backdrop-blur-md">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrent(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === current ? "w-9 bg-white" : "w-2.5 bg-white/45"
                }`}
                aria-label={`Show slide ${index + 1}`}
              />
            ))}
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              className="ml-1 text-white"
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes heroKenBurns {
          from { transform: scale(1); }
          to { transform: scale(1.12); }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeDown {
          from { opacity: 0; transform: translateY(-24px) scale(.94); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="animate-"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
