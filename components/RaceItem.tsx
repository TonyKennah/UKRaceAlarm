import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Race {
  time: string;
  place: string;
  details: string;
  runners: number;
}

interface RaceStatus {
  text: string;
  color: string;
}

interface RaceItemProps {
  item: Race;
  status: RaceStatus;
  countdown: string | null;
  isFinished: boolean;
  isAlarmActive: boolean;
  onToggleAlarm: (race: Race) => void;
}

export default function RaceItem({ item, status, countdown, isFinished, isAlarmActive, onToggleAlarm }: RaceItemProps) {
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
        onPress={() => onToggleAlarm(item)}
        disabled={isFinished}
      >
        <View style={[styles.statusContainer, { backgroundColor: status.color }]}>
          <Text style={styles.statusText}>{status.text}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
