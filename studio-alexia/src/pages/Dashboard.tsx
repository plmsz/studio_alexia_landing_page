import googleIconImg from '../assets/img/google-icon.svg';
import { useState, useEffect } from 'react';
import { servicesApi } from '../services/api';
import type { Service } from '../types/service';
import ServicesList from '../components/Admin/ServicesList';
import ServiceForm from '../components/Admin/ServiceForm';
import styles from '../components/Admin/Admin.module.css';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>(
    undefined
  );
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const { user, signInWithGoogle } = useAuth();

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await servicesApi.getAll();
      setServices(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar serviços');
      console.error('Erro ao buscar serviços:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCreate = () => {
    setEditingService(undefined);
    setShowForm(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await servicesApi.delete(id);
      await fetchServices();
      showMessage('success', 'Serviço deletado com sucesso!');
    } catch (err) {
      showMessage('error', 'Erro ao deletar serviço');
      console.error('Erro ao deletar:', err);
    }
  };

  const handleSubmit = async (serviceData: Omit<Service, 'id'> | Service) => {
    try {
      if ('id' in serviceData) {
        await servicesApi.update(serviceData.id, serviceData);
        showMessage('success', 'Serviço atualizado com sucesso!');
      } else {
        await servicesApi.create(serviceData);
        showMessage('success', 'Serviço criado com sucesso!');
      }

      setShowForm(false);
      setEditingService(undefined);
      await fetchServices();
    } catch (err) {
      showMessage('error', 'Erro ao salvar serviço');
      console.error('Erro ao salvar:', err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(undefined);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

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
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Gerenciar Serviços</h1>
        <button type="button" onClick={handleCreate} className={styles.btnAdd}>
          + Adicionar Serviço
        </button>
      </div>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <ServicesList
        services={services}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <ServiceForm
          service={editingService}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default Dashboard;
