import type { Service } from '../../types/service';
import { formatPrice, formatDuration } from '../../utils/formatUtils';
import styles from './Services.module.css';

interface ServiceCardProps extends Service {
  index: number;
}

const ServiceCard = ({ title, description, image, imageAlt, price, duration, index }: ServiceCardProps) => {
  const isMobile = window.innerWidth <= 820;
  const animationClass = isMobile ? styles.reveal : styles.desktopReveal;
  const style = !isMobile ? { animationDelay: `${index * 300}ms` } : {};

  const showPriceOrDuration = price || duration;

  return (
    <div className={`${styles.servicoItem} ${animationClass}`} style={style}>
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
