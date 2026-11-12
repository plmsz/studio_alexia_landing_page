import { ICalendar, GoogleCalendar, OutlookCalendar } from 'datebook';
import styles from './CalendarButtons.module.css';

interface CalendarButtonsProps {
  date: string;       // YYYY-MM-DD
  time: string;       // HH:mm
  serviceName: string;
  duration: number;   // em minutos
}

const STUDIO_LOCATION =
  'Rua Jerusalém de Cajazeiras, 539, Fazenda Grande II, Salvador/BA';

const CalendarButtons = ({
  date,
  time,
  serviceName,
  duration,
}: CalendarButtonsProps) => {
  const start = new Date(`${date}T${time}:00`);
  const end = new Date(start.getTime() + duration * 60000);

  const eventConfig = {
    title: `Agendamento: ${serviceName} - Studio Alexia Menezes`,
    description:
      `Seu agendamento para ${serviceName} foi confirmado.\n\n` +
      `Observação: Tolerância máxima de atraso de 10 minutos.\n` +
      `Dúvidas ou cancelamentos: Entre em contato pelo WhatsApp (71) 9114-6856.`,
    location: STUDIO_LOCATION,
    start,
    end,
  };

  const googleUrl = new GoogleCalendar(eventConfig).render();
  const outlookUrl = new OutlookCalendar(eventConfig).render();

  const downloadIcs = () => {
    const icsContent = new ICalendar(eventConfig).render();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'agendamento-studio-alexia.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          📅 Google Agenda
        </a>

        <button
          type="button"
          onClick={downloadIcs}
          className={`${styles.calendarBtn} ${styles.apple}`}
        >
          🍏 Apple Calendar
        </button>

        <a
          href={outlookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.calendarBtn} ${styles.outlook}`}
        >
          ✉️ Outlook
        </a>

        <button
          type="button"
          onClick={downloadIcs}
          className={`${styles.calendarBtn} ${styles.ics}`}
        >
          💾 Baixar .ics
        </button>
      </div>
    </div>
  );
};

export default CalendarButtons;
