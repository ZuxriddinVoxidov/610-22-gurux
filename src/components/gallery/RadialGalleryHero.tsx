"use client";

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { GalleryItem } from '@/lib/types';

type Props = {
  items: GalleryItem[];
};

export default function RadialGalleryHero({ items }: Props) {
  const containerRef = useRef(null);

  // Filter items to only include photos for the orbit
  const slideItems = items.filter(
    (item) => item.media_type === 'google_photos_photo' || item.media_type === 'image' || item.media_type === 'google_photos'
  );

  // Take up to 10 items to form a perfect circle
  const radialItems = slideItems.slice(0, 10);

  if (radialItems.length === 0) return null;

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[100vh] bg-[#050505] overflow-hidden flex items-center justify-center"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-[#050505] to-[#050505] opacity-60"></div>
      
      {/* Central Text (Kononenko Style) */}
      <div className="relative z-20 text-center pointer-events-none flex flex-col items-center justify-center scale-90 md:scale-100">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-7xl md:text-[9rem] font-black tracking-tighter text-white leading-none mix-blend-difference drop-shadow-lg"
        >
          2022
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-3xl md:text-5xl font-light text-slate-300 tracking-tight mt-2"
        >
          Year of Foundation
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-slate-500 mt-6 max-w-sm text-sm uppercase tracking-widest font-semibold"
        >
          Eng quvnoq va yorqin xotiralar markazi
        </motion.p>
      </div>

      {/* Orbiting Radial Images */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] rounded-full flex items-center justify-center z-10 pointer-events-none"
      >
        {radialItems.map((item, index) => {
          const angle = (index / radialItems.length) * 360;
          const imageUrl = item.media_url.includes('drive.google.com') ? `/api/proxy-image?url=${encodeURIComponent(item.media_url)}` : item.media_url;

          return (
            <motion.div
              key={item.id}
              className="absolute origin-bottom w-32 h-44 md:w-48 md:h-64 rounded-xl overflow-hidden shadow-2xl border border-white/10 group pointer-events-auto cursor-pointer"
              style={{
                // Rotate to position, then move outwards by radius, then orient
                transform: `rotate(${angle}deg) translateY(calc(-40vw))`, // Dynamic translateY based on viewport
              }}
              whileHover={{ scale: 1.15, zIndex: 50, transition: { duration: 0.3 } }}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img
                src={imageUrl}
                alt="Gallery Slide"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 saturate-50 group-hover:saturate-100"
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
