"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryItem } from "@/lib/types";

export default function SplitGalleryHero({ items }: { items: GalleryItem[] }) {
  const images = items.filter(item => item.media_type === 'google_photos_photo' || item.media_type === 'image');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images]);

  if (images.length === 0) return null;

  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 lg:px-16 pt-20 pb-12 lg:pt-28 lg:pb-16 bg-[#0f172a] gap-8 lg:gap-12">
      <div className="w-full lg:w-1/2 z-10 flex flex-col justify-center">
         <motion.h1 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="text-4xl sm:text-6xl lg:text-[7rem] font-black text-white mb-4 lg:mb-6 leading-none tracking-tighter"
         >
           Xotiralar<br/>
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Galereyasi</span>
         </motion.h1>
         <motion.p 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="text-lg sm:text-xl text-slate-400 font-light max-w-lg mt-2 lg:mt-4"
         >
           Bizning bosib o'tgan yo'limiz, darslar, tadbirlar va eng shirin talabalik lahzalarimiz jamlanmasi.
         </motion.p>
      </div>
      <motion.div 
         initial={{ opacity: 0, scale: 0.95, x: 20 }}
         animate={{ opacity: 1, scale: 1, x: 0 }}
         transition={{ duration: 1, delay: 0.4 }}
         className="w-full lg:w-1/2 h-[300px] sm:h-[450px] lg:h-[600px] relative rounded-[2rem] overflow-hidden shadow-2xl border border-slate-800"
      >
         <AnimatePresence mode="wait">
            <motion.img 
               key={currentIndex}
               src={images[currentIndex].media_url.includes('drive.google.com') ? `/api/proxy-image?url=${encodeURIComponent(images[currentIndex].media_url)}` : images[currentIndex].media_url}
               initial={{ opacity: 0, scale: 1.05 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 1.2, ease: "easeInOut" }}
               className="absolute inset-0 w-full h-full object-cover"
               alt="Gallery Slide"
            />
         </AnimatePresence>
         
         <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-80" />
      </motion.div>
    </div>
  )
}
