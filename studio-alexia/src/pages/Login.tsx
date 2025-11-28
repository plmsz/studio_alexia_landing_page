import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './Login.module.css';
import googleIcon from '../assets/img/google-icon.svg';

const Login = () => {
  const navigate = useNavigate();
  const { user, isAdmin, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin', { replace: true });
    } else if (user && !isAdmin) {
      navigate('/unauthorized', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // O useEffect acima vai cuidar do redirecionamento
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao fazer login. Tente novamente.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <svg
            className={styles.lockIcon}
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

        <h1 className={styles.title}>Área Administrativa</h1>
        <p className={styles.subtitle}>
          Faça login para acessar o painel de administração
        </p>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className={styles.googleButton}
        >
          <img src={googleIcon} alt="Google" className={styles.googleIcon} />
          <span>Entrar com Google</span>
        </button>

        <p className={styles.info}>
          Apenas administradores autorizados têm acesso a esta área
        </p>
      </div>
    </div>
  );
};

export default Login;
