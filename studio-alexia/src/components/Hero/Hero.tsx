import styles from './Hero.module.css';
// FIXME: botão a esquerda em telas maiores
const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContainer}>
        <h1>Realce seu olhar</h1>
        <p>Realçamos a beleza do seu olhar com nossos serviços especializados.</p>
        <a href="#contato">
          <button type="button">Agende agora</button>
        </a>
      </div>
    </section>
  );
};

export default Hero;
