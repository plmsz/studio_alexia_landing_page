import { useState, useEffect, useRef } from 'react';
import type { Service } from '../../types/service';
import { processImageFile } from '../../utils/imageUtils';
import styles from './Admin.module.css';

interface ServiceFormProps {
  service?: Service;
  onSubmit: (service: Omit<Service, 'id'> | Service) => void;
  onCancel: () => void;
}

const ServiceForm = ({ service, onSubmit, onCancel }: ServiceFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    imageAlt: '',
    featured: false,
    price: undefined as number | undefined,
    duration: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        description: service.description,
        image: service.image,
        imageAlt: service.imageAlt,
        featured: service.featured,
        price: service.price,
        duration: service.duration || ''
      });
    }
  }, [service]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.image) {
      newErrors.image = 'Imagem é obrigatória';
    }

    if (!formData.imageAlt.trim()) {
      newErrors.imageAlt = 'Texto alternativo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (service) {
      onSubmit({ ...service, ...formData });
    } else {
      onSubmit(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    let processedValue: string | boolean | number | undefined = value;

    if (type === 'checkbox') {
      processedValue = checked;
    } else if (name === 'price') {
      processedValue = value ? parseFloat(value) : undefined;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.image;
      return newErrors;
    });

    try {
      const base64Image = await processImageFile(file);
      setFormData(prev => ({ ...prev, image: base64Image }));
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        image: error instanceof Error ? error.message : 'Erro ao processar imagem'
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <h2>{service ? 'Editar Serviço' : 'Novo Serviço'}</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Título *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? styles.inputError : ''}
            />
            {errors.title && <span className={styles.error}>{errors.title}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Descrição *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              maxLength={300}
              className={errors.description ? styles.inputError : ''}
            />
            {errors.description && <span className={styles.error}>{errors.description}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Imagem *</label>
            
            {!formData.image ? (
              <div
                className={`${styles.uploadArea} ${isDragging ? styles.dragging : ''} ${errors.image ? styles.inputError : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleUploadClick}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  style={{ display: 'none' }}
                />
                {isProcessing ? (
                  <div className={styles.uploadText}>
                    <span>⏳ Processando imagem...</span>
                  </div>
                ) : (
                  <div className={styles.uploadText}>
                    <span>📁 Clique ou arraste uma imagem aqui</span>
                    <span className={styles.uploadHint}>JPG, PNG ou WebP - Máximo 2MB</span>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.imagePreview}>
                <img src={formData.image} alt="Preview" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className={styles.btnRemoveImage}
                >
                  ✕ Remover
                </button>
              </div>
            )}
            
            {errors.image && <span className={styles.error}>{errors.image}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="imageAlt">Texto alternativo da imagem *</label>
            <input
              type="text"
              id="imageAlt"
              name="imageAlt"
              value={formData.imageAlt}
              onChange={handleChange}
              className={errors.imageAlt ? styles.inputError : ''}
              maxLength={50}
            />
            {errors.imageAlt && <span className={styles.error}>{errors.imageAlt}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price">Preço (R$)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price || ''}
              onChange={handleChange}
              placeholder="Ex: 120.00"
              step="0.01"
              min="0"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="duration">Duração</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Ex: 1h 30min"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              <span>Destacar na página inicial</span>
            </label>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={onCancel} className={styles.btnCancel}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnSubmit}>
              {service ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
