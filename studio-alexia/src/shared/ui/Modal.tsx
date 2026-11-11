import { useEffect } from 'react';
import type { ReactNode } from 'react';
import styles from './Modal.module.css';

export type ModalType = 'info' | 'success' | 'warning' | 'error' | 'confirm';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  type?: ModalType;
  icon?: string;
  children?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  icon,
  children,
  confirmText = 'OK',
  cancelText = 'Cancelar',
  onConfirm,
  showCancel = false,
}: ModalProps) => {
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

  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'confirm':
        return '❓';
      default:
        return 'ℹ️';
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.icon}>{getIcon()}</span>
          <h2 className={styles.title}>{title}</h2>
        </div>
        
        <div className={styles.content}>
          {message && <p className={styles.message}>{message}</p>}
          {children}
        </div>
        
        <div className={styles.actions}>
          {showCancel && (
            <button 
              className={`${styles.button} ${styles.buttonCancel}`} 
              onClick={onClose}
            >
              {cancelText}
            </button>
          )}
          <button 
            className={`${styles.button} ${styles.buttonConfirm}`} 
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
