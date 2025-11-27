import { locationInfo } from '../../data/services';
import styles from './Location.module.css';

const Location = () => {
  return (
    <section id="localizacao" className={styles.section}>
      <h1>Localização</h1>
      <div className={styles.mapa}>
        <address>{locationInfo.address}</address>
        <iframe
          src={locationInfo.mapUrl}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Endereço do Studio Alexia Menezes no Google Maps"
        />
      </div>
    </section>
  );
};

export default Location;
