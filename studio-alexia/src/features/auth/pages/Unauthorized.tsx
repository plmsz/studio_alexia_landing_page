import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './Unauthorized.module.css';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <svg
            className={styles.icon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h1 className={styles.title}>Acesso Negado</h1>
        <p className={styles.message}>
          {user
            ? `Desculpe, ${user.name}. Você não tem permissão para acessar esta área.`
            : 'Você precisa estar logado como administrador para acessar esta área.'}
        </p>
        {user && (
          <p className={styles.email}>Email: {user.email}</p>
        )}
        <button
          type="button"
          onClick={() => navigate('/')}
          className={styles.button}
        >
          Voltar para Home
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
