import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import RaceItem from '../../components/RaceItem';
import { useAlarms } from '../../hooks/useAlarms';
import { useRaceData } from '../../hooks/useRaceData';

interface Race {
  time: string;
  place: string;
  details: string;
  runners: number;
  id?: string;
}

export default function Index() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { raceData, displayedRaces } = useRaceData(currentTime);
  const { activeAlarms, warningAlarms, handleToggleAlarms, handleToggleRaceAlarm } = useAlarms(raceData);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const getRaceId = (race: Race) => `${race.time}-${race.place}`;

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
      <RaceItem
        item={item}
        status={status}
        countdown={countdown}
        isFinished={isFinished}
        isAlarmActive={isAlarmActive}
        onToggleAlarm={handleToggleRaceAlarm}
      />
    );
  };

  return (
    !raceData ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7e3c78ff" />
        <Text>Loading races...</Text>
      </View>
    ) :
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
      {displayedRaces.length > 0 ? (
        <FlatList
          data={displayedRaces}
          renderItem={renderRaceItem}
          keyExtractor={(item) => `${item.time}-${item.place}`}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
          }}
          style={styles.list}
        />
      ) : (
        <View style={styles.noRacesContainer}>
          <Text style={styles.noRacesText}>
            There are no races left today to set alarms for, please come back tomorrow.
          </Text>
        </View>
      )}
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
  noRacesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noRacesText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
