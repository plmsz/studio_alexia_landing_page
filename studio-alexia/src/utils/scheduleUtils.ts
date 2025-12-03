import type { Appointment } from '../types/appointment';

export interface TimeSlot {
  time: Date;
  available: boolean;
}

export interface WorkingHours {
  dayOfWeek: number;
  periods: { start: string; end: string }[];
}

const workingHours: WorkingHours[] = [
  { dayOfWeek: 1, periods: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }] },
  { dayOfWeek: 2, periods: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }] },
  { dayOfWeek: 3, periods: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }] },
  { dayOfWeek: 4, periods: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }] },
  { dayOfWeek: 5, periods: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }] },
  { dayOfWeek: 6, periods: [{ start: '10:00', end: '12:00' }, { start: '14:00', end: '18:00' }] },
  { dayOfWeek: 0, periods: [{ start: '09:00', end: '12:00' }] },
];

const SLOT_DURATION_MINUTES = 30;

export const generateTimeSlots = (
  date: Date, 
  appointments: Appointment[], 
  serviceDuration?: number
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const dayOfWeek = date.getDay();
  const workingDay = workingHours.find(wh => wh.dayOfWeek === dayOfWeek);

  if (!workingDay) {
    return slots;
  }

  const durationToCheck = serviceDuration || SLOT_DURATION_MINUTES;

  for (const period of workingDay.periods) {
    const [startHour, startMinute] = period.start.split(':').map(Number);
    const [endHour, endMinute] = period.end.split(':').map(Number);

    const startTime = new Date(date);
    startTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(date);
    endTime.setHours(endHour, endMinute, 0, 0);

    let currentTime = new Date(startTime);

    while (currentTime < endTime) {
      const slotEnd = new Date(currentTime.getTime() + SLOT_DURATION_MINUTES * 60000);
      const serviceEnd = new Date(currentTime.getTime() + durationToCheck * 60000);

      if (serviceEnd > endTime) {
        currentTime = slotEnd;
        continue;
      }

      const isAvailable = !appointments.some(apt => {
        const aptStart = new Date(apt.startTime);
        const aptEnd = new Date(apt.endTime);
        return currentTime < aptEnd && serviceEnd > aptStart;
      });

      const isPastTime = currentTime < new Date();

      slots.push({
        time: new Date(currentTime),
        available: isAvailable && !isPastTime
      });

      currentTime = slotEnd;
    }
  }

  return slots;
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const formatDateTime = (date: Date): string => {
  return `${formatDate(date)} às ${formatTime(date)}`;
};

export const isWorkingDay = (date: Date): boolean => {
  const dayOfWeek = date.getDay();
  return workingHours.some(wh => wh.dayOfWeek === dayOfWeek);
};

export const getMinDate = (): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString().split('T')[0];
};

export const getMaxDate = (): string => {
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  return maxDate.toISOString().split('T')[0];
};
