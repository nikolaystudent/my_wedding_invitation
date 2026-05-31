"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Marck_Script, Caveat } from "next/font/google";
import { Heart, Volume2, VolumeX, Sparkles, MapPin, Clock, ClipboardList } from "lucide-react";

// Load premium Google Fonts with Cyrillic support
const marck = Marck_Script({
  subsets: ["cyrillic", "latin"],
  weight: "400",
});

const caveat = Caveat({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"]
});

// Simple interface for countdown
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Mouse Parallax coordinates (normalized to range -0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for parallax lag effect
  const springConfig = { damping: 30, stiffness: 80 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Set the wedding date: July 12, 2026 at 15:00
  const weddingDate = new Date(2026, 6, 12, 15, 0, 0).getTime();

  useEffect(() => {
    setMounted(true);

    // Dynamic Countdown Timer logic
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = weddingDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    // Desktop Mouse Parallax Event (Touch-safe fallback)
    const isTouchDevice = typeof window !== "undefined" && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    if (!isTouchDevice) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      clearInterval(timer);
      if (!isTouchDevice) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [weddingDate, mouseX, mouseY]);

  // Audio Toggle handler
  const toggleAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/music/backgroundMusic.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.15;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.log("Audio play prevented:", err));
    }
    setIsPlaying(!isPlaying);
  };

  // Style transforms for fixed background parallax
  const bgTransformX = useTransform(smoothX, (v) => v * 35);
  const bgTransformY = useTransform(smoothY, (v) => v * 35);

  const particleTransformX = useTransform(smoothX, (v) => v * -45);
  const particleTransformY = useTransform(smoothY, (v) => v * -45);

  // Twinkling stars properties
  const sparklesArray = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${15 + (i * 7) % 75}%`,
    top: `${10 + (i * 11) % 80}%`,
    scale: 0.4 + (i % 3) * 0.3,
    delay: i * 0.4,
    duration: 3 + (i % 4),
  }));

  if (!mounted) return null;

  return (
    <div className={`w-full min-h-screen bg-[#FFFFFF] text-[#2F4F34] flex flex-col overflow-x-hidden selection:bg-[#F7D6E0] selection:text-[#2F4F34] ${caveat.className} font-sans relative`}>

      {/* ================= FIXED ROOT LAYERS (BACKGROUNDS & PARTICLES) ================= */}

      {/* 1. LAYER: Fixed Fullscreen Parallax Background */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none scale-105"
        style={{
          x: bgTransformX,
          y: bgTransformY,
        }}
        initial={{ opacity: 0, scale: 1.15 }}
        animate={{ opacity: 1, scale: 1.05 }}
        transition={{ duration: 2.2, ease: "easeOut" }}
      >
        <Image
          src="/images/background.jpg"
          alt="Ethereal summer wedding backdrop"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.93] contrast-[0.98] saturate-[0.92]"
        />
        {/* Soft elegant summer white-pastel overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF] via-[#FFFFFF]/35 to-[#FFFFFF]/60" />
      </motion.div>

      {/* 2. LAYER: Fixed Glowing Atmosphere Orbs */}
      <div className="fixed inset-0 z-1 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-[#CBB6F4]/30 blur-[80px] md:blur-[120px]"
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -70, 40, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "5%", left: "-12%" }}
        />
        <motion.div
          className="absolute w-[320px] md:w-[500px] h-[320px] md:h-[500px] rounded-full bg-[#FFC6A7]/30 blur-[80px] md:blur-[100px]"
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 50, -30, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ bottom: "8%", right: "-12%" }}
        />
        <motion.div
          className="absolute w-[280px] md:w-[450px] h-[280px] md:h-[450px] rounded-full bg-[#F7D6E0]/40 blur-[90px] md:blur-[110px]"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, 40, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "35%", right: "15%" }}
        />
      </div>

      {/* 3. LAYER: Fixed Twinkling Shimmering Stars */}
      <motion.div
        className="fixed inset-0 z-2 pointer-events-none"
        style={{
          x: particleTransformX,
          y: particleTransformY,
        }}
      >
        {sparklesArray.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute text-[#A78BFA]/50"
            style={{
              left: sparkle.left,
              top: sparkle.top,
            }}
            initial={{ opacity: 0.1, scale: 0 }}
            animate={{
              opacity: [0.15, 0.7, 0.15],
              scale: [sparkle.scale * 0.8, sparkle.scale * 1.2, sparkle.scale * 0.8],
              y: [0, -20, 0],
            }}
            transition={{
              duration: sparkle.duration,
              repeat: Infinity,
              delay: sparkle.delay,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="size-4 md:size-6 drop-shadow-[0_0_6px_rgba(203,182,244,0.4)]" />
          </motion.div>
        ))}
      </motion.div>

      {/* ================= CONTENT LAYERS ================= */}

      {/* ================= HERO SECTION (SCREEN 1) ================= */}
      <div className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between shrink-0 z-10 bg-transparent">

        {/* Header: Music Toggle only */}
        <header className="relative w-full z-10 px-6 py-5 md:px-12 flex justify-end items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex items-center gap-3"
          >
            <span className="hidden sm:inline-block text-base tracking-[0.15em] font-semibold text-[#BF93E2] uppercase drop-shadow">
              Включить музыку
            </span>
            <button
              onClick={toggleAudio}
              className="relative p-3 rounded-full bg-[#BF93E2] backdrop-blur-md text-white hover:bg-[#BF93E2] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 group cursor-pointer border border-white/20"
              aria-label="Toggle ambient music"
            >
              {isPlaying ? (
                <Volume2 className="size-5 animate-pulse text-white" />
              ) : (
                <VolumeX className="size-5 opacity-80 group-hover:opacity-100" />
              )}
              {isPlaying && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-end gap-[2px] h-3">
                  <span className="w-[2px] bg-white animate-[bounce_0.8s_infinite_100ms] h-1"></span>
                  <span className="w-[2px] bg-white animate-[bounce_0.8s_infinite_300ms] h-2"></span>
                  <span className="w-[2px] bg-white animate-[bounce_0.8s_infinite_200ms] h-3"></span>
                  <span className="w-[2px] bg-white animate-[bounce_0.8s_infinite_400ms] h-1"></span>
                </div>
              )}
            </button>
          </motion.div>
        </header>

        {/* Bottom: Countdown + CTA Button */}
        <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 gap-5">

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="w-full flex justify-center"
          >
            <Image
              src="/images/title.PNG"
              alt="Свадебное приглашение"
              width={800}
              height={250}
              priority
              className="w-full max-w-[600px] h-auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="w-full flex justify-center"
          >
            <Image
              src="/images/couple.png"
              alt="Nikolai & Ksenia"
              width={700}
              height={900}
              priority
              className="w-auto h-[50vh] sm:h-[60vh] md:h-[70vh] -mt-10"
            />
          </motion.div>

          {/* Countdown */}
          <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.9 }}
          >
            <p className="text-base md:text-xs tracking-[0.2em] font-semibold text-[#2F4F34]/80 uppercase mb-3 flex items-center justify-center gap-1 drop-shadow">
              <Clock className="size-3" /> До торжества осталось:
            </p>
            <div className="grid grid-cols-4 gap-2.5 mx-auto">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div
                  key={unit}
                  className="flex flex-col items-center justify-center py-2.5 px-1.5 rounded-2xl bg-[#F7D6E0]/30 backdrop-blur-md border border-[#BF93E2]/20"
                >
                  <span className="text-xl md:text-2xl font-bold font-serif text-[#BF93E2] drop-shadow">{value}</span>
                  <span className="text-[8px] md:text-[9px] uppercase tracking-wider text-[#BF93E2] font-semibold">
                    {unit === "days" ? "дней" : unit === "hours" ? "часов" : unit === "minutes" ? "минут" : "секунд"}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, type: "spring" }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full max-w-sm"
          >
            <Image
              src="/images/get_details.PNG"
              alt="Открыть детали"
              width={320}
              height={80}
              className="w-full h-auto cursor-pointer"
              onClick={() =>
                document.getElementById("details")?.scrollIntoView({ behavior: "smooth" })
              }
            />
          </motion.div>
        </main>
      </div>

      {/* ================= DETAILS SECTION (SCREEN 2) ================= */}

      <section
        id="details"
        className="relative w-full min-h-screen py-24 px-6 md:px-12 flex flex-col items-center justify-start bg-transparent text-[#2F4F34] z-10 scroll-mt-0"
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1 }}
          className="text-center max-w-2xl relative z-10 flex flex-col items-center mb-16"
        >
          <span className="text-base md:text-xs tracking-[0.3em] font-semibold text-[#2F4F34]/60 uppercase mb-3">
            Важная информация
          </span>
          <h2 className={`${marck.className} text-4xl md:text-5xl font-light text-[#2F4F34] leading-tight`}>
            Приглашаем вас разделить нашу радость
          </h2>
          <div className="w-20 h-[1.5px] bg-[#B9D7B5] mt-6" />
        </motion.div>

        {/* Responsive Grid layout */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 relative z-10">

          {/* CARD 1: Локация (Location) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="rounded-[32px] bg-[#F7D6E0]/20 backdrop-blur-sm p-8 flex flex-col justify-between shadow-[0_12px_36px_rgba(47,79,52,0.02)] min-h-[360px]"
          >
            <div className="flex flex-col gap-5">
              <div className="size-12 rounded-full bg-white/70 flex items-center justify-center text-[#2F4F34] shadow-sm">
                <MapPin className="size-6" />
              </div>
              <div>
                <h3 className="text-4xl md:text-4xl text-[#2F4F34] font-medium mb-3">Место проведения</h3>
                <p className="text-2xl font-semibold text-[#2F4F34] mb-1">Ресторан «La Terrassa»</p>
                <p className="text-xl text-[#2F4F34]/80 leading-relaxed">
                  улица Керей-Жанибек хандар, 452<br />
                  Медеуский район, Алматы, 050020/A26T8D1
                </p>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="https://2gis.kz/almaty/firm/70000001061905620/77.011047%2C43.183159?m=77.011047%2C43.183159%2F16&immersive=on"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/images/open_2gis.PNG"
                  alt="Открыть карту"
                  width={320}
                  height={80}
                  className="w-full h-auto"
                />
              </a>
            </div>
          </motion.div>

          {/* CARD 2: Тайминги (Timing) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-[32px] bg-[#CBB6F4]/20 backdrop-blur-sm p-8 flex flex-col justify-between shadow-[0_12px_36px_rgba(47,79,52,0.02)] min-h-[360px]"
          >
            <div className="flex flex-col gap-5">
              <div className="size-12 rounded-full bg-white/70 flex items-center justify-center text-[#2F4F34] shadow-sm">
                <Clock className="size-6" />
              </div>
              <div>
                <h3 className="text-4xl md:text-4xl text-[#2F4F34] font-medium mb-3">Программа дня</h3>

                {/* Timeline visual steps */}
                <div className="relative border-l-[1.5px] border-dashed border-[#B9D7B5]/80 ml-3.5 pl-6 space-y-6 mt-4">
                  {/* Event 1 */}
                  <div className="relative">
                    <div className="absolute -left-[30px] top-1 size-3 rounded-full bg-[#A78BFA] border-2 border-white shadow-sm" />
                    <span className="text-xl font-bold font-serif text-[#2F4F34]">15:00</span>
                    <p className="text-2xl font-bold text-[#2F4F34] mt-0.5">Начало церемонии венчания</p>
                    <p className="text-xl text-[#2F4F34]/60">Сбор гостей и торжественное венчание</p>
                  </div>
                  {/* Event 2 */}
                  <div className="relative">
                    <div className="absolute -left-[30px] top-1 size-3 rounded-full bg-[#FFC6A7] border-2 border-white shadow-sm" />
                    <span className="text-xl font-bold font-serif text-[#2F4F34]">16:00</span>
                    <p className="text-2xl font-bold text-[#2F4F34] mt-0.5">Свадебный банкет</p>
                    <p className="text-xl text-[#2F4F34]/60">Ужин, поздравления и развлекательная программа</p>
                  </div>
                </div>

              </div>
            </div>
            {/* Blank placeholder footer for symmetry */}
            <div className="base tracking-widest text-[#2F4F34]/50 uppercase font-semibold text-center mt-6">
              Воскресенье • 12.07.2026
            </div>
          </motion.div>

          {/* CARD 3: Пожелания (Wishes) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="rounded-[32px] bg-[#FFD29D]/20 backdrop-blur-sm p-8 flex flex-col justify-start shadow-[0_12px_36px_rgba(47,79,52,0.02)] min-h-[380px]"
          >
            <div className="flex flex-col gap-5">
              <div className="size-12 rounded-full bg-white/70 flex items-center justify-center text-[#2F4F34] shadow-sm">
                <Heart className="size-6 fill-[#2F4F34]/10" />
              </div>
              <div>
                <h3 className="text-4xl md:text-4xl text-[#2F4F34] font-medium mb-4">Пожелания для гостей</h3>

                <div className="space-y-5 text-xl text-[#2F4F34]/90 leading-relaxed">
                  <div className="flex gap-3 items-start">
                    <span className="text-lg">🎁</span>
                    <p>
                      Ваше присутствие для нас — огромная радость! А если вы захотите сделать подарок, будем искренне благодарны за поддержку наших семейных начинаний.
                    </p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="text-lg">👶</span>
                    <p>
                      Нам важно, чтобы этот вечер стал для вас особенным! Поэтому предлагаем вам провести его в кругу взрослых, а заботу о детях доверить вашим близким.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

          {/* CARD 4: Дресс-код (Dress Code & Color Reference) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="rounded-[32px] bg-[#FFE28A]/20 backdrop-blur-sm p-8 flex flex-col justify-between shadow-[0_12px_36px_rgba(47,79,52,0.02)] min-h-[380px]"
          >
            <div className="flex flex-col gap-4">
              <div className="size-12 rounded-full bg-white/70 flex items-center justify-center text-[#2F4F34] shadow-sm">
                <Sparkles className="size-6" />
              </div>
              <div>
                <h3 className="text-4xl md:text-4xl text-[#2F4F34] font-medium mb-2">Дресс-код праздника</h3>
                <p className="text-xl text-[#2F4F34]/90 leading-relaxed">
                  Мы хотим, чтобы наш праздник ассоциировался с летом, радостью и любовью! Ваш образ может стать частью этой картины, будем рады, если вы выберете наряды в этой цветовой палитре:
                </p>
              </div>
            </div>

            {/* Dress code visual palette image */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mt-4 shadow-[0_4px_16px_rgba(47,79,52,0.04)]">
              <Image
                src="/images/color-reference.jpg"
                alt="Wedding Dress Code Reference Colors"
                fill
                sizes="500px"
                className="object-cover object-center"
              />
            </div>

            {/* Pastel Circle Color Swatches */}
            <div className="flex flex-wrap gap-2.5 justify-center mt-5">
              <div className="flex flex-col items-center gap-1">
                <div className="size-8 rounded-full bg-[#F7D6E0] border border-[#2F4F34]/10 shadow-[0_2px_8px_rgba(47,79,52,0.05)]" />
                <span className="text-[8px] font-bold text-[#2F4F34]/70"></span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="size-8 rounded-full bg-[#FFC6A7] border border-[#2F4F34]/10 shadow-[0_2px_8px_rgba(47,79,52,0.05)]" />
                <span className="text-[8px] font-bold text-[#2F4F34]/70"></span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="size-8 rounded-full bg-[#FFD29D] border border-[#2F4F34]/10 shadow-[0_2px_8px_rgba(47,79,52,0.05)]" />
                <span className="text-[8px] font-bold text-[#2F4F34]/70"></span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="size-8 rounded-full bg-[#CBB6F4] border border-[#2F4F34]/10 shadow-[0_2px_8px_rgba(47,79,52,0.05)]" />
                <span className="text-[8px] font-bold text-[#2F4F34]/70"></span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="size-8 rounded-full bg-[#FFE28A] border border-[#2F4F34]/10 shadow-[0_2px_8px_rgba(47,79,52,0.05)]" />
                <span className="text-[8px] font-bold text-[#2F4F34]/70"></span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="size-8 rounded-full bg-[#B9D7B5] border border-[#2F4F34]/10 shadow-[0_2px_8px_rgba(47,79,52,0.05)]" />
                <span className="text-[8px] font-bold text-[#2F4F34]/70"></span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="size-8 rounded-full bg-[#DD5025] border border-[#2F4F34]/10 shadow-[0_2px_8px_rgba(47,79,52,0.05)]" />
                <span className="text-[8px] font-bold text-[#2F4F34]/70"></span>
              </div>
            </div>
          </motion.div>

          {/* CARD 5: Анкета гостей / RSVP (External Link) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="md:col-span-2 rounded-[32px] bg-white/40 backdrop-blur-md p-8 md:p-12 flex flex-col items-center text-center shadow-[0_16px_48px_rgba(47,79,52,0.04)] border border-white/60 w-full"
          >
            <div className="flex flex-col gap-5 items-center max-w-2xl">
              <div className="size-14 rounded-full bg-white/70 flex items-center justify-center text-[#2F4F34] shadow-sm relative group">
                <ClipboardList className="size-6 text-[#A78BFA] group-hover:scale-110 transition-transform duration-300" />
                <span className="absolute inset-0 rounded-full bg-[#A78BFA]/10 animate-ping opacity-75 pointer-events-none" />
              </div>

              <div>
                <h3 className="text-4xl md:text-4xl md:text-3xl text-[#2F4F34] font-medium mb-3">Подтверждение присутствия</h3>
                <p className="text-xl md:text-xl text-[#2F4F34]/70 max-w-lg mx-auto leading-relaxed mb-6">
                  Пожалуйста, уделите пару минут и заполните свадебную анкету гостя. Ваши ответы помогут нам сделать этот день максимально радостным и комфортным для каждого!
                </p>
              </div>

              {/* Luxury Pastel CTA Button to External Google Form */}
              <motion.a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeOKkh5QPm64EeusUNUMVn2HV7Pq38Y0PTXOQHgcgH-ZfJCvw/viewform?usp=header"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image
                  src="/images/fill_out_form.PNG"
                  alt="Заполнить анкету"
                  width={320}
                  height={80}
                  className="w-full h-auto"
                />
              </motion.a>
            </div>
          </motion.div>


        </div>

        {/* Small bottom footer on Section 2 */}
        <div className="mt-20 text-[12px] tracking-[0.3em] font-semibold text-[#2F4F34]/40 uppercase text-center relative z-10">
          Николай & Ксения • 12 июля 2026
        </div>
      </section>

    </div>
  );
}
