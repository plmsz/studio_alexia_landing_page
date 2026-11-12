import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { DayPicker } from 'react-day-picker';
import { ptBR } from 'react-day-picker/locale';
import 'react-day-picker/src/style.css';
import dayjs from 'dayjs';
import { blockedDatesApi } from '../../appointments/api/scheduleApi';
import type { BlockedDate } from '../../../shared/types';
import Modal from '../../../shared/ui/Modal';
import styles from './styles.module.css';
import customStyles from './DateBlocker.module.css';

const TYPE_LABELS: Record<BlockedDate['type'], string> = {
  holiday: 'Feriado',
  personal: 'Folga / Pessoal',
  maintenance: 'Manutenção / Reforma',
};

const DateBlocker = () => {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState('');
  const [type, setType] = useState<BlockedDate['type']>('holiday');
  const [submitting, setSubmitting] = useState(false);

  const [dateToDelete, setDateToDelete] = useState<BlockedDate | null>(null);

  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  useEffect(() => {
    loadBlockedDates();
  }, []);

  const loadBlockedDates = async () => {
    try {
      setLoading(true);
      const data = await blockedDatesApi.getAll();
      const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));
      setBlockedDates(sorted);
    } catch (err) {
      console.error('Erro ao carregar datas bloqueadas:', err);
      setFeedbackModal({
        isOpen: true,
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar as datas bloqueadas.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlockedDate = async (e: FormEvent) => {
    console.info(e)
    e.preventDefault();
    if (!selectedDate) {
      setFeedbackModal({
        isOpen: true,
        type: 'error',
        title: 'Atenção',
        message: 'Por favor, selecione uma data no calendário.',
      });
      return;
    }
    if (!reason.trim()) {
      setFeedbackModal({
        isOpen: true,
        type: 'error',
        title: 'Atenção',
        message: 'Por favor, informe o motivo do bloqueio.',
      });
      return;
    }

    const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');

    if (blockedDates.some(b => b.date === formattedDate)) {
      setFeedbackModal({
        isOpen: true,
        type: 'error',
        title: 'Atenção',
        message: 'Esta data já se encontra bloqueada na agenda.',
      });
      return;
    }

    try {
      setSubmitting(true);
      const newBlocked = await blockedDatesApi.create({
        date: formattedDate,
        reason: reason.trim(),
        type,
      });

      setBlockedDates(prev =>
        [...prev, newBlocked].sort((a, b) => a.date.localeCompare(b.date))
      );
      setSelectedDate(undefined);
      setReason('');
      setType('holiday');

      setFeedbackModal({
        isOpen: true,
        type: 'success',
        title: 'Sucesso',
        message: `Data ${dayjs(selectedDate).format('DD/MM/YYYY')} bloqueada com sucesso!`,
      });
    } catch (err) {
      console.error('Erro ao bloquear data:', err);
      setFeedbackModal({
        isOpen: true,
        type: 'error',
        title: 'Erro',
        message: 'Falha ao salvar o bloqueio da data.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!dateToDelete) return;
    try {
      await blockedDatesApi.delete(dateToDelete.id);
      setBlockedDates(prev => prev.filter(b => b.id !== dateToDelete.id));
      setDateToDelete(null);
      setFeedbackModal({
        isOpen: true,
        type: 'success',
        title: 'Sucesso',
        message: 'Bloqueio de data removido com sucesso!',
      });
    } catch (err) {
      console.error('Erro ao excluir bloqueio:', err);
      setFeedbackModal({
        isOpen: true,
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível remover o bloqueio.',
      });
    }
  };

  const disabledOrBlockedDays = blockedDates.map(b => new Date(`${b.date}T00:00:00`));

  if (loading) {
    return <div className={styles.loading}>Carregando datas bloqueadas...</div>;
  }

  return (
    <div style={{ marginTop: '2.5rem' }}>
      <div className={styles.header}>
        <div>
          <h1>Bloqueio de Datas</h1>
          <p style={{ color: 'var(--text-soft)', marginTop: '0.25rem', fontSize: '0.95rem' }}>
            Bloqueie datas específicas (feriados, férias ou manutenções) para impedir agendamentos.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {/* Formulário com estilização idêntica aos forms da aplicação */}
        <div className={customStyles.datePickerCard}>
          <h2 style={{ color: 'var(--gold)', fontFamily: 'var(--font-heading)', marginTop: 0, marginBottom: '1.5rem', fontSize: '1.4rem' }}>
            Novo Bloqueio
          </h2>

          <form onSubmit={handleAddBlockedDate} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Selecione a Data *</label>
              <div className={customStyles.datePickerWrapper}>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={ptBR}
                  modifiers={{
                    blocked: disabledOrBlockedDays,
                  }}
                  modifiersClassNames={{
                    blocked: 'day-blocked',
                  }}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Data Selecionada</label>
              <div className={customStyles.dateDisplay}>
                {selectedDate ? dayjs(selectedDate).format('DD/MM/YYYY') : 'Nenhuma data selecionada no calendário'}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="block-reason">Motivo do Bloqueio *</label>
              <input
                id="block-reason"
                type="text"
                required
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Ex: Feriado de Carnaval, Recesso..."
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="block-type">Tipo de Bloqueio *</label>
              <select
                id="block-type"
                value={type}
                onChange={e => setType(e.target.value as BlockedDate['type'])}
              >
                <option value="holiday">Feriado</option>
                <option value="personal">Folga / Pessoal</option>
                <option value="maintenance">Manutenção / Reforma</option>
              </select>
            </div>

            <div className={styles.formActions} style={{ marginTop: '0.5rem' }}>
              <button
                type="submit"
                className={styles.btnSubmit}
                style={{ width: '100%' }}
                disabled={submitting || !selectedDate || !reason.trim()}
              >
                {submitting ? 'Bloqueando...' : 'Bloquear Data'}
              </button>
            </div>
          </form>
        </div>

        {/* Lista de Datas Bloqueadas seguindo a tabela padrão */}
        <div>
          <div className={styles.header} style={{ marginBottom: '1rem', padding: '1rem 1.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--gold)' }}>
              Datas Bloqueadas ({blockedDates.length})
            </h2>
          </div>

          {blockedDates.length === 0 ? (
            <div className={styles.servicesList} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-soft)' }}>
              Nenhuma data bloqueada cadastrada.
            </div>
          ) : (
            <div className={styles.servicesList} style={{ overflowX: 'auto' }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Motivo</th>
                    <th>Tipo</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {blockedDates.map(b => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 600 }}>
                        {dayjs(`${b.date}T00:00:00`).format('DD/MM/YYYY')}
                      </td>
                      <td className={styles.description}>{b.reason}</td>
                      <td>
                        <span className={b.type === 'holiday' ? styles.badge : styles.badgeNo}>
                          {TYPE_LABELS[b.type]}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            type="button"
                            className={styles.btnDelete}
                            onClick={() => setDateToDelete(b)}
                          >
                            Desbloquear
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={Boolean(dateToDelete)}
        onClose={() => setDateToDelete(null)}
        title="Confirmar Desbloqueio"
        message={
          dateToDelete
            ? `Tem certeza que deseja remover o bloqueio do dia ${dayjs(`${dateToDelete.date}T00:00:00`).format('DD/MM/YYYY')} (${dateToDelete.reason})?`
            : ''
        }
        type="warning"
        confirmText="Sim, Desbloquear"
        cancelText="Cancelar"
        showCancel
        onConfirm={confirmDelete}
      />

      {/* Modal de Feedback */}
      <Modal
        isOpen={feedbackModal.isOpen}
        onClose={() => setFeedbackModal({ ...feedbackModal, isOpen: false })}
        title={feedbackModal.title}
        message={feedbackModal.message}
        type={feedbackModal.type}
        confirmText="OK"
      />
    </div>
  );
};

export default DateBlocker;
