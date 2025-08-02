// hooks/useMedicationAlerts.js
import { useEffect } from 'react';

const useMedicationAlerts = (drugs) => {
  useEffect(() => {
    if (!('Notification' in window)) return;

    Notification.requestPermission();

    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      drugs.forEach((drug) => {
        const times = getDoseTimes(drug.dosage);
        times.forEach((time) => {
          const [hour, minute] = time.split(':').map(Number);
          if (hour === currentHours && minute === currentMinutes) {
            notifyUser(drug.name);
          }
        });
      });
    }, 60000); // check every minute

    return () => clearInterval(interval);
  }, [drugs]);
};

const getDoseTimes = (dosesPerDay) => {
  const startHour = 6;
  const endHour = 20;
  const interval = (endHour - startHour) / (dosesPerDay - 1);
  const times = [];

  for (let i = 0; i < dosesPerDay; i++) {
    const hour = Math.floor(startHour + i * interval);
    const minute = Math.floor(((startHour + i * interval) % 1) * 60);
    const hStr = hour.toString().padStart(2, '0');
    const mStr = minute.toString().padStart(2, '0');
    times.push(`${hStr}:${mStr}`);
  }

  return times;
};

const notifyUser = (drugName) => {
  if (Notification.permission === 'granted') {
    new Notification('Time to take your medication', {
      body: `It's time to take your dose of ${drugName}`,
      icon: '/pill.png',
    });
  }
};

export default useMedicationAlerts;
