"use client";

import Link from 'next/link';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4">
      <div className="space-y-6">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 pb-2 h-32 flex items-center justify-center">
          <TypeAnimation
            sequence={[
              '610-22 guruh oilasi',
              2000, // Waits 2s
              '',
              500, // Waits 0.5s before repeating
            ]}
            wrapper="span"
            cursor={true}
            repeat={Infinity}
          />
        </h1>
        <p className="text-xl md:text-2xl font-medium text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed bg-white/50 dark:bg-slate-800/50 p-6 rounded-2xl backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm">
          "Ushbu guruh talabalariga kursdoshlari haqida ma'lumot va birga o'tgan shirin xotiralarini eslatib turishi uchun Zuxriddin tomonidan yaratilgan maxsus esdalik sayti!"
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Link 
          href="/students" 
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg hover:shadow-blue-500/25 hover:scale-105"
        >
          Kursdoshlar <ArrowRight className="w-5 h-5" />
        </Link>
        <Link 
          href="/gallery" 
          className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-8 py-4 rounded-full text-lg font-bold transition-all hover:scale-105 hover:shadow-md"
        >
          <ImageIcon className="w-5 h-5" /> Xotiralar burchagi
        </Link>
      </div>
    </div>
  );
}
