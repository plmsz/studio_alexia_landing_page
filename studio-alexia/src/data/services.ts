import type { Service, ScheduleDay, ContactInfo, LocationInfo } from '../types/service';

export const featuredServices: Service[] = [
  {
    id: 1,
    title: 'Design de sobrancelha especializado',
    description: 'Utilizamos técnicas precisas para modelar as sobrancelhas de forma personalizada, respeitando os traços naturais do seu rosto para garantir harmonia e destaque ao olhar.',
    image: '/src/assets/img/design.jpg',
    imageAlt: 'Design de sobrancelha'
  },
  {
    id: 2,
    title: 'Henna para sobrancelha',
    description: 'A henna é uma solução temporária para preencher falhas e definir o desenho das sobrancelhas, oferecendo um efeito natural e bem delineado por até 10 dias.',
    image: '/src/assets/img/henna.jpg',
    imageAlt: 'Henna para sobrancelha'
  },
  {
    id: 3,
    title: 'Design de unhas',
    description: 'Oferecemos cuidados completos para as suas unhas, com esmaltação de alta qualidade, técnicas de nail art e acabamento impecável que refletem sofisticação e estilo.',
    image: '/src/assets/img/micro.jpg',
    imageAlt: 'Design de unhas'
  }
];

export const allServices: Service[] = [
  {
    id: 4,
    title: 'Micropigmentação fio a fio',
    description: 'Técnica semipermanente que simula fios naturais, corrige falhas e proporciona sobrancelhas mais cheias e simétricas.',
    image: '/src/assets/img/micropigmentacao.jpg',
    imageAlt: 'Micropigmentação fio a fio'
  },
  {
    id: 5,
    title: 'Lash Lifting',
    description: 'Curvatura e alongamento dos cílios naturais sem uso de extensão. Resultado natural, elegante e duradouro por até 8 semanas.',
    image: '/src/assets/img/lash.jpg',
    imageAlt: 'Lash Lifting'
  },
  {
    id: 6,
    title: 'Extensão de cílios fio a fio',
    description: 'Aumento do volume e comprimento dos cílios com efeito leve e natural, ideal para realçar o olhar com elegância.',
    image: '/src/assets/img/cilios-fio-o-fio.jpg',
    imageAlt: 'Extensão de cílios'
  },
  {
    id: 7,
    title: 'Manicure em gel',
    description: 'Esmaltação resistente, com brilho duradouro e acabamento perfeito para quem busca unhas impecáveis por mais tempo.',
    image: '/src/assets/img/gel.jpg',
    imageAlt: 'Manicure em gel'
  },
  {
    id: 8,
    title: 'Unhas postiças',
    description: 'Aplicação personalizada com acabamento natural, ideal para ocasiões especiais ou uso contínuo com manutenção.',
    image: '/src/assets/img/postica.jpg',
    imageAlt: 'Unhas postiças'
  },
  {
    id: 9,
    title: 'Depilação com cera',
    description: 'Remoção eficaz dos pelos, com redução do atrito e durabilidade superior em comparação com métodos tradicionais.',
    image: '/src/assets/img/cera.jpg',
    imageAlt: 'Depilação com cera'
  },
  {
    id: 10,
    title: 'Depilação egípcia (linha)',
    description: 'Técnica com linha de algodão que remove os pelos pela raiz, oferecendo precisão e menos agressão à pele.',
    image: '/src/assets/img/egipcia.jpg',
    imageAlt: 'Depilação egípcia'
  },
  {
    id: 11,
    title: 'Limpeza de pele',
    description: 'Remoção de impurezas, células mortas e controle da oleosidade. Indispensável para manter a pele saudável e luminosa.',
    image: '/src/assets/img/limpeza.jpg',
    imageAlt: 'Limpeza de pele'
  },
  ...featuredServices
];

export const schedule: ScheduleDay[] = [
  { day: 'Segunda-feira:', hours: 'Fechado' },
  { day: 'Terça-feira:', hours: '10:00 - 12:00 e 14:00-18:00' },
  { day: 'Quarta-feira:', hours: '10:00 - 12:00 e 14:00-18:00' },
  { day: 'Quinta-feira:', hours: '09:00 - 12:00 e 14:00-18:00' },
  { day: 'Sexta-feira:', hours: '09:00 - 12:00 e 14:00-18:00' },
  { day: 'Sábado:', hours: '10:00 - 12:00 e 14:00-18:00' },
  { day: 'Domingo:', hours: 'Fechado' }
];

export const contactInfo: ContactInfo = {
  instagram: 'https://www.instagram.com/studioalexiamnzs',
  instagramHandle: '@studioalexiamnzs',
  phone: 'tel:+557191146856',
  phoneFormatted: '(71) 9114-6856',
  whatsapp: 'https://wa.me/557191146856'
};

export const locationInfo: LocationInfo = {
  address: 'R. Benedito Jenkis, 308 - Águas Claras - Salvador - BA',
  mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.2452816620444!2d-38.438773824170156!3d-12.891943358214103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7161103a4113ccb%3A0x42e75c1bac717fbe!2sR.%20Benedito%20Jenkis%2C%20308%20-%20%C3%81guas%20Claras%2C%20Salvador%20-%20BA%2C%2041310-380%2C%20Brasil!5e0!3m2!1spt-BR!2sus!4v1747969179981!5m2!1spt-BR!2sus'
};
