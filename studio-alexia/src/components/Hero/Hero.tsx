import { Link } from 'react-router-dom';
import styles from './Hero.module.css';
// FIXME: botão a esquerda em telas maiores
const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContainer}>
        <h1>Realce seu olhar</h1>
        <p>
          Realçamos a beleza do seu olhar com nossos serviços especializados.
        </p>
        <Link to="/agendar">
          <button type="button">Agende agora</button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
