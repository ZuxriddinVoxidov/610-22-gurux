"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GalleryItem } from "@/lib/types";

const positions = [
  { top: '10%', left: '15%', size: 180 },
  { top: '25%', left: '75%', size: 240 },
  { top: '60%', left: '10%', size: 150 },
  { top: '70%', left: '80%', size: 200 },
  { top: '5%', left: '50%', size: 130 },
  { top: '80%', left: '40%', size: 220 },
  { top: '40%', left: '85%', size: 160 },
  { top: '45%', left: '5%', size: 190 },
];

export default function FloatingBubbles({ items, title }: { items: GalleryItem[], title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [150, -250]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-150, 250]);
  const y3 = useTransform(scrollYProgress, [0, 1], [50, -150]);

  const images = items.filter(item => item.media_type === 'google_photos_photo' || item.media_type === 'image').slice(0, 8);

  if (images.length === 0) return null;

  return (
    <div ref={containerRef} className="relative w-full h-[80vh] md:h-[100vh] flex items-center justify-center overflow-hidden my-10 bg-[#0f172a] rounded-[3rem] border border-slate-800 shadow-2xl">
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0f172a] to-[#0f172a]"></div>
       
       <div className="relative z-20 text-center max-w-4xl px-4 pointer-events-none">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[7rem] font-black text-white leading-none tracking-tighter mix-blend-difference drop-shadow-lg"
          >
            {title}
          </motion.h2>
       </div>
       
       {images.map((item, i) => {
         const pos = positions[i % positions.length];
         const yTransform = i % 3 === 0 ? y1 : i % 2 === 0 ? y2 : y3;
         const imageUrl = item.media_url.includes('drive.google.com') ? `/api/proxy-image?url=${encodeURIComponent(item.media_url)}` : item.media_url;
         const currentSize = isMobile ? pos.size * 0.5 : pos.size;

         return (
           <motion.div
             key={item.id}
             style={{ y: yTransform }}
             className="absolute rounded-full overflow-hidden shadow-2xl border-[4px] md:border-[6px] border-[#0f172a] bg-slate-900 group"
             initial={{ top: pos.top, left: pos.left, width: 0, height: 0, opacity: 0 }}
             whileInView={{ 
                width: currentSize, 
                height: currentSize, 
                opacity: 1
             }}
             viewport={{ once: false, margin: "100px" }}
             transition={{ duration: 1, delay: i * 0.1, type: "spring", stiffness: 80, damping: 20 }}
           >
              <img 
                src={imageUrl} 
                className="w-full h-full object-cover saturate-50 group-hover:saturate-150 transition-all duration-700 group-hover:scale-110 cursor-pointer" 
                alt="Bubble memory"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
           </motion.div>
         )
       })}
    </div>
  )
}
