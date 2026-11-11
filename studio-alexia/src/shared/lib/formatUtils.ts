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
export const formatPrice = (price: number): string => {
  if(isNaN(price)) return '-';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

/**
 * Formata a duração em minutos para formato legível
 * @param minutes - Duração em minutos
 * @returns String formatada como "Xh Ymin" ou "Xmin"
 */
export const formatDuration = (minutes: number): string => {
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
};

/**
 * Gera um link do WhatsApp com o número de telefone formatado.
 * Assume que, se não houver código de país, o número é do Brasil (prefixo 55).
 * @param phone - Número de telefone a ser formatado.
 * @returns URL do WhatsApp formatado.
 */
export const getWhatsAppLink = (phone: string): string => {
  const cleanedPhone = phone.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
  let formattedPhone = cleanedPhone;

  // Se o número não começa com "55" e tem um tamanho razoável para um número local,
  // prefixa com "55". Esta lógica pode precisar ser mais sofisticada
  // para lidar com números internacionais ou de outros países de forma mais robusta.
  if (!cleanedPhone.startsWith("55") && cleanedPhone.length >= 8 && cleanedPhone.length <= 11) {
    formattedPhone = `55${cleanedPhone}`;
  }

  return `https://wa.me/${formattedPhone}`;
};
