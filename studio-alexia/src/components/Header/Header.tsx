import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className={styles.header}>
      {isHomePage ? (
        <>
          <a href="#servicos">Serviços</a>
          <a href="#horarios">Horário</a>
          <a href="#contato">Contato</a>
          <a href="#localizacao">Localização</a>
          <Link to="/agendar">Agende</Link>
        </>
      ) : (
        <>
          <Link to="/">Home</Link>
          <a href="/#servicos">Serviços</a>
          <a href="/#horarios">Horário</a>
          <a href="/#contato">Contato</a>
          <a href="/#localizacao">Localização</a>
          <Link to="/agendar">Agende</Link>
        </>
      )}
    </header>
  );
};

export default Header;
