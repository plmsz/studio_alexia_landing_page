import { schedule } from '../../data/services';
import styles from './Schedule.module.css';

const Schedule = () => {
  return (
    <section id="horarios" className={styles.section}>
      <h1>Horários</h1>
      <div className={styles.horariosContainer}>
        <ul className={styles.dias}>
          {schedule.map((item, index) => (
            <li key={index}>{item.day}</li>
          ))}
        </ul>
        <ul className={styles.hora}>
          {schedule.map((item, index) => (
            <li key={index}>{item.hours}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Schedule;
