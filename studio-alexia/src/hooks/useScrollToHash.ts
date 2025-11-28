import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    
    if (hash) {
      // Pequeno delay para garantir que o DOM está renderizado
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else if (location.pathname === '/') {
      // Se não tem hash e está na home, rola para o topo
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);
};
