import { useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import races from '../../data/races.json';
import { AppEvents } from '../../services/eventService';
import { cancelAllRaceNotifications, scheduleRaceNotification, setupNotifications } from '../../services/notificationService';

interface Race {
  time: string;
  place: string;
  details: string;
  runners: number;
}

export default function Index() {
  const [activeAlarms, setActiveAlarms] = useState<Set<string>>(new Set());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [warningAlarms, setWarningAlarms] = useState<Set<string>>(new Set());
  const [displayedRaces, setDisplayedRaces] = useState<Race[]>([]);
  const notificationTimeoutIds = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    void setupNotifications();
    // Cleanup timeout on component unmount
    return () => {
      notificationTimeoutIds.current.forEach(clearTimeout);
      notificationTimeoutIds.current.clear();
      void cancelAllRaceNotifications();
    };
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    // Filter races to show only upcoming ones.
    // This will run every time currentTime is updated (i.e., every second).
    const upcomingRaces = (races as Race[]).filter((race) => {
      const raceDateTime = new Date();
      raceDateTime.setHours(...race.time.split(':').map(Number), 0, 0);
      return raceDateTime >= currentTime;
    });

    // Find which races were removed and tell the alert to close if it's open for one of them
    const displayedRaceIds = new Set(upcomingRaces.map(getRaceId));
    displayedRaces.forEach(race => {
      const raceId = getRaceId(race);
      if (!displayedRaceIds.has(raceId)) {
        AppEvents.emit('closeAlert', { raceId });
      }
    });
    setDisplayedRaces(upcomingRaces);
  }, [currentTime]);

  const getRaceId = (race: Race) => `${race.time}-${race.place}`;

  const scheduleRaceAlarm = (race: Race) => {
    const raceId = getRaceId(race);
    const now = new Date();
    const [hours, minutes] = race.time.split(':').map(Number);
    const raceDateTime = new Date();
    raceDateTime.setHours(hours, minutes, 0, 0);

    const twoMinutesBeforeRace = new Date(raceDateTime.getTime() - 2 * 60 * 1000);

    if (twoMinutesBeforeRace > now) {
      const delay = twoMinutesBeforeRace.getTime() - now.getTime();

      const timeoutId = setTimeout(() => {
        // Now that it's 2 minutes before, schedule the notification (which will fire instantly)
        // and update the UI to show "Warning".
        void scheduleRaceNotification(race, raceDateTime);
        setWarningAlarms(prev => new Set(prev).add(raceId));
      }, delay);

      notificationTimeoutIds.current.set(raceId, timeoutId);
    }
  };

  const cancelRaceAlarm = (race: Race) => {
    const raceId = getRaceId(race);
    const timeoutId = notificationTimeoutIds.current.get(raceId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      notificationTimeoutIds.current.delete(raceId);
    }
    // This is a simplification. To cancel a specific native notification,
    // scheduleRaceNotification would need to return its ID, which we would store.
    // For now, we cancel all and re-schedule the ones that should remain.
    void cancelAllRaceNotifications();
  };

  const handleToggleRaceAlarm = (race: Race) => {
    const raceId = getRaceId(race);
    const newActiveAlarms = new Set(activeAlarms);
    const isCurrentlyActive = newActiveAlarms.has(raceId);

    if (isCurrentlyActive) {
      newActiveAlarms.delete(raceId);
      cancelRaceAlarm(race);
    } else {
      newActiveAlarms.add(raceId);
      scheduleRaceAlarm(race);
    }
    setActiveAlarms(newActiveAlarms);

    // Resync all native notifications
    if (!isCurrentlyActive) {
      // If we just added one, no need to cancel all.
    } else {
      // If we removed one, we need to re-schedule the others.
      newActiveAlarms.forEach(id => {
        const [time, place] = id.split('-');
        const raceToReschedule = (races as Race[]).find(r => r.time === time && r.place === place);
        if (raceToReschedule) {
          scheduleRaceAlarm(raceToReschedule);
        }
      });
    }
  };

  const handleToggleAlarms = () => {
    if (activeAlarms.size > 0) {
      // Stop all alarms
      void cancelAllRaceNotifications();
      notificationTimeoutIds.current.forEach(clearTimeout);
      notificationTimeoutIds.current.clear();
      setActiveAlarms(new Set());
    } else {
      // Start all alarms for upcoming races
      const newActiveAlarms = new Set<string>();
      const now = new Date();
      (races as Race[]).forEach(race => {
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
  };

  const getRaceStatus = (race: Race) => {
    const now = new Date();
    const raceId = getRaceId(race);
    const raceDateTime = new Date();
    raceDateTime.setHours(...race.time.split(':').map(Number), 0, 0);

    if (raceDateTime < now) {
      return { text: 'Race OFF', color: '#888' };
    }

    if (warningAlarms.has(raceId)) {
      return { text: 'Warning', color: '#FFA500' }; // Orange
    }

    if (activeAlarms.has(raceId)) {
      return { text: 'Alarm Set', color: '#34A853' };
    }

    return { text: 'Not Set', color: '#e02020ff' };
  };

  const getCountdown = (raceTime: string) => {
    const raceDateTime = new Date();
    raceDateTime.setHours(...raceTime.split(':').map(Number), 0, 0);

    const diff = raceDateTime.getTime() - currentTime.getTime();

    if (diff <= 0) {
      return null;
    }

    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const renderRaceItem = ({ item }: { item: Race }) => {
    const status = getRaceStatus(item);
    const countdown = getCountdown(item.time);
    const isFinished = new Date().setHours(...item.time.split(':').map(Number), 0, 0) < new Date().getTime();
    const isAlarmActive = activeAlarms.has(getRaceId(item));
    return (
      <View style={styles.raceItemContainer}>
        <View style={styles.raceInfo}>
          <Text numberOfLines={1} ellipsizeMode="tail">
            <Text style={styles.raceTime}>{item.time} </Text>
            <Text style={styles.racePlace}>{item.place} </Text>
            <Text style={styles.raceDetails}>
              {item.details} ({item.runners} runners)
            </Text>
          </Text>
        </View>
        {countdown && isAlarmActive && <Text style={styles.countdownText}>{countdown}</Text>}
        <Pressable
          onPress={() => !isFinished && handleToggleRaceAlarm(item)}
          disabled={isFinished}
        >
          <View style={[styles.statusContainer, { backgroundColor: status.color }]}>
            <Text style={styles.statusText}>{status.text}</Text>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable onPress={handleToggleAlarms}>
          <View style={[styles.bigButton, { backgroundColor: activeAlarms.size > 0 ? '#e02020ff' : '#34A853' }]}>
            <Text style={styles.bigButtonText}>
              {activeAlarms.size > 0 ? 'Stop All Alarms' : 'Start All Alarms'}
            </Text>
          </View>
        </Pressable>
      </View>
      <FlatList
        data={displayedRaces}
        renderItem={renderRaceItem}
        keyExtractor={(item) => `${item.time}-${item.place}`}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d8babaff', // A softer, light grey background
  },
  buttonContainer: {
    marginHorizontal: 8,
    marginVertical: 10,
  },
  bigButton: {
    paddingVertical: 50,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  bigButtonText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  list: {
    width: '100%',
  },
  raceItemContainer: {
    backgroundColor: '#d8babaff', // A gentle off-white for the cards
    padding: 15,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  raceInfo: {
    flex: 1,
    marginRight: 8,
  },
  raceTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  racePlace: {
    fontSize: 16,
    color: '#000',
  },
  raceDetails: {
    fontSize: 14,
    color: '#000',
  },
  countdownText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 8,
    fontStyle: 'normal',
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
