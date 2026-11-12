import { useAuth } from '../../auth/hooks/useAuth';
import { useState } from 'react';
import googleIconImg from '../../../shared/assets/img/google-icon.svg';

import AppointmentsList from '../components/AppointmentsList';
import styles from '../components/styles.module.css';
import ServicesManager from '../components/ServicesManager';

type TabType = 'services' | 'appointments';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('services');
  const { user, signInWithGoogle } = useAuth();

  async function handleSignIn() {
    if (!user) {
      await signInWithGoogle();
    }
  }

  if (!user) {
    return (
      <div className={styles.container}>
          <div className={styles.header}>
            Você não tem permissão para acessar o conteúdo desta página.
          <button onClick={handleSignIn} className={styles.btnLogin}>
            <img src={googleIconImg} alt="" />
            Faça login com sua conta Google
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabsContainer}>
        <button className={styles.tab + ' ' + (activeTab === 'services' ? styles.active : '')}          onClick={() => setActiveTab('services')}>Serviços</button>        <button          className={styles.tab + ' ' + (activeTab === 'appointments' ? styles.active : '')}          onClick={() => setActiveTab('appointments')}>Agendamentos</button>      </div>
        {activeTab === 'services' && <ServicesManager />}
        {activeTab === 'appointments' && <AppointmentsList />}
      </div>  );
}

Dashboard.tabTypes = ['services', 'appointments'];
export default Dashboard;
