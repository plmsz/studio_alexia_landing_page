import { Link } from 'react-router-dom';
import { featuredServices, allServices } from '../../data/services';
import ServiceCard from './ServiceCard';
import styles from './Services.module.css';

interface ServicesProps {
  showAll?: boolean;
}

const Services = ({ showAll = false }: ServicesProps) => {
  const services = showAll ? allServices : featuredServices;

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
