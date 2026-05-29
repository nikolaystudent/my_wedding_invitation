"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Marck_Script, Montserrat } from "next/font/google";
import { Heart, Volume2, VolumeX, Sparkles, Calendar, MapPin, Clock, ClipboardList } from "lucide-react";

// Load premium Google Fonts with Cyrillic support
const marck = Marck_Script({
  subsets: ["cyrillic", "latin"],
  weight: "400",
});

const montserrat = Montserrat({
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
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

  // Pre-calculated style transforms for 3D cinematic depth
  const bgTransformX = useTransform(smoothX, (v) => v * 35);
  const bgTransformY = useTransform(smoothY, (v) => v * 35);

  const coupleTransformX = useTransform(smoothX, (v) => v * -20);
  const coupleTransformY = useTransform(smoothY, (v) => v * -12);

  const cardTransformX = useTransform(smoothX, (v) => v * 12);
  const cardTransformY = useTransform(smoothY, (v) => v * 8);

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
    <div className={`w-full min-h-screen bg-[#FFFFFF] text-[#2F4F34] flex flex-col overflow-x-hidden selection:bg-[#F7D6E0] selection:text-[#2F4F34] ${montserrat.variable} font-sans relative`}>

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
      <div className="relative h-[100dvh] w-full overflow-hidden flex flex-col justify-between shrink-0 z-10 bg-transparent">

        {/* Header Navigation & Music Toggle */}
        <header className="relative w-full z-10 px-6 py-5 md:px-12 flex justify-between items-center bg-gradient-to-b from-[#FFFFFF]/40 to-transparent">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex items-center gap-2"
          >
            <div className="font-serif tracking-[0.25em] text-lg font-semibold text-[#2F4F34]">
              N <span className="text-[#A78BFA] font-sans italic">&</span> K
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={toggleAudio}
              className="relative p-3 rounded-full bg-white/60 backdrop-blur-md text-[#2F4F34] hover:text-[#2F4F34]/80 transition-all shadow-[0_4px_12px_rgba(47,79,52,0.06)] hover:scale-105 active:scale-95 group cursor-pointer"
              aria-label="Toggle ambient music"
            >
              {isPlaying ? (
                <Volume2 className="size-5 animate-pulse text-[#A78BFA]" />
              ) : (
                <VolumeX className="size-5 opacity-80 group-hover:opacity-100" />
              )}

              {isPlaying && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-end gap-[2px] h-3">
                  <span className="w-[2px] bg-[#2F4F34] animate-[bounce_0.8s_infinite_100ms] h-1"></span>
                  <span className="w-[2px] bg-[#2F4F34] animate-[bounce_0.8s_infinite_300ms] h-2"></span>
                  <span className="w-[2px] bg-[#2F4F34] animate-[bounce_0.8s_infinite_200ms] h-3"></span>
                  <span className="w-[2px] bg-[#2F4F34] animate-[bounce_0.8s_infinite_400ms] h-1"></span>
                </div>
              )}
            </button>
            <span className="hidden sm:inline-block text-[10px] tracking-[0.15em] font-semibold text-[#2F4F34]/70 uppercase">
              Включить музыку
            </span>
          </motion.div>
        </header>

        {/* Main Composition */}
        <main className="relative flex-grow flex items-center justify-center px-4 py-6 md:py-12">
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center justify-items-center">

            {/* LEFT SIDE: Air Invitation Layout */}
            <motion.div
              className="lg:col-span-6 w-full max-w-[480px] relative"
              style={{
                x: cardTransformX,
                y: cardTransformY,
              }}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
            >
              <div className="relative w-full flex flex-col items-center text-center px-2">

                {/* Category label */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-2 mb-4"
                >
                  <span className="w-6 h-[1px] bg-[#2F4F34]/30" />
                  <span className="text-[10px] md:text-xs tracking-[0.25em] font-semibold text-[#2F4F34] uppercase font-sans">
                    Приглашение на свадьбу
                  </span>
                  <span className="w-6 h-[1px] bg-[#2F4F34]/30" />
                </motion.div>

                {/* Calligraphy Names */}
                <div className={`${marck.className} font-serif leading-none tracking-normal py-1 mb-3`}>
                  <motion.h1
                    className="text-5xl md:text-6xl lg:text-7xl font-light text-[#2F4F34]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 1 }}
                  >
                    Николай
                  </motion.h1>

                  <motion.div
                    className="flex items-center justify-center my-1 text-[#2F4F34] drop-shadow-[0_0_4px_rgba(247,214,224,0.6)]"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9, type: "spring", stiffness: 100 }}
                  >
                    <Heart className="size-8 fill-[#F7D6E0]" strokeWidth={1.5} />
                  </motion.div>

                  <motion.h1
                    className="text-5xl md:text-6xl lg:text-7xl font-light text-[#2F4F34]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1, duration: 1 }}
                  >
                    Ксения
                  </motion.h1>
                </div>

                {/* Elegant divider */}
                <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#B9D7B5]/60 to-transparent my-3" />

                {/* Wedding Details */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                  className="flex flex-col gap-2 mb-6 font-sans text-[#2F4F34]/80"
                >
                  <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-medium">
                    <Calendar className="size-4 text-[#A78BFA]" />
                    <span>Воскресенье, 12 июля 2026</span>
                  </div>
                  <a
                    href="https://2gis.kz/almaty/firm/70000001061905620/77.011047%2C43.183159?m=77.011047%2C43.183159%2F16&immersive=on"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-xs md:text-sm font-medium text-[#2F4F34] hover:text-[#A78BFA] hover:underline transition-all duration-300 group/link"
                  >
                    <MapPin className="size-4 text-[#2F4F34] group-hover/link:scale-110 transition-transform" />
                    <span>Алматы, ресторан «La Terrassa»</span>
                  </a>
                </motion.div>

                {/* Countdown section */}
                <motion.div
                  className="w-full mb-7"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                >
                  <p className="text-[10px] md:text-xs tracking-[0.2em] font-semibold text-[#2F4F34]/60 uppercase mb-3 flex items-center justify-center gap-1">
                    <Clock className="size-3" /> До торжества осталось:
                  </p>
                  <div className="grid grid-cols-4 gap-2.5 w-full max-w-sm px-2 mx-auto">
                    {Object.entries(timeLeft).map(([unit, value]) => (
                      <div
                        key={unit}
                        className="flex flex-col items-center justify-center py-2.5 px-1.5 rounded-2xl bg-white/50 backdrop-blur-sm shadow-[0_4px_16px_rgba(47,79,52,0.03)]"
                      >
                        <span className="text-xl md:text-2xl font-bold font-serif text-[#2F4F34]">{value}</span>
                        <span className="text-[8px] md:text-[9px] uppercase tracking-wider text-[#2F4F34]/50 font-semibold">
                          {unit === "days" ? "дней" : unit === "hours" ? "часов" : unit === "minutes" ? "минут" : "секунд"}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Luxury Pastel CTA Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.7, type: "spring" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full max-w-sm px-2 mx-auto"
                >
                  <button
                    onClick={() => document.getElementById("details")?.scrollIntoView({ behavior: "smooth" })}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FFC6A7] via-[#FFE28A] to-[#CBB6F4] bg-[length:200%_auto] text-[#2F4F34] font-bold text-xs md:text-sm tracking-[0.2em] uppercase font-sans hover:bg-right transition-all duration-700 shadow-[0_6px_20px_rgba(203,182,244,0.3)] border border-[#FFFFFF]/40 relative overflow-hidden group cursor-pointer"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Открыть детали
                      <Heart className="size-4 fill-current group-hover:scale-125 transition-transform duration-300" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFFFFF]/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  </button>
                </motion.div>

              </div>
            </motion.div>

            {/* RIGHT SIDE: Borderless Photo */}
            <motion.div
              className="lg:col-span-6 w-full flex items-center justify-center relative select-none"
              style={{
                x: coupleTransformX,
                y: coupleTransformY,
              }}
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-[4/5] rounded-[40px] overflow-hidden shadow-[0_16px_40px_rgba(47,79,52,0.06)] group">
                <Image
                  src="/images/couple.png"
                  alt="Nikolai & Ksenia"
                  fill
                  priority
                  loading="eager"
                  sizes="(max-w-768px) 340px, 420px"
                  className="object-cover object-top filter contrast-[1.01] transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF]/80 via-transparent to-transparent opacity-95" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#F7D6E0]/15 via-transparent to-[#FFC6A7]/15 pointer-events-none" />

                <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center backdrop-blur-md bg-white/75 rounded-2xl p-3.5 shadow-sm">
                  <div className="text-left">
                    <p className="text-[10px] tracking-widest text-[#2F4F34] font-bold uppercase">Наша Любовь</p>
                    <p className="text-[8px] tracking-wider text-[#2F4F34]/60 uppercase">Снято летом 2025</p>
                  </div>
                  <div className="size-8 rounded-full bg-[#F7D6E0] flex items-center justify-center text-[#2F4F34] shadow-sm">
                    <Heart className="size-4 fill-[#2F4F34]" />
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 w-full h-full bg-[#FFE28A]/10 rounded-full blur-[80px] scale-90 -z-10 pointer-events-none" />
            </motion.div>

          </div>
        </main>

        {/* Footer / Scroll Indicator */}
        <footer className="relative w-full z-10 px-6 py-5 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-t from-[#FFFFFF]/40 to-transparent shrink-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="text-[9px] md:text-[10px] tracking-[0.25em] font-semibold text-[#2F4F34]/70 uppercase text-center sm:text-left mx-auto"
          >
            Мы рады разделить этот день с вами • 12.07.2026
          </motion.div>

          <motion.div
            onClick={() => document.getElementById("details")?.scrollIntoView({ behavior: "smooth" })}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <span className="text-[8px] md:text-[9px] tracking-[0.3em] font-semibold text-[#2F4F34]/60 uppercase group-hover:text-[#2F4F34]/80 transition-colors">
              Листайте вниз
            </span>
            <div className="w-5 h-8 rounded-full border border-[#2F4F34]/30 flex justify-center p-[3px]">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[#2F4F34]"
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        </footer>
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
          <span className="text-[10px] md:text-xs tracking-[0.3em] font-semibold text-[#2F4F34]/60 uppercase mb-3">
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
                <h3 className="text-2xl font-serif text-[#2F4F34] font-medium mb-3">Место проведения</h3>
                <p className="text-sm font-semibold text-[#2F4F34] mb-1">Ресторан «La Terrassa»</p>
                <p className="text-xs text-[#2F4F34]/80 leading-relaxed">
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
                className="inline-flex w-full py-3.5 px-6 rounded-2xl bg-white text-[#2F4F34] font-bold text-xs tracking-[0.15em] uppercase hover:bg-[#2F4F34] hover:text-white transition-all duration-300 shadow-sm items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Открыть карту 2ГИС</span>
                <MapPin className="size-4 group-hover:scale-110 transition-transform" />
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
                <h3 className="text-2xl font-serif text-[#2F4F34] font-medium mb-3">Программа дня</h3>

                {/* Timeline visual steps */}
                <div className="relative border-l-[1.5px] border-dashed border-[#B9D7B5]/80 ml-3.5 pl-6 space-y-6 mt-4">
                  {/* Event 1 */}
                  <div className="relative">
                    <div className="absolute -left-[30px] top-1 size-3 rounded-full bg-[#A78BFA] border-2 border-white shadow-sm" />
                    <span className="text-base font-bold font-serif text-[#2F4F34]">15:00</span>
                    <p className="text-xs font-bold text-[#2F4F34] mt-0.5">Начало церемонии венчания</p>
                    <p className="text-[10px] text-[#2F4F34]/60">Сбор гостей и торжественное венчание</p>
                  </div>
                  {/* Event 2 */}
                  <div className="relative">
                    <div className="absolute -left-[30px] top-1 size-3 rounded-full bg-[#FFC6A7] border-2 border-white shadow-sm" />
                    <span className="text-base font-bold font-serif text-[#2F4F34]">16:00</span>
                    <p className="text-xs font-bold text-[#2F4F34] mt-0.5">Свадебный банкет</p>
                    <p className="text-[10px] text-[#2F4F34]/60">Ужин, поздравления и развлекательная программа</p>
                  </div>
                </div>

              </div>
            </div>
            {/* Blank placeholder footer for symmetry */}
            <div className="text-[10px] tracking-widest text-[#2F4F34]/50 uppercase font-semibold text-center mt-6">
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
                <h3 className="text-2xl font-serif text-[#2F4F34] font-medium mb-4">Пожелания для гостей</h3>

                <div className="space-y-5 text-xs text-[#2F4F34]/90 leading-relaxed">
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
                <h3 className="text-2xl font-serif text-[#2F4F34] font-medium mb-2">Дресс-код праздника</h3>
                <p className="text-xs text-[#2F4F34]/90 leading-relaxed">
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
                <div className="size-6 rounded-full bg-[#F7D6E0] border border-[#2F4F34]/10 shadow-[0_2px_8px_rgba(47,79,52,0.05)]" />
                <span className="text-[8px] font-bold text-[#2F4F34]/70"></span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="size-6 rounded-full bg-[#FFC6A7] border border-[#2F4F34]/10 shadow-[0_2px_8px_rgba(47,79,52,0.05)]" />
                <span className="text-[8px] font-bold text-[#2F4F34]/70"></span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="size-6 rounded-full bg-[#FFD29D] border border-[#2F4F34]/10 shadow-[0_2px_8px_rgba(47,79,52,0.05)]" />
                <span className="text-[8px] font-bold text-[#2F4F34]/70"></span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="size-6 rounded-full bg-[#CBB6F4] border border-[#2F4F34]/10 shadow-[0_2px_8px_rgba(47,79,52,0.05)]" />
                <span className="text-[8px] font-bold text-[#2F4F34]/70"></span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="size-6 rounded-full bg-[#FFE28A] border border-[#2F4F34]/10 shadow-[0_2px_8px_rgba(47,79,52,0.05)]" />
                <span className="text-[8px] font-bold text-[#2F4F34]/70"></span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="size-6 rounded-full bg-[#B9D7B5] border border-[#2F4F34]/10 shadow-[0_2px_8px_rgba(47,79,52,0.05)]" />
                <span className="text-[8px] font-bold text-[#2F4F34]/70"></span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="size-6 rounded-full bg-[#DD5025] border border-[#2F4F34]/10 shadow-[0_2px_8px_rgba(47,79,52,0.05)]" />
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
                <h3 className="text-2xl md:text-3xl font-serif text-[#2F4F34] font-medium mb-3">Подтверждение присутствия</h3>
                <p className="text-xs md:text-sm text-[#2F4F34]/70 max-w-lg mx-auto leading-relaxed mb-6">
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
                className="w-full max-w-sm py-4 px-8 rounded-2xl bg-gradient-to-r from-[#FFC6A7] via-[#FFE28A] to-[#CBB6F4] bg-[length:200%_auto] text-[#2F4F34] font-bold text-xs md:text-sm tracking-[0.2em] uppercase font-sans hover:bg-right transition-all duration-700 shadow-[0_6px_20px_rgba(203,182,244,0.3)] border border-[#FFFFFF]/40 relative overflow-hidden group cursor-pointer flex items-center justify-center gap-2.5"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Заполнить анкету
                  <Heart className="size-4 fill-current group-hover:scale-125 transition-transform duration-300" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFFFFF]/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              </motion.a>
            </div>
          </motion.div>


        </div>

        {/* Small bottom footer on Section 2 */}
        <div className="mt-20 text-[9px] tracking-[0.3em] font-semibold text-[#2F4F34]/40 uppercase text-center relative z-10">
          Николай & Ксения • 12 июля 2026
        </div>
      </section>

    </div>
  );
}
