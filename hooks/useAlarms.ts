import { useCallback, useRef, useState } from 'react';
import { cancelAllRaceNotifications, cancelRaceNotification, scheduleRaceNotification } from '../services/notificationService';

interface Race {
  time: string;
  place: string;
  details: string;
  runners: number;
}

const getRaceId = (race: Race) => `${race.time}-${race.place}`;

export function useAlarms(allRaces: Race[] | null) {
  const [activeAlarms, setActiveAlarms] = useState<Set<string>>(new Set());
  const [warningAlarms, setWarningAlarms] = useState<Set<string>>(new Set());
  const notificationTimeoutIds = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const scheduleRaceAlarm = useCallback((race: Race) => {
    const raceId = getRaceId(race);
    const now = new Date();
    const [hours, minutes] = race.time.split(':').map(Number);
    const raceDateTime = new Date();
    raceDateTime.setHours(hours, minutes, 0, 0);

    const twoMinutesBeforeRace = new Date(raceDateTime.getTime() - 2 * 60 * 1000);

    if (twoMinutesBeforeRace > now) {
      const delay = twoMinutesBeforeRace.getTime() - now.getTime();
      const timeoutId = setTimeout(() => {
        void scheduleRaceNotification(race, raceDateTime);
        setWarningAlarms(prev => new Set(prev).add(raceId));
      }, delay);
      notificationTimeoutIds.current.set(raceId, timeoutId);
    }
  }, []);

  const cancelRaceAlarm = useCallback((race: Race) => {
    const raceId = getRaceId(race);
    const timeoutId = notificationTimeoutIds.current.get(raceId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      notificationTimeoutIds.current.delete(raceId);
    }
    void cancelRaceNotification(race);
  }, []);

  const handleToggleRaceAlarm = useCallback((race: Race) => {
    const raceId = getRaceId(race);
    const newActiveAlarms = new Set(activeAlarms);
    if (newActiveAlarms.has(raceId)) {
      newActiveAlarms.delete(raceId);
      cancelRaceAlarm(race);
    } else {
      newActiveAlarms.add(raceId);
      scheduleRaceAlarm(race);
    }
    setActiveAlarms(newActiveAlarms);
  }, [activeAlarms, allRaces, cancelRaceAlarm, scheduleRaceAlarm]);

  const handleToggleAlarms = useCallback(() => {
    if (activeAlarms.size > 0) {
      void cancelAllRaceNotifications();
      notificationTimeoutIds.current.forEach(clearTimeout);
      notificationTimeoutIds.current.clear();
      setActiveAlarms(new Set());
    } else {
      const newActiveAlarms = new Set<string>();
      const now = new Date();
      allRaces?.forEach(race => {
        const raceDateTime = new Date();
        raceDateTime.setHours(...race.time.split(':').map(Number), 0, 0);
        if (raceDateTime > now) {
          const raceId = getRaceId(race);
          newActiveAlarms.add(raceId);
          scheduleRaceAlarm(race);
        }
      });
      setActiveAlarms(newActiveAlarms);
    }
  }, [activeAlarms.size, allRaces, scheduleRaceAlarm]);

  return { activeAlarms, warningAlarms, handleToggleAlarms, handleToggleRaceAlarm };
}
