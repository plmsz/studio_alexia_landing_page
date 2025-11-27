import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { servicesApi } from '../../services/api';
import type { Service } from '../../types/service';
import ServiceCard from './ServiceCard';
import styles from './Services.module.css';

interface ServicesProps {
  showAll?: boolean;
}

const Services = ({ showAll = false }: ServicesProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = showAll 
          ? await servicesApi.getAll() 
          : await servicesApi.getFeatured();
        setServices(data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar serviços. Tente novamente mais tarde.');
        console.error('Erro ao buscar serviços:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [showAll]);

  if (loading) {
    return (
      <section id="servicos" className={styles.section}>
        <h1>Serviços</h1>
        <p>Carregando serviços...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="servicos" className={styles.section}>
        <h1>Serviços</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </section>
    );
  }

  return (
    <section id="servicos" className={styles.section}>
      <h1>Serviços</h1>
      <div className={styles.servicosContainer}>
        {services.map((service, index) => (
          <ServiceCard key={service.id} {...service} index={index} />
        ))}
      </div>
      {!showAll && (
        <Link to="/servicos">
          <button type="button">Ver mais serviços</button>
        </Link>
      )}
    </section>
  );
};

export default Services;
