"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Student } from '@/lib/types';
import StudentCard from '@/components/students/StudentCard';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Phone, MapPin, Quote, Smartphone, Send, Camera, Globe } from 'lucide-react';
import BirthdayTimer from '@/components/students/BirthdayTimer';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('first_name', { ascending: true });
        
      if (!error && data) {
        const sortedData = [...data];
        const zIndex = sortedData.findIndex(
          s => s.first_name.trim().toLowerCase().includes("zuxriddin") ||
               s.last_name.trim().toLowerCase().includes("zuxriddin")
        );
        if (zIndex > -1) {
          const [zuxriddin] = sortedData.splice(zIndex, 1);
          sortedData.unshift(zuxriddin);
        }
        setStudents(sortedData);
      }
      setLoading(false);
    };

    fetchStudents();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 min-h-[60vh]">
      <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
            Bizning Guruh
          </h1>
          <p className="text-slate-500 mt-2">610-22 guruhidagi barcha talabalar bilan tanishing</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {students.map((student) => (
            <motion.div 
              key={student.id}
              className="h-full"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <StudentCard student={student} onClick={setSelectedStudent} />
            </motion.div>
          ))}
          {students.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-center text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <p className="mb-4 text-lg">Hali talabalar ro'yxati shakllanmagan</p>
              <a href="/admin/students" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm transition-all hover:shadow-md">
                Admin Panel orqali Talaba qo'shish
              </a>
            </div>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStudent(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              layoutId={`card-${selectedStudent.id}`}
              className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-5xl max-h-[90vh] md:h-[80vh] md:max-h-[700px] shadow-2xl relative flex flex-col md:flex-row overflow-y-auto md:overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                ✕
              </button>
              
              {/* Chap Tomon: Animatsiyali Rasm */}
              <div className="md:w-2/5 p-8 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-800 shrink-0">
                <motion.div 
                  layoutId={`image-${selectedStudent.id}`} 
                  className="relative w-56 h-56 md:w-72 md:h-72 rounded-full mb-8 mt-4 flex items-center justify-center text-5xl font-bold text-blue-500 dark:text-slate-300 shadow-xl group z-10"
                >
                  {/* 3-qatlam (Tashqi - Eng sekin) */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="absolute inset-[-20px] rounded-full border-[2px] border-t-red-500 border-r-yellow-400 border-b-green-500 border-l-blue-500 shadow-[0_0_25px_rgba(239,68,68,0.8)] transition-shadow duration-500"
                  />
                  
                  {/* 2-qatlam (O'rta - O'rtacha) */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                    className="absolute inset-[-10px] rounded-full border-[2px] border-t-blue-500 border-r-indigo-500 border-b-purple-500 border-l-fuchsia-500 shadow-[0_0_25px_rgba(168,85,247,0.8)] transition-shadow duration-500"
                  />
                  
                  {/* 1-qatlam (Ichki - Eng tez) */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="absolute inset-[0px] rounded-full border-[2px] border-t-fuchsia-500 border-r-rose-500 border-b-orange-500 border-l-yellow-400 shadow-[0_0_35px_rgba(236,72,153,1)] transition-shadow duration-500"
                  />
                  
                  <div className="absolute inset-[4px] bg-white dark:bg-slate-800 rounded-full overflow-hidden z-10 flex items-center justify-center shadow-inner border border-slate-100 dark:border-slate-700">
                    {selectedStudent.photo_url ? (
                    <img 
                      src={selectedStudent.photo_url.includes('drive.google.com') ? `/api/proxy-image?url=${encodeURIComponent(selectedStudent.photo_url)}` : selectedStudent.photo_url} 
                      alt={selectedStudent.first_name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (     <span>{selectedStudent.first_name[0]}{selectedStudent.last_name[0]}</span>
                    )}
                  </div>
                </motion.div>
                
                {selectedStudent.quote && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 text-center relative"
                  >
                    <Quote className="w-8 h-8 text-blue-200 dark:text-slate-700 absolute -top-4 -left-4 -z-10 transform -rotate-12" />
                    <p className="text-lg italic text-slate-700 dark:text-slate-300 font-medium">"{selectedStudent.quote}"</p>
                  </motion.div>
                )}
              </div>
              
              {/* O'ng Tomon: Ma'lumotlar va Xarita */}
              <div className="md:w-3/5 p-8 md:p-10 flex flex-col md:h-full md:overflow-y-auto">
                <motion.h3 layoutId={`name-${selectedStudent.id}`} className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  {selectedStudent.last_name} {selectedStudent.first_name}
                </motion.h3>

                <div className="space-y-6">
                  {/* Aloqa */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Aloqa</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedStudent.phone_number && (
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                          <Phone className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="text-xs text-slate-500">Asosiy telefon</p>
                            <p className="font-medium text-slate-800 dark:text-slate-200">{selectedStudent.phone_number}</p>
                          </div>
                        </div>
                      )}
                      {selectedStudent.phone_number_2 && (
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                          <Smartphone className="w-5 h-5 text-purple-500" />
                          <div>
                            <p className="text-xs text-slate-500">Zaxira telefon</p>
                            <p className="font-medium text-slate-800 dark:text-slate-200">{selectedStudent.phone_number_2}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Manzil va Xarita */}
                  {selectedStudent.address && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Yashash Manzili</h4>
                      <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <MapPin className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                        <p className="font-medium text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{selectedStudent.address}</p>
                      </div>
                      
                      {/* Xarita (Google Maps Embed) */}
                      <div className="w-full h-40 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative shadow-inner">
                        <iframe
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps?q=${encodeURIComponent(selectedStudent.address)}&output=embed`}
                        ></iframe>
                      </div>
                    </div>
                  )}

                  {/* Ijtimoiy tarmoqlar (agar bo'lsa) */}
                  {(selectedStudent.social_links?.telegram || selectedStudent.social_links?.instagram || selectedStudent.social_links?.linkedin) && (
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-3">
                      {selectedStudent.social_links.telegram && (
                        <a href={`https://t.me/${selectedStudent.social_links.telegram.replace('https://t.me/', '').replace('t.me/', '').replace('@', '').split('?')[0]}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-blue-500/30 hover:-translate-y-0.5">
                          <Send className="w-4 h-4" /> @{selectedStudent.social_links.telegram.replace('https://t.me/', '').replace('t.me/', '').replace('@', '').split('?')[0]}
                        </a>
                      )}
                      {selectedStudent.social_links.instagram && (
                        <a href={`https://instagram.com/${selectedStudent.social_links.instagram.replace('https://instagram.com/', '').replace('instagram.com/', '').replace('https://www.instagram.com/', '').replace('@', '').split('/')[0]}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-white bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 hover:opacity-90 px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-pink-500/30 hover:-translate-y-0.5">
                          <Camera className="w-4 h-4" /> @{selectedStudent.social_links.instagram.replace('https://instagram.com/', '').replace('instagram.com/', '').replace('https://www.instagram.com/', '').replace('@', '').split('/')[0]}
                        </a>
                      )}
                      {selectedStudent.social_links.linkedin && (
                        <a href={`https://${selectedStudent.social_links.linkedin.replace('https://', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-2 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-900/30">
                          <Globe className="w-4 h-4" /> LinkedIn
                        </a>
                      )}
                    </div>
                  )}

                  {/* Tug'ilgan kun taymeri */}
                  {selectedStudent.birth_date && (
                    <BirthdayTimer birthDate={selectedStudent.birth_date} />
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
