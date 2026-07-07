"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryItem } from '@/lib/types';

type Props = {
  items: GalleryItem[];
};

export default function HeroSlider({ items }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter items to only include photos that can be displayed as backgrounds
  const slideItems = items.filter(
    (item) => item.media_type === 'google_photos_photo' || item.media_type === 'image'
  );

  useEffect(() => {
    if (slideItems.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideItems.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [slideItems.length]);

  if (slideItems.length === 0) return null;

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] bg-slate-900 overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.15 }} // Ken Burns zoom in effect
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.5 },
            scale: { duration: 8, ease: 'linear' }, // Slow zoom over 8 seconds
          }}
          className="absolute inset-0"
        >
          <img
            src={slideItems[currentIndex].media_url.includes('drive.google.com') ? `/api/proxy-image?url=${encodeURIComponent(slideItems[currentIndex].media_url)}` : slideItems[currentIndex].media_url}
            alt="Gallery Slide"
            className="w-full h-full object-cover opacity-50"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center px-4"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-6 drop-shadow-lg">
            Xotiralar Galereyasi
          </h1>
          <p className="text-white/90 md:text-xl max-w-2xl mx-auto drop-shadow-md">
            Bizning eng yorqin, eng quvnoq va unutilmas damlarimiz jamlanmasi. Bu yerda arxiv rasm va videolar saqlanadi.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
