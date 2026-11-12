import dayjs from 'dayjs';
import type { Appointment } from '../types';
import type { BusinessHours, BlockedDate } from '../../../shared/types';

export interface TimeSlot {
  time: Date;
  available: boolean;
}

const defaultWorkingHours: BusinessHours[] = [
  { id: 1, dayOfWeek: 1, open: '09:00', close: '18:00', breakStart: '12:00', breakEnd: '14:00', isWorking: true },
  { id: 2, dayOfWeek: 2, open: '09:00', close: '18:00', breakStart: '12:00', breakEnd: '14:00', isWorking: true },
  { id: 3, dayOfWeek: 3, open: '09:00', close: '18:00', breakStart: '12:00', breakEnd: '14:00', isWorking: true },
  { id: 4, dayOfWeek: 4, open: '09:00', close: '18:00', breakStart: '12:00', breakEnd: '14:00', isWorking: true },
  { id: 5, dayOfWeek: 5, open: '09:00', close: '18:00', breakStart: '12:00', breakEnd: '14:00', isWorking: true },
  { id: 6, dayOfWeek: 6, open: '10:00', close: '18:00', breakStart: '12:00', breakEnd: '14:00', isWorking: true },
  { id: 7, dayOfWeek: 0, open: '', close: '', breakStart: null, breakEnd: null, isWorking: false },
];

const SLOT_DURATION_MINUTES = 30;

export const isBlockedDate = (date: Date, blockedDates: BlockedDate[] = []): boolean => {
  const formattedDate = dayjs(date).format('YYYY-MM-DD');
  return blockedDates.some(b => b.date === formattedDate);
};

export const getBusinessHoursForDay = (
  dayOfWeek: number, 
  businessHours: BusinessHours[] = defaultWorkingHours
): BusinessHours | undefined => {
  return businessHours.find(b => b.dayOfWeek === dayOfWeek);
};

export const generateTimeSlots = (
  date: Date, 
  appointments: Appointment[], 
  serviceDuration?: number,
  businessHours: BusinessHours[] = defaultWorkingHours,
  blockedDates: BlockedDate[] = []
): TimeSlot[] => {
  // 1. Verificar se a data está bloqueada
  if (isBlockedDate(date, blockedDates)) return [];

  // 2. Buscar expediente para o dia da semana
  const dayOfWeek = date.getDay();
  const dayConfig = getBusinessHoursForDay(dayOfWeek, businessHours);
  if (!dayConfig || !dayConfig.isWorking) return [];

  const slots: TimeSlot[] = [];
  const durationToCheck = serviceDuration || SLOT_DURATION_MINUTES;

  // 3. Montar os períodos de trabalho considerando expediente e pausas
  const periods: { start: string; end: string }[] = [];
  if (dayConfig.breakStart && dayConfig.breakEnd) {
    periods.push({ start: dayConfig.open, end: dayConfig.breakStart });
    periods.push({ start: dayConfig.breakEnd, end: dayConfig.close });
  } else {
    periods.push({ start: dayConfig.open, end: dayConfig.close });
  }

  // 4. Gerar slots baseados nos períodos e filtrar sobrepostos por agendamentos existentes
  for (const period of periods) {
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

export const isWorkingDay = (
  date: Date,
  businessHours: BusinessHours[] = defaultWorkingHours,
  blockedDates: BlockedDate[] = []
): boolean => {
  if (isBlockedDate(date, blockedDates)) {
    return false;
  }
  const dayOfWeek = date.getDay();
  const dayConfig = getBusinessHoursForDay(dayOfWeek, businessHours);
  return !!dayConfig && dayConfig.isWorking;
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
