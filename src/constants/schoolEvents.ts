export interface PastEventItem {
  id: string;
  category: string;
  date: string;
  title: { en: string; gu: string; hi: string };
  place: { en: string; gu: string; hi: string };
  summary: { en: string; gu: string; hi: string };
  participants: number;
  volunteers: number;
  impact: { en: string; gu: string; hi: string };
  img: string;
}

export interface GalleryPicture {
  img: string;
  category: string;
  caption: { en: string; gu: string; hi: string };
}

export interface SimpleGalleryItem {
  img: string;
  cat: string;
  h: "tall" | "short";
}

// Cleared for custom events addition
export const SCHOOL_BAG_EVENTS: PastEventItem[] = [];
export const SCHOOL_BAG_GALLERY: GalleryPicture[] = [];
export const SCHOOL_BAG_SIMPLE_GALLERY: SimpleGalleryItem[] = [];
