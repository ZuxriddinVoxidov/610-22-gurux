"use client";

import { useState } from 'react';
import { Student } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { uploadImage } from '@/lib/supabase/storage';
import { X, Upload, Loader2 } from 'lucide-react';

type Props = {
  student?: Student; // agar kiritilsa tahrirlash, yo'qsa qo'shish
  onClose: () => void;
  onSuccess: () => void;
};

export default function StudentFormModal({ student, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [firstName, setFirstName] = useState(student?.first_name || '');
  const [lastName, setLastName] = useState(student?.last_name || '');
  const [birthDate, setBirthDate] = useState(student?.birth_date || '');
  const [phone, setPhone] = useState(student?.phone_number || '');
  const [phone2, setPhone2] = useState(student?.phone_number_2 || '');
  const [address, setAddress] = useState(student?.address || '');
  const [quote, setQuote] = useState(student?.quote || '');
  const [telegram, setTelegram] = useState(student?.social_links?.telegram || '');
  const [instagram, setInstagram] = useState(student?.social_links?.instagram || '');
  const [linkedin, setLinkedin] = useState(student?.social_links?.linkedin || '');
  
  const [photoUrl, setPhotoUrl] = useState(student?.photo_url || '');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const supabase = createClient();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let finalPhotoUrl = photoUrl;

      if (photoFile) {
        finalPhotoUrl = await uploadImage(photoFile, 'digital_yearbook', 'students');
      }

      const social_links = {
        ...(telegram && { telegram }),
        ...(instagram && { instagram }),
        ...(linkedin && { linkedin }),
      };

      const studentData = {
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate || null,
        phone_number: phone,
        phone_number_2: phone2,
        address,
        quote,
        photo_url: finalPhotoUrl,
        social_links,
      };

      if (student) {
        const { error: dbError } = await supabase.from('students').update(studentData).eq('id', student.id);
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase.from('students').insert([studentData]);
        if (dbError) throw dbError;
      }

      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-slate-900">
          {student ? 'Talabani tahrirlash' : 'Yangi talaba qo\'shish'}
        </h2>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden mb-2 shadow-sm">
              {(photoPreview || photoUrl) ? (
                <img src={photoPreview ? photoPreview : (photoUrl.includes('drive.google.com') ? `/api/proxy-image?url=${encodeURIComponent(photoUrl)}` : photoUrl)} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-slate-400">
                  <Upload className="w-8 h-8" />
                </div>
              )}
            </div>
            <label className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700">
              Rasm yuklash
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Ism</label>
              <input required value={firstName} onChange={e=>setFirstName(e.target.value)} className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Familiya</label>
              <input required value={lastName} onChange={e=>setLastName(e.target.value)} className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>

          {/* Tug'ilgan kun - ismdan keyin, 2-maydon */}
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
            <label className="block text-sm font-semibold mb-1 text-pink-700 flex items-center gap-2">
              🎂 Tug'ilgan sana
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="w-full bg-white border border-pink-300 text-slate-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400 focus:outline-none"
              max={new Date().toISOString().split('T')[0]}
            />
            <p className="text-xs text-pink-500 mt-1">Bu maʼlumot asosida talaba kartochkasida tug'ilgan kunga qancha qolganini ko'rsatamiz.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Telefon</label>
              <input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="+998901234567" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Zaxira Telefon</label>
              <input value={phone2} onChange={e=>setPhone2(e.target.value)} className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="+998912345678" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Manzil (To'liq)</label>
            <input value={address} onChange={e=>setAddress(e.target.value)} className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Masalan: Toshkent shahar, Yunusobod..." />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Kursdoshlar uchun gap</label>
            <textarea value={quote} onChange={e=>setQuote(e.target.value)} className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 h-16 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Masalan: 4 yil men bilan o'qiganlarga kattakon rahmat!..." />
          </div>

          <div className="pt-4 border-t border-slate-200 mt-4">
            <h3 className="text-sm font-bold mb-3 text-slate-800">Ijtimoiy tarmoqlar (ixtiyoriy)</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium w-24 text-sm">Telegram</span>
                <input value={telegram} onChange={e=>setTelegram(e.target.value)} className="flex-1 bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="t.me/username" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium w-24 text-sm">Instagram</span>
                <input value={instagram} onChange={e=>setInstagram(e.target.value)} className="flex-1 bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="instagram.com/username" />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98]">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
