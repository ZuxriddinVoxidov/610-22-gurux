"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { GalleryItem } from "@/lib/types";

// ── Vaqt hisoblash ────────────────────────────────────────────────────────────
function getElapsed(fromDate: Date) {
  const now = Date.now();
  const from = fromDate.getTime();
  if (now < from) return null; // hali boshlanmagan

  let diff = Math.floor((now - from) / 1000);

  const years = Math.floor(diff / (365.25 * 86400));
  diff -= years * Math.floor(365.25 * 86400);
  const months = Math.floor(diff / (30.44 * 86400));
  diff -= months * Math.floor(30.44 * 86400);
  const days = Math.floor(diff / 86400);
  diff -= days * 86400;
  const hours = Math.floor(diff / 3600);
  diff -= hours * 3600;
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;

  return { years, months, days, hours, minutes, seconds };
}

// ── Bitta raqam katakchasi ────────────────────────────────────────────────────
function TimerBlock({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-white/40">
        {label}
      </p>
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={display}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="min-w-[64px] sm:min-w-[80px] md:min-w-[100px] text-center text-3xl sm:text-5xl md:text-6xl font-black text-white tabular-nums py-3 sm:py-4 px-2 rounded-2xl bg-white/10 border border-white/20 shadow-xl backdrop-blur-sm"
          >
            {display}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Ajratgich ─────────────────────────────────────────────────────────────────
function Separator() {
  return (
    <div className="hidden md:flex flex-col gap-2 pb-3 self-end">
      <motion.span
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="text-white/50 font-black text-3xl sm:text-5xl leading-none select-none"
      >
        :
      </motion.span>
    </div>
  );
}

// ── Asosiy sahifa ─────────────────────────────────────────────────────────────
export default function TimeCapsulePage() {
  const [elapsed, setElapsed] = useState<ReturnType<typeof getElapsed>>(null);
  const [graduationDate, setGraduationDate] = useState<Date | null>(null);
  const [bgImages, setBgImages] = useState<string[]>([]);
  const [bgIndex, setBgIndex] = useState(0);
  const supabase = createClient();

  // Bitiruv sanasini va fon rasmlarini yukla
  useEffect(() => {
    // Sana
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "graduation_date")
      .single()
      .then(({ data }) => {
        if (data?.value) setGraduationDate(new Date(data.value));
      });

    // Fon rasmlari
    supabase
      .from("gallery")
      .select("media_url, media_type")
      .in("media_type", ["google_photos_photo", "image"])
      .limit(20)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const urls = data.map((item: Pick<GalleryItem, "media_url" | "media_type">) =>
            item.media_url.includes("drive.google.com")
              ? `/api/proxy-image?url=${encodeURIComponent(item.media_url)}`
              : item.media_url
          );
          setBgImages(urls);
        }
      });
  }, []);

  // Slaydshou
  useEffect(() => {
    if (bgImages.length < 2) return;
    const id = setInterval(() => {
      setBgIndex((i) => (i + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [bgImages]);

  // Taymer
  useEffect(() => {
    if (!graduationDate) return;
    const id = setInterval(() => {
      setElapsed(getElapsed(graduationDate));
    }, 1000);
    setElapsed(getElapsed(graduationDate));
    return () => clearInterval(id);
  }, [graduationDate]);

  const units = elapsed
    ? [
        { label: "Yil",     value: elapsed.years },
        { label: "Oy",      value: elapsed.months },
        { label: "Kun",     value: elapsed.days },
        { label: "Soat",    value: elapsed.hours },
        { label: "Daqiqa",  value: elapsed.minutes },
        { label: "Soniya",  value: elapsed.seconds },
      ]
    : [];

  return (
    <div className="fixed inset-0 overflow-hidden flex items-center justify-center">

      {/* ── Fon slaydshou ── */}
      <AnimatePresence>
        {bgImages.length > 0 && (
          <motion.img
            key={bgIndex}
            src={bgImages[bgIndex]}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
            alt="bg"
          />
        )}
      </AnimatePresence>

      {/* ── Qora overlay ── */}
      <div className="absolute inset-0 bg-black/45" />

      {/* ── Markaziy kontent ── */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">

        {/* Sarlavha */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-2"
        >
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-white/40">
            610-22 Guruhimiz bitirganimizdan beri
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-none tracking-tighter">
            O'tgan <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-violet-400">Vaqtimiz</span>
          </h1>
        </motion.div>

        {/* Taymer */}
        {elapsed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-3 gap-y-6 gap-x-3 md:flex md:flex-wrap items-center justify-center md:items-end md:gap-3"
          >
            {units.map((u, i) => (
              <div key={u.label} className="flex items-center justify-center md:items-end gap-2 md:gap-3">
                <TimerBlock value={u.value} label={u.label} />
                {i < units.length - 1 && <Separator />}
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="text-white/50 text-lg animate-pulse">Yuklanmoqda...</div>
        )}

        {/* Taggi matn */}
        {graduationDate && (() => {
          const dd = String(graduationDate.getDate()).padStart(2, '0');
          const mm = String(graduationDate.getMonth() + 1).padStart(2, '0');
          const yyyy = graduationDate.getFullYear();
          const formattedDate = `${dd}.${mm}.${yyyy}`;
          return (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-white/35 text-xs sm:text-sm font-bold"
            >
              Bitiruv sanasi: {formattedDate}
            </motion.p>
          );
        })()}
      </div>
    </div>
  );
}
