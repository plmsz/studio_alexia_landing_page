import { useState, useEffect } from 'react';
import { servicesApi, appointmentsApi } from '../../services/api';
import type { Service } from '../../types/service';
import type { Appointment } from '../../types/appointment';
import {
  generateTimeSlots,
  formatTime,
  getMinDate,
  getMaxDate,
  isWorkingDay,
} from '../../utils/scheduleUtils';
import styles from './AppointmentForm.module.css';

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
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadAppointments(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate && appointments) {
      const date = new Date(selectedDate + 'T00:00:00');
      const slots = generateTimeSlots(date, appointments);
      setTimeSlots(slots);
    }
  }, [selectedDate, appointments]);

  const loadServices = async () => {
    try {
      const data = await servicesApi.getAll();
      setServices(data);
    } catch (err) {
      showMessage('error', 'Erro ao carregar serviços');
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

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedTime(null);

    if (date) {
      const selectedDateObj = new Date(date + 'T00:00:00');
      if (!isWorkingDay(selectedDateObj)) {
        showMessage('error', 'O dia selecionado não é um dia de trabalho');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService || !selectedTime || !clientName || !clientContact) {
      showMessage('error', 'Preencha todos os campos obrigatórios');
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

      showMessage('success', 'Agendamento realizado com sucesso!');

      setSelectedService(null);
      setSelectedDate('');
      setSelectedTime(null);
      setClientName('');
      setClientContact('');

      if (selectedDate) {
        await loadAppointments(selectedDate);
      }
    } catch (err) {
      showMessage('error', 'Erro ao realizar agendamento. Tente novamente.');
      console.error('Erro ao criar agendamento:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Agende seu Horário</h2>
      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}
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
    </div>
  );
};

export default AppointmentForm;
