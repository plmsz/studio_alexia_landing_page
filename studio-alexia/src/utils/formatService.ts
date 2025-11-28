import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/pt-br';

dayjs.extend(duration);
dayjs.locale('pt-br');

/**
 * Formata o preço para moeda brasileira
 * @param price - Preço em número
 * @returns String formatada como R$ XX,XX
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

/**
 * Formata a duração em minutos para formato legível
 * @param minutes - Duração em minutos
 * @returns String formatada como "Xh Ymin" ou "Xmin"
 */
export function formatDuration(minutes: number): string {
  const dur = dayjs.duration(minutes, 'minutes');
  const hours = Math.floor(dur.asHours());
  const mins = dur.minutes();

  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}min`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}min`;
  }
}
