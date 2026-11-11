import { useEffect } from 'react';
import styles from './ConfirmationModal.module.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentData: {
    date: string;
    time: string;
    serviceName: string;
    duration: number;
  };
}

const ConfirmationModal = ({ isOpen, onClose, appointmentData }: ConfirmationModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.icon}>✅</span>
          <h2 className={styles.title}>Agendamento Confirmado!</h2>
        </div>
        
        <div className={styles.content}>
          <div className={styles.info}>
            <span className={styles.emoji}>📅</span>
            <span>{appointmentData.date} às {appointmentData.time}</span>
          </div>
          
          <div className={styles.info}>
            <span className={styles.emoji}>💅</span>
            <span>{appointmentData.serviceName}</span>
          </div>
          
          <div className={styles.info}>
            <span className={styles.emoji}>⏱️</span>
            <span>Duração: {appointmentData.duration} minutos</span>
          </div>
        </div>
        
        <button className={styles.closeButton} onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
