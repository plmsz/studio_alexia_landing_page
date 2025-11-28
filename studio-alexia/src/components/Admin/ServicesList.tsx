import type { Service } from '../../types/service';
import { formatPrice, formatDuration } from '../../utils/formatUtils';
import styles from './Admin.module.css';

interface ServicesListProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: number) => void;
}

const ServicesList = ({ services, onEdit, onDelete }: ServicesListProps) => {
  const handleDelete = (id: number, title: string) => {
    if (window.confirm(`Tem certeza que deseja deletar "${title}"?`)) {
      onDelete(id);
    }
  };
  return (
    <div className={styles.servicesList}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Título</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Duração</th>
            <th>Destacado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service.id}>
              <td>{service.id}</td>
              <td>{service.title}</td>
              <td className={styles.description}>{service.description}</td>
              <td>{formatPrice(service.price)}</td>
              <td>{formatDuration(service.duration)}</td>
              <td>
                {service.featured ? (
                  <span className={styles.badge}>Sim</span>
                ) : (
                  <span className={styles.badgeNo}>Não</span>
                )}
              </td>
              <td>
                <div className={styles.actions}>
                  <button
                    type="button"
                    onClick={() => onEdit(service)}
                    className={styles.btnEdit}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(service.id, service.title)}
                    className={styles.btnDelete}
                  >
                    Deletar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServicesList;
