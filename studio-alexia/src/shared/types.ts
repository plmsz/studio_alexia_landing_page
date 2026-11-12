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

export interface BusinessHours {
  id: number;
  dayOfWeek: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  open: string;      // HH:mm
  close: string;     // HH:mm
  breakStart: string | null; // HH:mm ou null
  breakEnd: string | null;   // HH:mm ou null
  isWorking: boolean;
}

export interface BlockedDate {
  id: number;
  date: string;   // Format ISO YYYY-MM-DD
  reason: string;
  type: 'holiday' | 'personal' | 'maintenance';
}
