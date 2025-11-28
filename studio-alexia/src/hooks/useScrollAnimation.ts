import { useEffect, useRef, useState } from 'react';

export const useScrollAnimation = (index: number) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const isMobile = window.innerWidth <= 820;
    if (!isMobile) return;

    // Primeiro elemento não precisa de animação no mobile
    if (index === 0) {
      setIsVisible(true);
      return;
    }
    
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      const elementTop = element.getBoundingClientRect().top;
      const revealPoint = 100;

      if (elementTop < windowHeight - revealPoint) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    return () => window.removeEventListener('scroll', revealOnScroll);
  }, [index]);

  return { elementRef, isVisible };
};
