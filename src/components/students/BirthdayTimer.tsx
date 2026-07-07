"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  birthDate: string; // "YYYY-MM-DD"
  compact?: boolean;
};

function getNextBirthday(birthDate: string) {
  const today = new Date();
  const birth = new Date(birthDate);
  const next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (next <= today) next.setFullYear(today.getFullYear() + 1);
  return next;
}

function isBirthdayToday(birthDate: string): boolean {
  const today = new Date();
  const birth = new Date(birthDate);
  return today.getMonth() === birth.getMonth() && today.getDate() === birth.getDate();
}

function getTimeLeft(targetDate: Date) {
  const diff = targetDate.getTime() - Date.now();
  if (diff <= 0) return null;
  const totalSec = Math.floor(diff / 1000);
  const totalDays = Math.floor(totalSec / 86400);
  const months = Math.floor(totalDays / 30.44);
  const days = Math.floor(totalDays % 30.44);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { months, days, hours, minutes, seconds };
}

// Konfetti
function Confetti() {
  const colors = ["#f97316","#ec4899","#8b5cf6","#06b6d4","#22c55e","#eab308","#ef4444"];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-3 rounded-sm"
          style={{ left: `${(i / 20) * 100}%`, backgroundColor: colors[i % colors.length], top: "-10px" }}
          animate={{ y: ["0vh", "110%"], rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)], opacity: [1, 1, 0] }}
          transition={{ duration: 2.5 + (i % 3), repeat: Infinity, delay: (i * 0.15) % 2.5, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

// Bitta raqam katakchasi
function TimeBox({ value, label, color }: { value: number; label: string; color: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
      <AnimatePresence mode="wait">
        <motion.div
          key={display}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-base text-white shadow-lg ${color}`}
        >
          {display}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Bitta raqam katakchasi — compact
function TimeBoxCompact({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-400 leading-none">{label}</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={display}
          initial={{ y: -4, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 4, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="text-white font-black text-sm leading-none bg-white/10 rounded-md px-1.5 py-1 min-w-[26px] text-center"
        >
          {display}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default function BirthdayTimer({ birthDate, compact = false }: Props) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null);
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    const tick = () => {
      const today = isBirthdayToday(birthDate);
      setIsToday(today);
      if (!today) setTimeLeft(getTimeLeft(getNextBirthday(birthDate)));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [birthDate]);

  // 🎉 Bayram kuni
  if (isToday) {
    return (
      <div className={`relative ${compact ? "mt-3" : "mt-5"} rounded-2xl overflow-hidden`}>
        <Confetti />
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className={`relative z-10 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-pink-500/30 ${
            compact ? "py-2 px-3" : "py-3 px-5"
          }`}
        >
          <span className={compact ? "text-sm" : "text-xl"}>🎂</span>
          <span className={`font-black text-white ${compact ? "text-xs" : "text-base"}`}>
            Bugun Tug'ilgan Kun!
          </span>
          <span className={compact ? "text-sm" : "text-xl"}>🎉</span>
        </motion.div>
      </div>
    );
  }

  if (!timeLeft) return null;

  // ── COMPACT (karta uchun) ──────────────────────────────────────────
  if (compact) {
    return (
      <div className="mt-3 rounded-xl border border-white/10 bg-slate-900/70 backdrop-blur-sm px-3 py-2.5">
        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2 text-center">
          🎂 Tug'ilgan kunga
        </p>
        <div className="flex items-end justify-center gap-1">
          <TimeBoxCompact value={timeLeft.months} label="Oy" />
          <span className="text-slate-500 font-bold text-sm pb-1">:</span>
          <TimeBoxCompact value={timeLeft.days} label="Kun" />
          <span className="text-slate-500 font-bold text-sm pb-1">:</span>
          <TimeBoxCompact value={timeLeft.hours} label="Soat" />
          <span className="text-slate-500 font-bold text-sm pb-1">:</span>
          <TimeBoxCompact value={timeLeft.minutes} label="Daqiqa" />
          <span className="text-slate-500 font-bold text-sm pb-1">:</span>
          <TimeBoxCompact value={timeLeft.seconds} label="Soniya" />
        </div>
      </div>
    );
  }

  // ── FULL (modal uchun) ────────────────────────────────────────────
  const units = [
    { label: "Oy",     value: timeLeft.months,  color: "bg-gradient-to-b from-fuchsia-500 to-pink-600 shadow-fuchsia-500/40" },
    { label: "Kun",    value: timeLeft.days,     color: "bg-gradient-to-b from-orange-500 to-amber-500 shadow-orange-500/40" },
    { label: "Soat",   value: timeLeft.hours,    color: "bg-gradient-to-b from-violet-500 to-indigo-600 shadow-violet-500/40" },
    { label: "Daqiqa", value: timeLeft.minutes,  color: "bg-gradient-to-b from-cyan-500 to-blue-600 shadow-cyan-500/40" },
    { label: "Soniya", value: timeLeft.seconds,  color: "bg-gradient-to-b from-emerald-500 to-teal-600 shadow-emerald-500/40" },
  ];

  // Tug'ilgan sanani YYYY.MM.DD formatida ko'rsatish
  const formattedBirthDate = birthDate ? birthDate.replaceAll("-", ".") : "";

  return (
    <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-900/50 p-4">
      <div className="flex flex-col items-center mb-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          🎂 Tug'ilgan kunga qoldi
        </p>
        <p className="text-sm font-semibold text-pink-400 mt-1">
          {formattedBirthDate}
        </p>
      </div>
      <div className="flex items-end justify-center gap-1.5">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-end gap-1.5">
            <TimeBox value={u.value} label={u.label} color={u.color} />
            {i < units.length - 1 && (
              <span className="text-slate-500 font-black text-lg pb-2 leading-none select-none">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
