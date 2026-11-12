import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { businessHoursApi } from '../../appointments/api/scheduleApi';
import type { BusinessHours } from '../../../shared/types';
import Modal from '../../../shared/ui/Modal';
import styles from './styles.module.css';

const DAYS_NAMES = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

const BusinessHoursManager = () => {
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  const [editingDay, setEditingDay] = useState<BusinessHours | null>(null);

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
    loadHours();
  }, []);

  const sortBusinessHours = (list: BusinessHours[]) => {
    return [...list].sort((a, b) => {
      const orderA = a.dayOfWeek === 0 ? 7 : a.dayOfWeek;
      const orderB = b.dayOfWeek === 0 ? 7 : b.dayOfWeek;
      return orderA - orderB;
    });
  };

  const loadHours = async () => {
    try {
      setLoading(true);
      const data = await businessHoursApi.getAll();
      setBusinessHours(sortBusinessHours(data));
    } catch (err) {
      console.error('Erro ao carregar expediente:', err);
      setFeedbackModal({
        isOpen: true,
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar os horários de funcionamento.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item: BusinessHours) => {
    setEditingDay({ ...item });
  };

  const handleToggleWorking = async (item: BusinessHours) => {
    try {
      setSavingId(item.id);
      const updated = await businessHoursApi.update(item.id, {
        isWorking: !item.isWorking,
      });
      setBusinessHours(prev =>
        sortBusinessHours(
          prev.map(h => (h.id === item.id ? { ...h, ...updated } : h))
        )
      );
    } catch (err) {
      console.error('Erro ao alterar status de funcionamento:', err);
      setFeedbackModal({
        isOpen: true,
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível atualizar o dia.',
      });
    } finally {
      setSavingId(null);
    }
  };

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingDay) return;

    const hasBreakStart = Boolean(editingDay.breakStart);
    const hasBreakEnd = Boolean(editingDay.breakEnd);
    if ((hasBreakStart && !hasBreakEnd) || (!hasBreakStart && hasBreakEnd)) {
      setFeedbackModal({
        isOpen: true,
        type: 'error',
        title: 'Atenção',
        message: 'Preencha ambos os horários de início e término do intervalo ou deixe ambos vazios.',
      });
      return;
    }

    try {
      setSavingId(editingDay.id);
      const payload: Partial<BusinessHours> = {
        open: editingDay.open,
        close: editingDay.close,
        breakStart: editingDay.breakStart || null,
        breakEnd: editingDay.breakEnd || null,
        isWorking: editingDay.isWorking,
      };

      const updated = await businessHoursApi.update(editingDay.id, payload);
      setBusinessHours(prev =>
        sortBusinessHours(
          prev.map(h => (h.id === updated.id ? { ...h, ...updated } : h))
        )
      );
      setEditingDay(null);
      setFeedbackModal({
        isOpen: true,
        type: 'success',
        title: 'Sucesso',
        message: 'Horário de funcionamento atualizado com sucesso!',
      });
    } catch (err) {
      console.error('Erro ao salvar horários:', err);
      setFeedbackModal({
        isOpen: true,
        type: 'error',
        title: 'Erro',
        message: 'Falha ao salvar as alterações do horário.',
      });
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando expediente...</div>;
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1>Expediente Semanal</h1>
          <p style={{ color: 'var(--text-soft)', marginTop: '0.25rem', fontSize: '0.95rem' }}>
            Configure o horário de abertura, fechamento, intervalos e dias de folga do estúdio.
          </p>
        </div>
      </div>

      <div className={styles.servicesList} style={{ overflowX: 'auto' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Dia da Semana</th>
              <th>Status</th>
              <th>Abertura</th>
              <th>Fechamento</th>
              <th>Início Intervalo</th>
              <th>Fim Intervalo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {businessHours.map(bh => (
              <tr key={bh.id}>
                <td style={{ fontWeight: 600 }}>{DAYS_NAMES[bh.dayOfWeek]}</td>
                <td>
                  <span className={bh.isWorking ? styles.badge : styles.badgeNo}>
                    {bh.isWorking ? 'Aberto' : 'Fechado'}
                  </span>
                </td>
                <td>{bh.open}</td>
                <td>{bh.close}</td>
                <td>{bh.breakStart || '-'}</td>
                <td>{bh.breakEnd || '-'}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.btnEdit}
                      onClick={() => handleEditClick(bh)}
                      disabled={savingId === bh.id}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className={styles.btnDelete}
                      style={{
                        backgroundColor: bh.isWorking ? 'var(--primary)' : 'var(--secondary)',
                      }}
                      onClick={() => handleToggleWorking(bh)}
                      disabled={savingId === bh.id}
                    >
                      {bh.isWorking ? 'Fechar' : 'Abrir'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Edição seguindo padrão formContainer / formGroup */}
      {editingDay && (
        <div className={styles.formOverlay} onClick={() => setEditingDay(null)}>
          <div className={styles.formContainer} onClick={e => e.stopPropagation()}>
            <h2>Editar Expediente: {DAYS_NAMES[editingDay.dayOfWeek]}</h2>

            <form onSubmit={handleSaveEdit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={editingDay.isWorking}
                    onChange={e => setEditingDay({ ...editingDay, isWorking: e.target.checked })}
                  />
                  <span>Dia de funcionamento ativo</span>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label htmlFor="openTime">Abertura *</label>
                  <input
                    id="openTime"
                    type="time"
                    required
                    value={editingDay.open}
                    onChange={e => setEditingDay({ ...editingDay, open: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="closeTime">Fechamento *</label>
                  <input
                    id="closeTime"
                    type="time"
                    required
                    value={editingDay.close}
                    onChange={e => setEditingDay({ ...editingDay, close: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--white-10)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                <span style={{ color: 'var(--gold)', fontWeight: 600, display: 'block', marginBottom: '1rem' }}>
                  Intervalo / Pausa de Almoço (opcional)
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.formGroup}>
                    <label htmlFor="breakStart">Início Intervalo</label>
                    <input
                      id="breakStart"
                      type="time"
                      value={editingDay.breakStart || ''}
                      onChange={e => setEditingDay({ ...editingDay, breakStart: e.target.value || null })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="breakEnd">Fim Intervalo</label>
                    <input
                      id="breakEnd"
                      type="time"
                      value={editingDay.breakEnd || ''}
                      onChange={e => setEditingDay({ ...editingDay, breakEnd: e.target.value || null })}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setEditingDay(null)}
                  className={styles.btnCancel}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.btnSubmit}
                  disabled={savingId === editingDay.id}
                >
                  {savingId === editingDay.id ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default BusinessHoursManager;
