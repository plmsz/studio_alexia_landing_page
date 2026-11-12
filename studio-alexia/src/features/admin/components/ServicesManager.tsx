import { useState, useEffect } from 'react';
import type { Service } from '../../services/types';
import { servicesApi } from '../../services/api/servicesApi';
import ServicesList from './ServicesList';
import ServiceForm from './ServiceForm';
import styles from './styles.module.css';


interface ServicesManagerState {
  services: Service[];
  loading: boolean;
  error: string | null;
  showForm: boolean;
  editingService: Service | undefined;
  message: { type: 'success' | 'error'; text: string } | null;
}

const ServicesManager: React.FC = () => {
  const [state, setState] = useState<ServicesManagerState>({
    services: [],
    loading: true,
    error: null,
    showForm: false,
    editingService: undefined,
    message: null,
  });

  const fetchServices = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const data = await servicesApi.getAll();
      setState(prev => ({ ...prev, services: data, error: null, loading: false }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Erro ao carregar serviços', loading: false }));
      console.error('Erro ao buscar serviços:', err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setState(prev => ({ ...prev, message: { type, text } }));
    setTimeout(() => setState(prev => ({ ...prev, message: null })), 3000);
  };

  const handleCreate = () => {
    setState(prev => ({ ...prev, editingService: undefined, showForm: true }));
  };

  const handleEdit = (service: Service) => {
    setState(prev => ({ ...prev, editingService: service, showForm: true }));
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

      setState(prev => ({ ...prev, showForm: false, editingService: undefined }));
      await fetchServices();
    } catch (err) {
      showMessage('error', 'Erro ao salvar serviço');
      console.error('Erro ao salvar:', err);
    }
  };

  const handleCancel = () => {
    setState(prev => ({ ...prev, showForm: false, editingService: undefined }));
  };

  if (state.loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Carregando...</div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{state.error}</div>
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

      {state.message && (
        <div className={`${styles.message} ${styles[state.message.type]}`}>
          {state.message.text}
        </div>
      )}

      <ServicesList
        services={state.services}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {state.showForm && (
        <ServiceForm
          service={state.editingService}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default ServicesManager;