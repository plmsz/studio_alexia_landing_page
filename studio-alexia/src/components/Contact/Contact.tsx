import { contactInfo } from '../../data/services';
import styles from './Contact.module.css';

const Contact = () => {
  return (
    <section id="contato" className={styles.section}>
      <h1>Contato</h1>
      <div className={styles.containerContato}>
        <p>Entre em contato conosco para agendamento e mais informações.</p>
        <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className={styles.icon}>
          <img src="/src/assets/img/instagram-svgrepo-com.svg" alt="ícone do instagram" />
          {contactInfo.instagramHandle}
        </a>
        <a href={contactInfo.phone} className={styles.icon}>
          <img src="/src/assets/img/phone-svgrepo.svg" alt="ícone de telefone" />
          {contactInfo.phoneFormatted}
        </a>
        <a href={contactInfo.whatsapp} target="_blank" rel="noopener noreferrer">
          <button type="button">
            <img src="/src/assets/img/whatsapp-svgrepo-com.svg" alt="ícone do whatsapp" />
            Envie uma mensagem
          </button>
        </a>
      </div>
    </section>
  );
};

export default Contact;
