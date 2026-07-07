import { createClient } from './client';

export async function uploadImage(file: File, bucket: string, path: string) {
  const supabase = createClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteImage(url: string, bucket: string) {
  const supabase = createClient();
  // URL'dan fayl yo'lini (path) ajratib olish
  const pathParts = url.split(`/${bucket}/`);
  if (pathParts.length !== 2) return;
  const filePath = pathParts[1];

  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    throw error;
  }
}
