"use client";

import { motion } from 'framer-motion';
import { Student } from '@/lib/types';
import { Camera, Globe, Send } from 'lucide-react';
import BirthdayTimer from './BirthdayTimer';

type Props = {
  student: Student;
  onClick: (student: Student) => void;
};

export default function StudentCard({ student, onClick }: Props) {
  return (
    <motion.div
      layoutId={`card-${student.id}`}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 rounded-[1.75rem] p-5 md:p-6 cursor-pointer shadow-sm hover:shadow-[0_8px_40px_rgba(139,92,246,0.18)] dark:hover:shadow-[0_8px_40px_rgba(139,92,246,0.25)] transition-all duration-300 group relative flex flex-col items-center h-full"
      onClick={() => onClick(student)}
    >
      {/* Rasm — halqalar bilan */}
      <motion.div
        layoutId={`image-${student.id}`}
        className="relative w-32 h-32 md:w-40 md:h-40 rounded-full mb-5 mt-3 flex items-center justify-center group z-10 shrink-0"
      >
        {/* 3-qatlam tashqi */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="absolute inset-[-12px] rounded-full border-[2px] border-t-red-500 border-r-yellow-400 border-b-green-500 border-l-blue-500 shadow-[0_0_12px_rgba(239,68,68,0.6)] group-hover:shadow-[0_0_24px_rgba(239,68,68,0.9)] transition-shadow duration-500"
        />
        {/* 2-qatlam o'rta */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
          className="absolute inset-[-6px] rounded-full border-[2px] border-t-blue-500 border-r-indigo-500 border-b-purple-500 border-l-fuchsia-500 shadow-[0_0_12px_rgba(168,85,247,0.6)] group-hover:shadow-[0_0_24px_rgba(168,85,247,0.9)] transition-shadow duration-500"
        />
        {/* 1-qatlam ichki */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute inset-[0px] rounded-full border-[2px] border-t-fuchsia-500 border-r-rose-500 border-b-orange-400 border-l-yellow-400 shadow-[0_0_16px_rgba(236,72,153,0.7)] group-hover:shadow-[0_0_32px_rgba(236,72,153,1)] transition-shadow duration-500"
        />

        {/* Rasm */}
        <div className="absolute inset-[3px] rounded-full overflow-hidden z-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-inner">
          {student.photo_url ? (
            <img
              src={student.photo_url.includes('drive.google.com')
                ? `/api/proxy-image?url=${encodeURIComponent(student.photo_url)}`
                : student.photo_url}
              alt={`${student.last_name} ${student.first_name}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-100 to-pink-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-violet-500 dark:text-slate-300 text-3xl font-black">
              {student.first_name[0]}{student.last_name[0]}
            </div>
          )}
        </div>
      </motion.div>

      {/* Ism */}
      <div className="text-center w-full">
        <motion.h3
          layoutId={`name-${student.id}`}
          className="text-lg md:text-xl font-black text-slate-800 dark:text-white leading-tight"
        >
          {student.last_name} {student.first_name}
        </motion.h3>

        {student.address && (
          <p className="text-xs text-slate-500 dark:text-slate-450 mt-1.5 truncate max-w-full px-1">
            {student.address}
          </p>
        )}
      </div>

      {/* Ijtimoiy tarmoqlar */}
      {(student.social_links?.telegram || student.social_links?.instagram || student.social_links?.linkedin) && (
        <div className="flex gap-3 mt-3 text-slate-400 dark:text-slate-500">
          {student.social_links?.telegram && (
            <Send className="w-3.5 h-3.5 hover:text-blue-500 transition-colors" />
          )}
          {student.social_links?.instagram && (
            <Camera className="w-3.5 h-3.5 hover:text-pink-500 transition-colors" />
          )}
          {student.social_links?.linkedin && (
            <Globe className="w-3.5 h-3.5 hover:text-blue-700 transition-colors" />
          )}
        </div>
      )}

      {/* Bo'sh joy — taymer har doim pastda qolsin */}
      <div className="flex-1" />

      {/* Tug'ilgan kun taymeri */}
      {student.birth_date && (
        <div className="w-full mt-1">
          <BirthdayTimer birthDate={student.birth_date} compact />
        </div>
      )}
    </motion.div>
  );
}
