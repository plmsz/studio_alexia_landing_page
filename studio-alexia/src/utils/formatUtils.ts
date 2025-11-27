export const formatPrice = (price?: number): string => {
  if (!price && price !== 0) return '-';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

export const formatDuration = (duration?: string): string => {
  if (!duration || duration.trim() === '') return '-';
  return duration;
};
