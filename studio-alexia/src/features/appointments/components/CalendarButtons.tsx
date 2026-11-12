import { ICalendar, GoogleCalendar, OutlookCalendar } from 'datebook';
import { SiGoogle, SiApple } from 'react-icons/si';
import { LuMail, LuDownload } from 'react-icons/lu';
import { locationInfo, contactInfo } from '../../../shared/data/index';
import { downloadIcs } from '../../../shared/utils/downloadFile';
import styles from './CalendarButtons.module.css';

interface CalendarButtonsProps {
  date: string;     // YYYY-MM-DD
  time: string;     // HH:mm
  serviceName: string;
  duration: number; // em minutos
}

/**
 * Formata um objeto Date como ISO local sem sufixo UTC (YYYY-MM-DDTHH:mm:ss).
 */
const formatLocalIso = (d: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const CalendarButtons = ({
  date,
  time,
  serviceName,
  duration,
}: CalendarButtonsProps) => {
  // Cria a data no fuso local do navegador do cliente
  const start = new Date(`${date}T${time}:00`);
  const end = new Date(start.getTime() + duration * 60000);

  const eventConfig = {
    title: `Agendamento: ${serviceName} - Studio Alexia Menezes`,
    description:
      `Seu agendamento para ${serviceName} foi confirmado.\n\n` +
      `Observação: Tolerância máxima de atraso de 10 minutos.\n` +
      `Dúvidas ou cancelamentos: Entre em contato pelo WhatsApp ${contactInfo.phoneFormatted}.`,
    location: locationInfo.address,
    start,
    end,
  };

  // Google Calendar funciona perfeitamente com UTC (Z)
  const googleUrl = new GoogleCalendar(eventConfig).render();

  // O Outlook Web (deeplink) frequentemente interpreta o formato com 'Z' somando
  // Enviando o horário local explícito sem 'Z' (floating time local),
  const rawOutlookUrl = new OutlookCalendar(eventConfig).render();
  const startLocalStr = formatLocalIso(start);
  const endLocalStr = formatLocalIso(end);
  const outlookUrl = rawOutlookUrl
    .replace(/startdt=[^&]+/, `startdt=${encodeURIComponent(startLocalStr)}`)
    .replace(/enddt=[^&]+/, `enddt=${encodeURIComponent(endLocalStr)}`);

  const handleIcsDownload = () => {
    const icsContent = new ICalendar(eventConfig).render();
    downloadIcs(icsContent, 'agendamento-studio-alexia.ics');
  };

  return (
    <div className={styles.container}>
      <p className={styles.label}>Adicionar ao seu calendário:</p>
      <div className={styles.buttons}>
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.calendarBtn} ${styles.google}`}
        >
          <SiGoogle size={15} aria-hidden />
          Google Agenda
        </a>

        <button
          type="button"
          onClick={handleIcsDownload}
          className={`${styles.calendarBtn} ${styles.apple}`}
        >
          <SiApple size={15} aria-hidden />
          Apple Calendar
        </button>

        <a
          href={outlookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.calendarBtn} ${styles.outlook}`}
        >
          <LuMail size={15} aria-hidden />
          Outlook
        </a>

        <button
          type="button"
          onClick={handleIcsDownload}
          className={`${styles.calendarBtn} ${styles.ics}`}
        >
          <LuDownload size={15} aria-hidden />
          Baixar .ics
        </button>
      </div>
    </div>
  );
};

export default CalendarButtons;
