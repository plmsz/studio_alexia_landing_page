import type { Service } from '../../types/service';
import styles from './Services.module.css';

interface ServiceCardProps extends Service {
  index: number;
}

const ServiceCard = ({ title, description, image, imageAlt, index }: ServiceCardProps) => {
  const isMobile = window.innerWidth <= 820;
  const animationClass = isMobile ? styles.reveal : styles.desktopReveal;
  const style = !isMobile ? { animationDelay: `${index * 300}ms` } : {};

  return (
    <div className={`${styles.servicoItem} ${animationClass}`} style={style}>
      <h2>{title}</h2>
      <img src={image} alt={imageAlt} />
      <p>{description}</p>
    </div>
  );
};

export default ServiceCard;
