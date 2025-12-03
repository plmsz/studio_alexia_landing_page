import { contactInfo } from '../../data/services';
import styles from './Contact.module.css';
import instagramIcon from '../../assets/img/instagram-svgrepo-com.svg';
import phoneIcon from '../../assets/img/phone-svgrepo.svg';
import whatsappIcon from '../../assets/img/whatsapp-svgrepo-com.svg';

const Contact = () => {
  return (
    <section id="contato" className={styles.section}>
      <h1>Contato</h1>
      <div className={styles.containerContato}>
        <p>Entre em contato conosco para agendamento e mais informações.</p>
        <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className={styles.icon}>
          <img src={instagramIcon} alt="ícone do instagram" />
          {contactInfo.instagramHandle}
        </a>
        <a href={contactInfo.phone} className={styles.icon}>
          <img src={phoneIcon} alt="ícone de telefone" />
          {contactInfo.phoneFormatted}
        </a>
        <a href={contactInfo.whatsapp} target="_blank" rel="noopener noreferrer">
          <button type="button">
            <img src={whatsappIcon} alt="ícone do whatsapp" />
            Envie uma mensagem
          </button>
        </a>
      </div>
    </section>
  );
};

export default Contact;
