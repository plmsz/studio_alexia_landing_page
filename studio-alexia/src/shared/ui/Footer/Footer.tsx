import styles from './Footer.module.css';
import logo from '../../assets/img/logo.png';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <img src={logo} alt="Logo Studio Alexia Menezes" />
      <p>© 2025 - Todos os direitos reservados</p>
    </footer>
  );
};

export default Footer;
