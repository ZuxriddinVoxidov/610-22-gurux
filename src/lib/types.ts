export type MediaType = 'image' | 'video' | 'google_photos' | 'google_photos_photo';

export type SocialLinks = {
  telegram?: string;
  instagram?: string;
  linkedin?: string;
  facebook?: string;
};

export type Student = {
  id: string;
  first_name: string;
  last_name: string;
  photo_url: string | null;
  phone_number: string | null;
  phone_number_2: string | null;
  address: string | null;
  quote: string | null;
  birth_date: string | null;
  social_links: SocialLinks | null;
  created_at: string;
};

export type GalleryItem = {
  id: string;
  title: string | null;
  description: string | null;
  media_url: string;
  media_type: MediaType;
  date_taken: string | null;
  course: number;
  created_at: string;
};

export type TimeCapsule = {
  id: string;
  student_id: string | null;
  author_name: string;
  message: string;
  unlock_date: string;
  is_unlocked: boolean;
  created_at: string;
};
