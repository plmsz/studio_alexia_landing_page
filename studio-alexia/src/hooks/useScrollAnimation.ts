import { useEffect, useRef } from 'react';

export const useScrollAnimation = () => {
  const elementRef = useRef<HTMLDivElement>(null);
/* FIXME: animação não funciona no mobile, não está aparecendo serviços */
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const isMobile = window.innerWidth <= 820;

    if (isMobile) {
      const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {
          element.classList.add('active');
        }
      };

      window.addEventListener('scroll', revealOnScroll);
      revealOnScroll();

      return () => window.removeEventListener('scroll', revealOnScroll);
    } else {
      requestAnimationFrame(() => {
        setTimeout(() => {
          element.classList.add('active');
        }, 300);
      });
    }
  }, []);

  return elementRef;
};
