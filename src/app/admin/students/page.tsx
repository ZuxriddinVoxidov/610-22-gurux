"use client";

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Student } from '@/lib/types';
import StudentFormModal from '@/components/admin/StudentFormModal';
import { Plus, Edit2, Trash2, Loader2, UploadCloud } from 'lucide-react';
import { deleteImage } from '@/lib/supabase/storage';
import Papa from 'papaparse';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const supabase = createClient();

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setStudents(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id: string, photoUrl: string | null) => {
    if (!confirm("Haqiqatan ham bu talabani o'chirmoqchimisiz?")) return;
    await supabase.from('students').delete().eq('id', id);
    if(photoUrl) {
      try { await deleteImage(photoUrl, 'digital_yearbook'); } catch (err) {}
    }
    fetchStudents();
  };

  const openAddModal = () => {
    setEditingStudent(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const parsedData = results.data as any[];
        const formattedData = parsedData.map(row => {
          // Google Forms: "To'liq ism sharifingiz" ustunidan ism olish
          const fullName = row["To'liq ism sharifingiz"] || row.Ism || row.first_name || '';
          let fName = '';
          let lName = '';
          
          if (row.Familiya || row.last_name) {
            fName = row.Ism || row.first_name || '';
            lName = row.Familiya || row.last_name || '';
          } else if (fullName) {
            const parts = fullName.trim().split(/\s+/);
            lName = parts[0] || '';
            fName = parts.slice(1).join(' ') || '';
          }

          const keys = Object.keys(row);
          const photoKey = keys.find(k => k.toLowerCase().includes('rasm')) || '';

          // Google Drive rasmlarini to'g'ri o'qish uchun konvertatsiya
          let photoUrl = (photoKey ? row[photoKey] : '') || '';
          const driveMatch = photoUrl.match(/[?&]id=([^&]+)/);
          if (driveMatch) {
            photoUrl = `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
          }

          // Tug'ilgan sana — aniq ustun nomi: "Tug'ilgan sanangiz"
          // Fallback: boshqa ustunlardan ham qidiradi
          const birthRaw =
            row["Tug'ilgan sanangiz"] ||
            row["Tug'ilgan kuningiz"] ||
            row["Tug'ilgan kun"] ||
            row["Birth date"] ||
            row.birth_date || '';

          let birthDate: string | null = null;
          if (birthRaw) {
            const raw = birthRaw.trim();
            // DD.MM.YYYY yoki D.M.YYYY (Google Sheets O'zbekcha formati)
            const ddmm = raw.match(/^(\d{1,2})[.\-\/](\d{1,2})[.\-\/](\d{4})$/);
            if (ddmm) {
              birthDate = `${ddmm[3]}-${ddmm[2].padStart(2,'0')}-${ddmm[1].padStart(2,'0')}`;
            } else if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
              birthDate = raw;
            }
          }

          // Google Forms: "Kursdoshlar uchun ikki og'iz tilaklar..." ustunini topish
          const quoteKey = keys.find(k =>
            k.toLowerCase().includes('tilak') ||
            k.toLowerCase().includes('gap') ||
            k.toLowerCase() === 'quote'
          ) || '';

          return {
            first_name: fName,
            last_name: lName,
            birth_date: birthDate,
            phone_number: row.phone_number || row.Telefon || row.Phone || row["Telefon raqamingiz"] || '',
            phone_number_2: row.phone_number_2 || row['Zaxira Telefon'] || row["Agar qo'shimcha raqam bo'lsa kiriting"] || '',
            address: row.address || row.Manzil || row.Address || row["To'liq manzilingiz"] || '',
            quote: (quoteKey ? row[quoteKey] : '') || '',
            photo_url: photoUrl,
            social_links: {
              telegram: row.telegram || row.Telegram || row["Username ijtimoiy tarmoq uchun"] || '',
              instagram: row.instagram || row.Instagram || '',
            }
          };
        }).filter(s => s.first_name || s.last_name);

        if (formattedData.length > 0) {
          const { error } = await supabase.from('students').insert(formattedData);
          if (error) {
            alert("Xatolik yuz berdi: " + error.message);
          } else {
            alert(`Muvaffaqiyatli ${formattedData.length} ta talaba qo'shildi!`);
            fetchStudents();
          }
        } else {
          alert("Fayl ichida yaroqli ma'lumot topilmadi.");
        }
        
        // inputni tozalash
        if(fileInputRef.current) fileInputRef.current.value = '';
        setLoading(false);
      }
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white">Talabalarni Boshqarish</h1>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
          >
            <UploadCloud className="w-5 h-5" />
            CSV dan Yuklash
          </button>
          <button 
            onClick={openAddModal} 
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-650 hover:opacity-95 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Yangi talaba
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800/80 overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 w-20">Rasm</th>
                <th className="p-4">F.I.O</th>
                <th className="p-4">Telefon</th>
                <th className="p-4">Manzil</th>
                <th className="p-4 text-right w-28">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                    Hali talabalar qo'shilmagan
                  </td>
                </tr>
              ) : students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative border border-slate-350 dark:border-slate-700 shadow-inner">
                      {s.photo_url ? (
                        <img src={s.photo_url.includes('drive.google.com') ? `/api/proxy-image?url=${encodeURIComponent(s.photo_url)}` : s.photo_url} alt={s.first_name} className="w-full h-full object-cover animate-in fade-in duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold text-sm">
                          {s.first_name[0]}{s.last_name[0]}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-200 text-sm">{s.last_name} {s.first_name}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 text-sm font-medium">{s.phone_number || '-'}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 text-sm max-w-[250px] truncate" title={s.address || undefined}>{s.address || '-'}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEditModal(s)} className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-450 dark:hover:bg-blue-950/40 rounded-xl transition-all" title="Tahrirlash">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(s.id, s.photo_url)} className="p-2 text-red-650 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 rounded-xl transition-all" title="O'chirish">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <StudentFormModal 
          student={editingStudent} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchStudents();
          }} 
        />
      )}
    </div>
  );
}
