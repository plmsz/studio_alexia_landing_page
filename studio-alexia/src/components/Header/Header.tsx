import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const location = useLocation();
  const isServicesPage = location.pathname === '/servicos';

  return (
    <header className={styles.header}>
      {isServicesPage ? (
        <>
          <Link to="/">Home</Link>
          <a href="/#horarios">Horário</a>
          <a href="/#contato">Contato</a>
          <a href="/#localizacao">Localização</a>
        </>
      ) : (
        <>
          <a href="#servicos">Serviços</a>
          <a href="#horarios">Horário</a>
          <a href="#contato">Contato</a>
          <a href="#localizacao">Localização</a>
        </>
      )}
    </header>
  );
};

export default Header;
