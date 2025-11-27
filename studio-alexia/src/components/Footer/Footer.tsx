import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <img src="/src/assets/img/logo.png" alt="Logo Studio Alexia Menezes" />
      <p>© 2025 - Todos os direitos reservados</p>
    </footer>
  );
};

export default Footer;
