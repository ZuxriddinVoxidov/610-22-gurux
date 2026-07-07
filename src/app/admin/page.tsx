"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    gallery: 0,
    capsules: 0,
  });
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      
      const { count: studentsCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
      const { count: galleryCount } = await supabase.from('gallery').select('*', { count: 'exact', head: true });
      const { count: capsulesCount } = await supabase.from('time_capsule').select('*', { count: 'exact', head: true });

      setStats({
        students: studentsCount || 0,
        gallery: galleryCount || 0,
        capsules: capsulesCount || 0,
      });
      
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Boshqaruv Paneli</h1>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-medium text-slate-600 mb-2">Talabalar soni</h3>
            <p className="text-4xl font-bold text-blue-600">{stats.students}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-medium text-slate-600 mb-2">Rasmlar soni</h3>
            <p className="text-4xl font-bold text-pink-600">{stats.gallery}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-medium text-slate-600 mb-2">Vaqt kapsulalari</h3>
            <p className="text-4xl font-bold text-amber-600">{stats.capsules}</p>
          </div>
        </div>
      )}
      
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Xush kelibsiz, Admin!</h2>
        <p className="text-slate-600">
          Bu yerdan chap tomondagi menyular orqali guruhdoshlarni qo'shishingiz va galereyaga suratlar yuklashingiz mumkin. O'zgarishlar barcha uchun birdek ko'rinadi. Yodda tuting: Fayllar to'g'ri ishlashi uchun Supabase da "digital_yearbook" deb nomlangan storage bucket yaratilgan bo'lishi kerak.
        </p>
      </div>
    </div>
  );
}
