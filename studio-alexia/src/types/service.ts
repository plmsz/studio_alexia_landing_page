export interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface ScheduleDay {
  day: string;
  hours: string;
}

export interface ContactInfo {
  instagram: string;
  instagramHandle: string;
  phone: string;
  phoneFormatted: string;
  whatsapp: string;
}

export interface LocationInfo {
  address: string;
  mapUrl: string;
}
