import type { ScheduleDay, ContactInfo, LocationInfo } from '../types/service';

export const schedule: ScheduleDay[] = [
  { day: 'Segunda-feira:', hours: '09:00 - 12:00 e 14:00-18:00' },
  { day: 'Terça-feira:', hours: '09:00 - 12:00 e 14:00-18:00' },
  { day: 'Quarta-feira:', hours: '09:00 - 12:00 e 14:00-18:00' },
  { day: 'Quinta-feira:', hours: '09:00 - 12:00 e 14:00-18:00' },
  { day: 'Sexta-feira:', hours: '09:00 - 12:00 e 14:00-18:00' },
  { day: 'Sábado:', hours: '10:00 - 12:00 e 14:00-18:00' },
  { day: 'Domingo:', hours: '09:00 - 12:00' },
];

export const contactInfo: ContactInfo = {
  instagram: 'https://www.instagram.com/studioalexiamnzs',
  instagramHandle: '@studioalexiamnzs',
  phone: 'tel:+557191146856',
  phoneFormatted: '(71) 9114-6856',
  whatsapp: 'https://wa.me/557191146856',
};

export const locationInfo: LocationInfo = {
  address:
    'Rua Jerusalém de Cajazeiras, 539, Fazenda Grande II, Salvador BA, 41342-318',
  mapUrl:
    'https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d7778.320718027592!2d-38.40513695!3d-12.897408200000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sRua%20Jerusal%C3%A9m%20de%20Cajazeiras%2C%209999%2C%20Fazenda%20Grande%20II%2C%20Salvador%20BA%2C%2041342-318%2C%20Brasil!5e0!3m2!1spt-BR!2sbr!4v1764352199915!5m2!1spt-BR!2sbr',
};
