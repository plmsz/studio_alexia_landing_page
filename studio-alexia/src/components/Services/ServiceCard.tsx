import type { Service } from '../../types/service';
import { formatPrice, formatDuration } from '../../utils/formatUtils';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import styles from './Services.module.css';

interface ServiceCardProps extends Service {
  index: number;
}

const ServiceCard = ({ title, description, image, imageAlt, price, duration, index }: ServiceCardProps) => {
  const { elementRef, isVisible } = useScrollAnimation(index);
  const isMobile = window.innerWidth <= 820;
  
  const showPriceOrDuration = price || duration;

  return (
    <div 
      ref={elementRef}
      className={`${styles.servicoItem} ${isMobile && index > 0 ? styles.reveal : ''} ${isVisible ? styles.active : ''} ${!isMobile ? styles.desktopReveal : ''}`}
      style={!isMobile ? { animationDelay: `${index * 300}ms` } : {}}
    >
      <h2>{title}</h2>
      <img src={image} alt={imageAlt} />
      <p>{description}</p>
      {showPriceOrDuration && (
        <div className={styles.serviceInfo}>
          {price && <span className={styles.price}>{formatPrice(price)}</span>}
          {price && duration && <span className={styles.separator}>|</span>}
          {duration && <span className={styles.duration}>{formatDuration(duration)}</span>}
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
