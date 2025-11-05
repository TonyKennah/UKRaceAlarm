import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import races from '../../data/races.json';
import { cancelAllRaceNotifications, scheduleRaceNotification, setupNotifications } from '../../services/notificationService';

interface Race {
  time: string;
  place: string;
  details: string;
  runners: number;
}

export default function Index() {
  const [alarmsActive, setAlarmsActive] = useState(false);
  const nextAlarmTimeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    void setupNotifications();
    // Cleanup timeout on component unmount
    return () => {
      if (nextAlarmTimeoutId.current) {
        clearTimeout(nextAlarmTimeoutId.current);
      }
    };
  }, []);

  const scheduleNextRace = (fromIndex: number = 0) => {
    const now1 = new Date();
    const now = new Date(now1.getTime() + 120000);

    for (let i = fromIndex; i < races.length; i++) {
      const race = races[i];
      const [hours, minutes] = race.time.split(':').map(Number);
      const raceDateTime = new Date();
      raceDateTime.setHours(hours, minutes, 0, 0);
      const beforeRaceDateTime = new Date(raceDateTime.getTime() - 60000); // 1 minute before race time
      
      if (raceDateTime > now) {
        void scheduleRaceNotification(race, raceDateTime);
        alert(`Next race alarm set for ${race.time} at ${race.place}.`);
        
        const timeUntilNextCheck = raceDateTime.getTime() - now.getTime() + 1000; // 1 second after race off
        nextAlarmTimeoutId.current = setTimeout(() => scheduleNextRace(i + 1), timeUntilNextCheck);
        return;
      }
    }

    alert('All races for today are finished.');
    setAlarmsActive(false);
  };

  const handleToggleAlarms = () => {
    if (alarmsActive) {
      void cancelAllRaceNotifications();
      if (nextAlarmTimeoutId.current) {
        clearTimeout(nextAlarmTimeoutId.current);
      }
      alert('All race notifications for today have been cancelled.');
      setAlarmsActive(false);
    } else {
      setAlarmsActive(true);
      scheduleNextRace(0);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
      <View style={styles.separator} />
      <Button
        title={alarmsActive ? 'Stop Race Alarms' : 'Start Race Alarms'}
        onPress={handleToggleAlarms}
        color={alarmsActive ? '#e02020ff' : '#34A853'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2f8043ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  link: {
    marginTop: 8,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '10%',
    backgroundColor: '#eee',
  },
});
