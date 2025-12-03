import { useState, useEffect } from 'react';
import { servicesApi, appointmentsApi } from '../../services/api';
import type { Service } from '../../types/service';
import type { Appointment } from '../../types/appointment';
import {
  generateTimeSlots,
  formatTime,
  formatDate,
  getMinDate,
  getMaxDate,
  isWorkingDay,
} from '../../utils/scheduleUtils';
import Modal from '../common/Modal';
import styles from './AppointmentForm.module.css';
import calendarIcon from '../../assets/img/calendar.svg';
import paintIcon from '../../assets/img/paint.svg';
import timeIcon from '../../assets/img/time.svg';

const AppointmentForm = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [timeSlots, setTimeSlots] = useState<
    { time: Date; available: boolean }[]
  >([]);

  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');

  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    data: {
      date: string;
      time: string;
      serviceName: string;
      duration: number;
    } | null;
  }>({
    isOpen: false,
    data: null,
  });
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: '',
  });

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadAppointments(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate && appointments && selectedService) {
      const date = new Date(selectedDate + 'T00:00:00');
      const slots = generateTimeSlots(
        date,
        appointments,
        selectedService.duration
      );
      setTimeSlots(slots);
    } else if (selectedDate && appointments) {
      const date = new Date(selectedDate + 'T00:00:00');
      const slots = generateTimeSlots(date, appointments);
      setTimeSlots(slots);
    }
  }, [selectedDate, appointments, selectedService]);

  const loadServices = async () => {
    try {
      const data = await servicesApi.getAll();
      setServices(data);
    } catch (err) {
      setErrorModal({
        isOpen: true,
        message: 'Erro ao carregar serviços',
      });
      console.error('Erro ao buscar serviços:', err);
    }
  };

  const loadAppointments = async (date: string) => {
    try {
      const data = await appointmentsApi.getByDate(date);
      setAppointments(data);
    } catch (err) {
      console.error('Erro ao buscar agendamentos:', err);
      setAppointments([]);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedTime(null);

    if (date) {
      const selectedDateObj = new Date(date + 'T00:00:00');
      if (!isWorkingDay(selectedDateObj)) {
        setErrorModal({
          isOpen: true,
          message: 'O dia selecionado não é um dia de trabalho',
        });
      }
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccessModal({ isOpen: false, data: null });
  };

  const handleCloseErrorModal = () => {
    setErrorModal({ isOpen: false, message: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService || !selectedTime || !clientName || !clientContact) {
      setErrorModal({
        isOpen: true,
        message: 'Preencha todos os campos obrigatórios',
      });
      return;
    }

    setLoading(true);

    try {
      const endTime = new Date(
        selectedTime.getTime() + selectedService.duration * 60000
      );

      const appointment: Omit<Appointment, 'id'> = {
        serviceId: selectedService.id,
        startTime: selectedTime,
        endTime,
        clientName,
        clientContact,
      };

      await appointmentsApi.create(appointment);

      const appointmentDate = new Date(selectedDate + 'T00:00:00');

      setSuccessModal({
        isOpen: true,
        data: {
          date: formatDate(appointmentDate),
          time: formatTime(selectedTime),
          serviceName: selectedService.title,
          duration: selectedService.duration,
        },
      });

      setSelectedService(null);
      setSelectedDate('');
      setSelectedTime(null);
      setClientName('');
      setClientContact('');

      if (selectedDate) {
        await loadAppointments(selectedDate);
      }
    } catch (err) {
      setErrorModal({
        isOpen: true,
        message: 'Erro ao realizar agendamento. Tente novamente.',
      });
      console.error('Erro ao criar agendamento:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Agende seu Horário</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="service">Serviço *</label>
          <select
            id="service"
            value={selectedService?.id || ''}
            onChange={(e) => {
              const service = services.find(
                (s) => Number(s.id) === Number(e.target.value)
              );
              setSelectedService(service || null);
            }}
            required
            className={styles.select}
          >
            <option value="">Selecione um serviço</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title} - {service.duration} min
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="date">Data *</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={getMinDate()}
            max={getMaxDate()}
            required
            className={styles.input}
          />
        </div>

        {selectedDate && timeSlots.length > 0 && (
          <div className={styles.formGroup}>
            <label>Horário Disponível *</label>
            <div className={styles.timeSlots}>
              {timeSlots.map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  className={`${styles.timeSlot} ${
                    !slot.available ? styles.unavailable : ''
                  } ${
                    selectedTime?.getTime() === slot.time.getTime()
                      ? styles.selected
                      : ''
                  }`}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                >
                  {formatTime(slot.time)}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedDate && timeSlots.length === 0 && (
          <div className={styles.noSlots}>
            Não há horários disponíveis para esta data
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="name">Nome Completo *</label>
          <input
            type="text"
            id="name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
            className={styles.input}
            placeholder="Digite seu nome completo"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="contact">WhatsApp *</label>
          <input
            type="tel"
            id="contact"
            value={clientContact}
            onChange={(e) => setClientContact(e.target.value)}
            required
            className={styles.input}
            placeholder="(00) 00000-0000"
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={
            loading ||
            !selectedService ||
            !selectedTime ||
            !clientName ||
            !clientContact
          }
        >
          {loading ? 'Agendando...' : 'Confirmar Agendamento'}
        </button>
      </form>

      <Modal
        isOpen={successModal.isOpen}
        onClose={handleCloseSuccessModal}
        title="Agendamento Confirmado!"
        type="success"
        confirmText="Fechar"
      >
        {successModal.data && (
          <div style={{ textAlign: 'left', marginTop: '1rem' }}>
            <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>
              <span style={{ marginRight: '0.5rem' }}>
                <img height="24px" src={calendarIcon} alt="" />
              </span>
              {successModal.data.date} às {successModal.data.time}
            </p>
            <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>
              <span style={{ marginRight: '0.5rem' }}>
                <img height="24px" src={paintIcon} alt="" />
              </span>
              {successModal.data.serviceName}
            </p>
            <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>
              <span style={{ marginRight: '0.5rem' }}>
                <img height="24px" src={timeIcon} alt="" />
              </span>
              Duração: {successModal.data.duration} minutos
            </p>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={errorModal.isOpen}
        onClose={handleCloseErrorModal}
        title="Erro"
        message={errorModal.message}
        type="error"
        confirmText="OK"
      />
    </div>
  );
};

export default AppointmentForm;
