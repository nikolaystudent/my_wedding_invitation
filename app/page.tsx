"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Marck_Script, Montserrat } from "next/font/google";
import { Heart, Volume2, VolumeX, Sparkles, Calendar, MapPin, Clock } from "lucide-react";

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
  const weddingDate = new Date("2026-07-12T15:00:00").getTime();

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

    // Desktop Mouse Parallax Event
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearInterval(timer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [weddingDate, mouseX, mouseY]);

  // Audio Toggle handler (using elegant loop instrumental sound helix URL)
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
  const bgTransformX = smoothX.get() * 35;
  const bgTransformY = smoothY.get() * 35;
  const coupleTransformX = smoothX.get() * -20;
  const coupleTransformY = smoothY.get() * -12;
  const cardTransformX = smoothX.get() * 12;
  const cardTransformY = smoothY.get() * 8;
  const particleTransformX = smoothX.get() * -45;
  const particleTransformY = smoothY.get() * -45;

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
    <div className={`relative min-h-[100dvh] w-full overflow-hidden bg-[#FFFFFF] text-[#2F4F34] flex flex-col justify-between selection:bg-[#F7D6E0] selection:text-[#2F4F34] ${montserrat.variable} font-sans`}>
      {/* 1. LAYER: Fullscreen Cinematic Background */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none scale-105"
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

      {/* 2. LAYER: Glowing Atmosphere Orbs (Dopamine Pastel Colors) */}
      <div className="absolute inset-0 z-1 overflow-hidden pointer-events-none">
        {/* Soft floating Lavender glow */}
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
        {/* Soft floating Peach glow */}
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
        {/* Soft floating Powder-Rose glow in middle */}
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

      {/* 3. LAYER: Twinkling Shimmering Stars (Pastel Shimmers) */}
      <motion.div
        className="absolute inset-0 z-2 pointer-events-none"
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

      {/* 4. LAYER: Header Navigation & Music Toggle */}
      <header className="relative w-full z-10 px-6 py-5 md:px-12 flex justify-between items-center bg-gradient-to-b from-[#FFFFFF]/60 to-transparent">
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

        {/* Music Control */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={toggleAudio}
            className="relative p-3 rounded-full bg-white/60 backdrop-blur-md text-[#2F4F34] hover:text-[#2F4F34]/80 transition-all shadow-[0_4px_12px_rgba(47,79,52,0.06)] hover:scale-105 active:scale-95 group"
            aria-label="Toggle ambient music"
          >
            {isPlaying ? (
              <Volume2 className="size-5 animate-pulse text-[#A78BFA]" />
            ) : (
              <VolumeX className="size-5 opacity-80 group-hover:opacity-100" />
            )}

            {/* Ambient Sound Wave Animation */}
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

      {/* 5. LAYER: Main Centered Composition */}
      <main className="relative flex-grow flex items-center justify-center z-5 px-4 py-6 md:py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center justify-items-center">

          {/* LEFT SIDE: Air Invitation Layout (Absolutely Borderless & Unified) */}
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
            {/* Unified and Borderless Content Wrapper */}
            <div className="relative w-full flex flex-col items-center text-center z-10 px-2">

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

                {/* Connecting Heart Icon with soft filled color */}
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
                  className="flex items-center justify-center gap-2 text-xs md:text-sm font-medium text-[#2F4F34] hover:text-[#A78BFA] hover:underline transition-all duration-300 group/link">
                  <MapPin className="size-4 text-[#2F4F34] group-hover/link:scale-110 transition-transform" />
                  <span>Алматы, ресторан «La Terrassa»</span>
                </a>
              </motion.div>

              {/* Countdown section (Clean & Ethereal) */}
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
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FFC6A7] via-[#FFE28A] to-[#CBB6F4] bg-[length:200%_auto] text-[#2F4F34] font-bold text-xs md:text-sm tracking-[0.2em] uppercase font-sans hover:bg-right transition-all duration-700 shadow-[0_6px_20px_rgba(203,182,244,0.3)] border border-[#FFFFFF]/40 relative overflow-hidden group cursor-pointer"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Подтвердить присутствие
                    <Heart className="size-4 fill-current group-hover:scale-125 transition-transform duration-300" />
                  </span>

                  {/* Subtle white sheen looping highlight */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFFFFF]/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                </button>
              </motion.div>

            </div>
          </motion.div>

          {/* RIGHT SIDE: Borderless & Organic Editorial Couple Image */}
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
            {/* Organic Unified Portrait Frame (NO BORDERS) */}
            <div className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-[4/5] rounded-[40px] overflow-hidden shadow-[0_16px_40px_rgba(47,79,52,0.06)] group">

              {/* Couple Cutout Asset with Next.js LCP optimization */}
              <Image
                src="/images/couple.png"
                alt="Nikolai & Ksenia"
                fill
                priority
                loading="eager"
                sizes="(max-w-768px) 340px, 420px"
                className="object-cover object-top filter contrast-[1.01] transition-transform duration-1000 group-hover:scale-105"
              />

              {/* Dynamic summer-garden gradients and masks */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF]/80 via-transparent to-transparent opacity-95" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#F7D6E0]/15 via-transparent to-[#FFC6A7]/15 pointer-events-none" />

              {/* Airy unified metadata label (No border box) */}
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

            {/* Glowing organic ambient halo underneath */}
            <div className="absolute inset-0 w-full h-full bg-[#FFE28A]/10 rounded-full blur-[80px] scale-90 -z-10 pointer-events-none" />
          </motion.div>

        </div>
      </main>

      {/* 6. LAYER: Footer / Scroll Indicator */}
      <footer className="relative w-full z-10 px-6 py-5 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-t from-[#FFFFFF]/60 to-transparent">

        {/* Short romantic phrase */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="text-[9px] md:text-[10px] tracking-[0.25em] font-semibold text-[#2F4F34]/70 uppercase text-center sm:text-left mx-auto"
        >
          Мы рады разделить этот день с вами • 12.07.2026
        </motion.div>

        {/* Animated Scroll Down Indicator */}
        <motion.div
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

      </footer >
    </div >
  );
}
