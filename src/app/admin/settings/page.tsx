"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Save, CheckCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const [graduationDate, setGraduationDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "graduation_date")
      .single()
      .then(({ data }) => {
        if (data?.value) {
          // "2026-06-25T10:00:00" → input datetime-local formatiga moslashtir
          setGraduationDate(data.value.slice(0, 16));
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!graduationDate) return;
    setSaving(true);
    setSaved(false);

    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "graduation_date", value: graduationDate + ":00" });

    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Sayt Sozlamalari</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
        Bu yerdan "Vaqtimiz" sahifasidagi bitiruv taymerini sozlashingiz mumkin.
      </p>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-6">

          {/* Bitiruv sanasi */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              🎓 Bitiruv Sanasi va Vaqti
            </label>
            <p className="text-xs text-slate-400 dark:text-slate-550 mb-3">
              "Vaqtimiz" sahifasidagi taymer shu sanadan boshlab o'tgan vaqtni (Yil, Oy, Kun, Soat, Daqiqa, Soniya) sanab turadi.
            </p>
            <input
              type="datetime-local"
              value={graduationDate}
              onChange={(e) => setGraduationDate(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
            />
          </div>

          {/* Hozirgi sana ko'rsatgich */}
          {graduationDate && (
            <div className="bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900/30 rounded-xl px-4 py-3 text-sm text-violet-750 dark:text-violet-400">
              <span className="font-semibold">Tanlangan sana:</span>{" "}
              {new Date(graduationDate).toLocaleString("uz-UZ", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}

          {/* Saqlash tugmasi */}
          <button
            onClick={handleSave}
            disabled={saving || !graduationDate}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold py-3 rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saqlanmoqda...</>
            ) : saved ? (
              <><CheckCircle className="w-4 h-4" /> Saqlandi! ✓</>
            ) : (
              <><Save className="w-4 h-4" /> Saqlash</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
