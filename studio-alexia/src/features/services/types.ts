export interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  featured: boolean;
  price: number;
  duration: number; // em minutos
}
