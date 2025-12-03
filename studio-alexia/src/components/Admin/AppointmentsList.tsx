import { useState, useEffect } from 'react';
import { appointmentsApi, servicesApi } from '../../services/api';
import type { Appointment } from '../../types/appointment';
import type { Service } from '../../types/service';
import { formatDateTime, formatDate, formatTime } from '../../utils/scheduleUtils';
import styles from './Admin.module.css';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState('');
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appointmentsData, servicesData] = await Promise.all([
        appointmentsApi.getAll(),
        servicesApi.getAll(),
      ]);
      setAppointments(appointmentsData);
      setServices(servicesData);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar agendamentos');
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      return;
    }

    try {
      await appointmentsApi.delete(id);
      await loadData();
      showMessage('success', 'Agendamento cancelado com sucesso!');
    } catch (err) {
      showMessage('error', 'Erro ao cancelar agendamento');
      console.error('Erro ao deletar:', err);
    }
  };

  const getServiceName = (serviceId: number): string => {
    const service = services.find((s) => s.id === serviceId);
    return service ? service.title : 'Serviço não encontrado';
  };

  const filteredAppointments = filterDate
    ? appointments.filter((apt) => {
        const aptDate = formatDate(new Date(apt.startTime));
        const filterDateFormatted = formatDate(
          new Date(filterDate + 'T00:00:00')
        );
        return aptDate === filterDateFormatted;
      })
    : appointments;

  const sortedAppointments = [...filteredAppointments].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  const upcomingAppointments = sortedAppointments.filter(
    (apt) => new Date(apt.startTime) >= new Date()
  );

  const pastAppointments = sortedAppointments.filter(
    (apt) => new Date(apt.startTime) < new Date()
  );

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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Agendamentos</h2>
        <div className={styles.filterGroup}>
          <label htmlFor="filterDate">Filtrar por data:</label>
          <input
            type="date"
            id="filterDate"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className={styles.filterInput}
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className={styles.btnClear}
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      {upcomingAppointments.length > 0 && (
        <div className={styles.appointmentsSection}>
          <h3>Próximos Agendamentos ({upcomingAppointments.length})</h3>
          <div className={styles.appointmentsList}>
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className={styles.appointmentCard}>
                <div className={styles.appointmentHeader}>
                  <h4>{getServiceName(appointment.serviceId)}</h4>
                  <div>
                    <span className={styles.appointmentDate}>
                      {formatDateTime(new Date(appointment.startTime))} até &nbsp;
                       {formatTime(new Date(appointment.endTime))}
                    </span>
                  </div>
                </div>
                <div className={styles.appointmentDetails}>
                  <p>
                    <strong>Cliente:</strong> {appointment.clientName}
                  </p>
                  <p>
                    <strong>Contato:</strong> {appointment.clientContact}
                  </p>
                </div>
                <div className={styles.appointmentActions}>
                  <button
                    onClick={() =>
                      appointment.id && handleDelete(appointment.id)
                    }
                    className={styles.btnDelete}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pastAppointments.length > 0 && (
        <div className={styles.appointmentsSection}>
          <h3>Agendamentos Anteriores ({pastAppointments.length})</h3>
          <div className={styles.appointmentsList}>
            {pastAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className={`${styles.appointmentCard} ${styles.past}`}
              >
                <div className={styles.appointmentHeader}>
                  <h4>{getServiceName(appointment.serviceId)}</h4>
                  <span className={styles.appointmentDate}>
                    {formatDateTime(new Date(appointment.startTime))}
                  </span>
                </div>
                <div className={styles.appointmentDetails}>
                  <p>
                    <strong>Cliente:</strong> {appointment.clientName}
                  </p>
                  <p>
                    <strong>Contato:</strong> {appointment.clientContact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sortedAppointments.length === 0 && (
        <div className={styles.empty}>
          {filterDate
            ? 'Nenhum agendamento encontrado para esta data'
            : 'Nenhum agendamento encontrado'}
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;
