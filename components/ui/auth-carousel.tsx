"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, 
  Globe, 
  ShieldCheck, 
  LayoutDashboard, 
  ChevronLeft, 
  ChevronRight,
  QrCode,
  CheckCircle2,
  Activity,
  Scan,
  TrendingUp,
  Boxes,
  Sparkles
} from "lucide-react";

// ==========================================
// 1. Rive-Style Scene: Multi-Platform (App & Web)
// ==========================================
function SceneMultiPlatform() {
  return (
    <div className="relative h-48 sm:h-52 w-full flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-950/60 via-slate-900/80 to-slate-950/90 border border-indigo-500/20 p-4">
      {/* Grid glow background */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#818cf8 1px, transparent 1px)",
          backgroundSize: "16px 16px"
        }}
      />
      
      {/* Floating Ambient Ring */}
      <motion.div 
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute h-36 w-36 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none"
      />

      <div className="relative z-10 flex items-center justify-center gap-4 sm:gap-6 w-full max-w-xs">
        {/* Smartphone Device Mockup */}
        <motion.div 
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex flex-col items-center w-24 h-36 rounded-2xl bg-slate-900 border-2 border-indigo-400/40 shadow-xl shadow-indigo-950/50 p-2 overflow-hidden"
        >
          {/* Speaker pill */}
          <div className="w-6 h-1 rounded-full bg-slate-700 mb-2" />
          
          {/* Screen Content */}
          <div className="w-full flex-1 rounded-lg bg-indigo-950/70 border border-indigo-500/30 p-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[7px] font-bold text-indigo-300">SIMS App</span>
              <Smartphone className="h-2.5 w-2.5 text-indigo-400" />
            </div>
            
            {/* Animated Pinjam Card */}
            <motion.div 
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="rounded bg-indigo-600/60 p-1 text-center"
            >
              <span className="text-[6px] font-bold text-white block">Ajukan Peminjaman</span>
            </motion.div>

            {/* QR Icon */}
            <div className="flex justify-center">
              <QrCode className="h-4 w-4 text-indigo-300" />
            </div>
          </div>
        </motion.div>

        {/* Sync / Data Stream Wave */}
        <div className="flex flex-col items-center gap-1">
          <motion.div 
            animate={{ x: [-8, 8, -8], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-1 text-indigo-400 font-mono text-[9px] font-bold"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-300 animate-spin" style={{ animationDuration: "3s" }} />
          </motion.div>
          <span className="text-[8px] font-bold tracking-wider uppercase text-indigo-300/80 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-400/20">
            Realtime Sync
          </span>
        </div>

        {/* Web Browser Mockup */}
        <motion.div 
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex flex-col w-28 h-36 rounded-2xl bg-slate-900 border-2 border-sky-400/40 shadow-xl shadow-sky-950/50 p-2 overflow-hidden"
        >
          {/* Browser Header Dots */}
          <div className="flex items-center gap-1 mb-2 pb-1 border-b border-slate-800">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[6px] font-mono text-slate-400 ml-auto">sims.scitech.id</span>
          </div>

          {/* Screen Content */}
          <div className="w-full flex-1 rounded-lg bg-sky-950/60 border border-sky-500/30 p-1.5 flex flex-col justify-between">
            <div className="flex items-center gap-1">
              <Globe className="h-2.5 w-2.5 text-sky-400" />
              <span className="text-[7px] font-bold text-sky-300">Web Portal</span>
            </div>

            <div className="space-y-1">
              <div className="h-2 w-full rounded bg-sky-500/20" />
              <div className="h-2 w-3/4 rounded bg-sky-500/30" />
            </div>

            <div className="flex items-center justify-between text-[6px] text-sky-300 font-bold bg-sky-600/40 px-1.5 py-0.5 rounded">
              <span>Form Peminjaman</span>
              <CheckCircle2 className="h-2 w-2 text-emerald-400" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ==========================================
// 2. Rive-Style Scene: Admin Verification Scanner
// ==========================================
function SceneAdminVerification() {
  return (
    <div className="relative h-48 sm:h-52 w-full flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-sky-950/60 via-slate-900/80 to-slate-950/90 border border-sky-500/20 p-4">
      {/* Ambient glow */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute h-40 w-40 rounded-full bg-sky-500/20 blur-2xl pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Central Physical Inspection Box with Scanning Beam */}
        <div className="relative flex items-center justify-center h-28 w-44 rounded-2xl bg-slate-900 border-2 border-sky-400/40 shadow-xl shadow-sky-950/60 overflow-hidden">
          {/* Laser Scanner Beam Moving Top-to-Bottom */}
          <motion.div 
            animate={{ y: [-48, 48, -48] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_12px_#38bdf8] z-20"
          />

          {/* Instrument Asset Icon */}
          <div className="flex flex-col items-center gap-1 text-sky-200">
            <Boxes className="h-8 w-8 text-sky-400" />
            <span className="text-[9px] font-bold text-slate-300">Pengecekan Fisik Unit</span>
          </div>

          {/* Corner scan brackets */}
          <Scan className="absolute top-2 left-2 h-3.5 w-3.5 text-sky-400" />
          <Scan className="absolute bottom-2 right-2 h-3.5 w-3.5 text-sky-400 rotate-180" />
        </div>

        {/* Verification Status Badge with Pulse Checkmark */}
        <motion.div 
          animate={{ scale: [0.96, 1.04, 0.96] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-950/80 px-3.5 py-1 text-xs font-semibold text-emerald-300 shadow-md shadow-emerald-950/50"
        >
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Verifikasi & Konfirmasi Admin</span>
        </motion.div>
      </div>
    </div>
  );
}

// ==========================================
// 3. Rive-Style Scene: Live Monitoring Dashboard
// ==========================================
function SceneLiveMonitoring() {
  return (
    <div className="relative h-48 sm:h-52 w-full flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-950/60 via-slate-900/80 to-slate-950/90 border border-emerald-500/20 p-4">
      {/* Ambient background glow */}
      <motion.div 
        animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.55, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute h-40 w-40 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-xs space-y-3">
        {/* Main Dashboard Card */}
        <div className="w-full rounded-2xl bg-slate-900 border-2 border-emerald-400/40 p-3 shadow-xl shadow-emerald-950/60 space-y-2.5">
          {/* Header with Live Signal */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[10px] font-bold text-white">Dashboard Monitoring</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[8px] font-bold text-emerald-300 border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE
            </span>
          </div>

          {/* Animated Bar & Line Chart Columns */}
          <div className="flex items-end justify-between gap-1.5 h-14 pt-2 px-2 bg-emerald-950/40 rounded-xl border border-emerald-500/20">
            {[40, 75, 55, 90, 65, 85, 100].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: "20%" }}
                animate={{ height: [`${Math.max(20, height - 30)}%`, `${height}%`, `${Math.max(20, height - 15)}%`] }}
                transition={{ duration: 1.8 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                className="w-full rounded-t bg-gradient-to-t from-emerald-600 to-emerald-400"
              />
            ))}
          </div>

          {/* Status Metrics Bar */}
          <div className="flex items-center justify-between text-[8px] font-bold text-slate-300 pt-0.5 px-1">
            <span className="flex items-center gap-1 text-emerald-300">
              <TrendingUp className="h-2.5 w-2.5" /> 100% Tercatat
            </span>
            <span className="text-slate-400 font-mono">Real-time Telemetry</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Slide Definitions
// ==========================================
interface Slide {
  id: number;
  tag: string;
  title: string;
  description: string;
  SceneComponent: React.ComponentType;
}

const slides: Slide[] = [
  {
    id: 1,
    tag: "01 • PROSEDUR PEMINJAMAN",
    title: "Peminjaman Melalui Aplikasi & Web",
    description: "Setiap peminjaman alat laboratorium harus diajukan secara resmi melalui aplikasi mobile maupun web portal sebelum unit barang digunakan.",
    SceneComponent: SceneMultiPlatform
  },
  {
    id: 2,
    tag: "02 • KONTROL & INTEGRITAS",
    title: "Pengembalian Menunggu Verifikasi Admin",
    description: "Setiap barang yang selesai digunakan harus dilaporkan segera dan wajib menunggu verifikasi fisik staf admin untuk konfirmasi kelengkapan.",
    SceneComponent: SceneAdminVerification
  },
  {
    id: 3,
    tag: "03 • MONITORING TERPUSAT",
    title: "Setiap Pencatatan Dimonitoring di Dashboard",
    description: "Seluruh riwayat transaksi, status aset, dan aktivitas logistik dipantau secara langsung dan transparan melalui dashboard admin.",
    SceneComponent: SceneLiveMonitoring
  }
];

export function AuthCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  // Auto slide every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const activeSlide = slides[current];
  const ActiveScene = activeSlide.SceneComponent;

  return (
    <div 
      className="hidden lg:flex flex-col justify-between p-8 xl:p-10 bg-[#070b16] text-white relative overflow-hidden select-none border-l border-slate-800/80"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-sky-600/10 blur-[100px] pointer-events-none" />

      {/* Top Bar: Brand & Step Number */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-mono font-bold tracking-widest text-slate-300 uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Scitech Academy
        </div>
        <span className="text-xs font-mono font-bold text-slate-400">
          0{current + 1} / 0{slides.length}
        </span>
      </div>

      {/* Center Animated Carousel Content */}
      <div className="relative z-10 my-auto py-3">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeSlide.id}
            custom={direction}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="space-y-5"
          >
            {/* Rich Interactive Motion Illustration Scene */}
            <ActiveScene />

            {/* Slide Text Content */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold tracking-wider text-indigo-400 uppercase">
                {activeSlide.tag}
              </span>
              <h3 className="text-xl xl:text-2xl font-bold tracking-tight text-white leading-snug">
                {activeSlide.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed max-w-md">
                {activeSlide.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls: Material 3 Pill Indicators & Nav Buttons */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
        {/* Pagination Dots / Progress Pill */}
        <div className="flex items-center gap-2">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === current 
                  ? "w-8 bg-indigo-400" 
                  : "w-2 bg-slate-700 hover:bg-slate-500"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Prev / Next Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextSlide}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
