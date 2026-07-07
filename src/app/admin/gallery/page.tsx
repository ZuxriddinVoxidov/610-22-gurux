"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { uploadImage, deleteImage } from '@/lib/supabase/storage';
import { GalleryItem, MediaType } from '@/lib/types';
import { Plus, Trash2, Loader2, Upload, X, Link as LinkIcon, Image as ImageIcon, Film, ImagePlus } from 'lucide-react';

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadType, setUploadType] = useState<MediaType>('image');
  const [course, setCourse] = useState<number>(1);
  const [isGooglePhotoSingle, setIsGooglePhotoSingle] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [googlePhotosUrl, setGooglePhotosUrl] = useState('');
  const [error, setError] = useState('');

  const supabase = createClient();

  const fetchGallery = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleDelete = async (id: string, mediaUrl: string, type: string) => {
    if (!confirm("Haqiqatan ham bu elementni o'chirmoqchimisiz?")) return;
    
    await supabase.from('gallery').delete().eq('id', id);
    
    if (type === 'image' || type === 'video') {
      try {
        await deleteImage(mediaUrl, 'digital_yearbook');
      } catch (err) {
        console.log("Fayl topilmadi yoki o'chirishda xatolik", err);
      }
    }
    
    fetchGallery();
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((uploadType === 'image' || uploadType === 'video') && !mediaFile) {
      setError(`Iltimos, ${uploadType === 'video' ? 'video' : 'rasm'} tanlang!`);
      return;
    }
    if (uploadType === 'google_photos' && !googlePhotosUrl) {
      setError("Iltimos, Google Photos havolasini kiriting!");
      return;
    }
    
    setUploading(true);
    setError('');

    try {
      let mediaUrl = '';
      let finalType = uploadType;

      if ((uploadType === 'image' || uploadType === 'video') && mediaFile) {
        mediaUrl = await uploadImage(mediaFile, 'digital_yearbook', 'gallery');
      } else {
        mediaUrl = googlePhotosUrl;
        if (uploadType === 'google_photos' && isGooglePhotoSingle) {
          finalType = 'google_photos_photo';
        }
      }

      const newItem = {
        title,
        description,
        media_url: mediaUrl,
        media_type: finalType,
        course,
      };

      const { error: dbError } = await supabase.from('gallery').insert([newItem]);
      if (dbError) throw dbError;

      // Reset
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setMediaFile(null);
      setMediaPreview('');
      setGooglePhotosUrl('');
      setIsGooglePhotoSingle(false);
      setCourse(1);
      
      fetchGallery();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Yuklashda xatolik yuz berdi");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white">Galereyani Boshqarish</h1>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center gap-2 bg-pink-650 hover:bg-pink-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Yangi qo'shish
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-pink-650 dark:text-pink-400" />
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="break-inside-avoid bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800/80 overflow-hidden group relative">
              <div className="relative w-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-hidden">
                {item.media_type === 'google_photos' ? (
                  <div className="w-full aspect-video bg-gradient-to-br from-blue-100/60 to-green-100/60 dark:from-blue-950/20 dark:to-green-950/20 flex flex-col items-center justify-center p-6 text-center">
                    <ImageIcon className="w-12 h-12 mb-3 text-blue-500 dark:text-blue-450 drop-shadow-sm" />
                    <span className="font-bold text-slate-700 dark:text-slate-350 text-sm">Google Photos Albom</span>
                  </div>
                ) : item.media_type === 'google_photos_photo' ? (
                  <div className="relative w-full h-auto bg-slate-900 group">
                    <img 
                      src={`/api/proxy-image?url=${encodeURIComponent(item.media_url)}`} 
                      alt={item.title || 'Yakka Rasm'} 
                      className="w-full h-auto max-h-[70vh] object-contain" 
                    />
                    <div className="absolute top-2 left-2 opacity-100 z-10 pointer-events-none">
                      <span className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-pink-600 dark:text-pink-400 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm border border-white/20 dark:border-slate-700/30">
                        <ImagePlus className="w-3 h-3" /> G-Photo
                      </span>
                    </div>
                  </div>
                ) : item.media_type === 'video' ? (
                  <video src={item.media_url} controls className="w-full h-auto max-h-[70vh]" />
                ) : (
                  <img src={item.media_url} alt={item.title || 'Rasm'} className="w-full h-auto max-h-[70vh] object-contain bg-slate-900" />
                )}
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button onClick={() => handleDelete(item.id, item.media_url, item.media_type)} className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-transform hover:scale-110 shadow-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1 gap-2">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{item.title || 'Sarlavhasiz'}</h3>
                  <div className="flex gap-1.5 shrink-0">
                    <span className="text-[9px] uppercase tracking-wider bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 px-2 py-1 rounded-md font-bold">{item.course}-Kurs</span>
                    {(item.media_type === 'google_photos' || item.media_type === 'google_photos_photo') && <span className="text-[9px] uppercase tracking-wider bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-md font-bold shrink-0">{item.media_type === 'google_photos' ? 'Albom' : 'Rasm'}</span>}
                    {item.media_type === 'video' && <span className="text-[9px] uppercase tracking-wider bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-md font-bold flex items-center gap-1 shrink-0"><Film className="w-2.5 h-2.5"/> Video</span>}
                  </div>
                </div>
                {item.description && <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{item.description}</p>}
                
                {(item.media_type === 'google_photos' || item.media_type === 'google_photos_photo') && (
                  <a href={item.media_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-450 mt-3 font-semibold hover:underline bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5 rounded-lg transition-colors">
                    {item.media_type === 'google_photos' ? 'Albomni ochish' : 'Rasmni ochish'} <LinkIcon className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full p-12 text-center text-slate-500 dark:text-slate-450 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              Hali rasmlar yoki albomlar qo'shilmagan
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto text-slate-900 shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Galereyaga qo'shish</h2>
            {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-200">{error}</div>}
            
            <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl">
              <button 
                type="button"
                onClick={() => { setUploadType('image'); setMediaFile(null); setMediaPreview(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${uploadType === 'image' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <ImageIcon className="w-4 h-4" /> Rasm
              </button>
              <button 
                type="button"
                onClick={() => { setUploadType('video'); setMediaFile(null); setMediaPreview(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${uploadType === 'video' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Film className="w-4 h-4" /> Video
              </button>
              <button 
                type="button"
                onClick={() => setUploadType('google_photos')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${uploadType === 'google_photos' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <LinkIcon className="w-4 h-4" /> Google Photos
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {uploadType === 'image' || uploadType === 'video' ? (
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer relative group bg-white">
                  <input type="file" accept={uploadType === 'video' ? "video/*" : "image/*"} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleMediaChange} />
                  {mediaPreview ? (
                    <div className="relative h-40 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
                      {uploadType === 'video' ? (
                        <video src={mediaPreview} className="w-full h-full object-contain" controls />
                      ) : (
                        <img src={mediaPreview} alt="Preview" className="w-full h-full object-contain" />
                      )}
                    </div>
                  ) : (
                    <div className="py-8 text-slate-500 group-hover:text-pink-600 transition-colors">
                      {uploadType === 'video' ? <Film className="w-10 h-10 mx-auto mb-2 opacity-50" /> : <Upload className="w-10 h-10 mx-auto mb-2 opacity-50" />}
                      <p className="text-sm font-medium">{uploadType === 'video' ? 'Videoni' : 'Rasmni'} tanlang yoki tortib keling</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Havola turi</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="gphoto_type" checked={!isGooglePhotoSingle} onChange={() => setIsGooglePhotoSingle(false)} className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-slate-700">Albom (Ko'p rasm)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="gphoto_type" checked={isGooglePhotoSingle} onChange={() => setIsGooglePhotoSingle(true)} className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-slate-700">Yakka Rasm</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Havola (Link)</label>
                    <input 
                      type="url" 
                      value={googlePhotosUrl} 
                      onChange={e => setGooglePhotosUrl(e.target.value)} 
                      className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="https://photos.app.goo.gl/..." 
                      required={uploadType === 'google_photos'}
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <label className="block text-sm font-medium mb-1 text-slate-700">Sarlavha (ixtiyoriy)</label>
                <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masalan: Bitiruv oqshomi" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Qisqacha ta'rif (ixtiyoriy)</label>
                <textarea value={description} onChange={e=>setDescription(e.target.value)} className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-4 py-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Qisqacha ma'lumot..." />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Qaysi kurs lahzalari?</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4].map(c => (
                    <label key={c} className={`flex-1 text-center py-2 rounded-xl cursor-pointer font-bold transition-colors ${course === c ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      <input type="radio" name="course" className="hidden" checked={course === c} onChange={() => setCourse(c)} />
                      {c}-Kurs
                    </label>
                  ))}
                </div>
              </div>

              <button disabled={uploading} type="submit" className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 mt-6 shadow-md transition-transform active:scale-[0.98]">
                {uploading && <Loader2 className="w-5 h-5 animate-spin" />}
                {uploading ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
