"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { GalleryItem } from '@/lib/types';
import { Loader2, Link as LinkIcon, Film, ImagePlus, Image as ImageIcon } from 'lucide-react';
import SplitGalleryHero from '@/components/gallery/SplitGalleryHero';
import FloatingBubbles from '@/components/gallery/FloatingBubbles';
import { Timeline } from '@/components/ui/Timeline';

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setItems(data);
      }
      setLoading(false);
    };
    fetchGallery();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-32 pb-20 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-pink-500" />
      </div>
    );
  }

  // Helper function to render a grid of items
  const renderGrid = (gridItems: GalleryItem[]) => {
    if (gridItems.length === 0) return null;
    return (
      <div className="columns-1 sm:columns-2 gap-4 space-y-4">
        {gridItems.map((item, index) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            key={item.id}
            className="break-inside-avoid relative rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 bg-slate-900 aspect-square flex items-center justify-center border border-slate-800"
          >
            {item.media_type === 'google_photos' ? (
              <a href={item.media_url} target="_blank" rel="noreferrer" className="block w-full h-full relative">
                <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-6 text-center">
                  <ImageIcon className="w-12 h-12 mb-4 text-blue-500 drop-shadow-sm transition-transform group-hover:scale-110" />
                  <h3 className="font-bold text-lg text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {item.title || 'Albom'}
                  </h3>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-800 text-blue-400 px-3 py-1.5 rounded-full shadow-sm">
                    Ochish <LinkIcon className="w-3 h-3" />
                  </span>
                </div>
              </a>
            ) : item.media_type === 'google_photos_photo' ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
                <img 
                  src={`/api/proxy-image?url=${encodeURIComponent(item.media_url)}`} 
                  alt={item.title || 'Rasm'} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute top-3 right-3 z-20">
                  <a href={item.media_url} target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-bold p-2 rounded-full flex items-center justify-center transition-colors">
                    <ImagePlus className="w-4 h-4" />
                  </a>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none">
                  <h3 className="text-white font-bold text-base mb-1">{item.title || 'Rasm'}</h3>
                </div>
              </>
            ) : item.media_type === 'video' ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
                <video 
                  src={item.media_url} 
                  controls 
                  className="absolute inset-0 w-full h-full object-cover bg-black transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute top-3 left-3 z-20 pointer-events-none">
                  <span className="bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 border border-white/10">
                    <Film className="w-3 h-3" /> VIDEO
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none">
                  <h3 className="text-white font-bold text-base mb-1">{item.title || 'Video'}</h3>
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
                <img src={item.media_url} alt={item.title || 'Xotira'} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none">
                  <h3 className="text-white font-bold text-base mb-1">{item.title || 'Xotira'}</h3>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  // Group items into dynamic chronological sections based on the course property (4-Kurs to 1-Kurs)
  const timelineData: any[] = [];
  
  [4, 3, 2, 1].forEach(courseNum => {
    const chunk = items.filter(i => i.course === courseNum);
    if (chunk.length > 0) {
      timelineData.push({
        title: `${courseNum}-Kurs`,
        content: (
          <div className="flex flex-col gap-20 w-full pb-20">
             {renderGrid(chunk)}
             <FloatingBubbles items={chunk} title={`${courseNum}-Kurs Lahzalari`} />
          </div>
        ),
      });
    }
  });

  return (
    <main className="min-h-screen bg-[#050505]">
      {/* Split Hero (Kononenko Inspired) */}
      <SplitGalleryHero items={items} />

      {/* Aceternity UI Timeline */}
      {items.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <div className="py-20 bg-slate-900/50 rounded-3xl border border-slate-800 shadow-sm backdrop-blur-sm">
            <p className="text-xl text-slate-400">Hozircha xotiralar yuklanmagan 📸</p>
          </div>
        </div>
      ) : (
        <Timeline data={timelineData} />
      )}
    </main>
  );
}
