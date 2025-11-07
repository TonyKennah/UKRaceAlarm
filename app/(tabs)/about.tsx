import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { playFirstCallMelody, playXXXXMelody, playYYYYMelody } from '../../services/notificationService';

export default function AboutScreen() {
  const appName = "UK Race Alarm";
  const appVersion = "1";
  const currentDate = "05/11/2025";
  const [selectedMelody, setSelectedMelody] = useState('First Call');
  const melodies = ['First Call', 'XXXX', 'YYYY'];

  const handleTestMelody = () => {
    switch (selectedMelody) {
      case 'First Call':
        playFirstCallMelody();
        break;
      case 'XXXX':
        playXXXXMelody();
        break;
      case 'YYYY':
        playYYYYMelody();
        break;
      default:
        playFirstCallMelody();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>

      <Text style={styles.title}>{appName}</Text>
      <Text style={styles.version}>Version {appVersion}</Text>
      <Text style={styles.date}>Created On {currentDate}</Text>
      <View style={styles.separator} />
      <Text style={styles.description}>
        This application provides alarms for UK & Irish horse races.
        Set alarms for all races or toggle them individually to receive a two-minute warning before the race is off.
      </Text>
      <View style={styles.separator} />
      <Text style={styles.credit}>Brought to you by</Text>
      <Text style={styles.pluckier} onPress={() => Linking.openURL('https://www.pluckier.co.uk')}>
        Pluckier
      </Text>
      </View>
      <View style={styles.melodyContainer}>
        <Text style={styles.melodyTitle}>Alarm Melody</Text>
        <View style={styles.radioGroup}>
          {melodies.map((melody) => (
            <Pressable key={melody} style={styles.radioButton} onPress={() => setSelectedMelody(melody)}>
              <View style={[styles.radioOuter, selectedMelody === melody && styles.radioSelectedOuter]}>
                {selectedMelody === melody && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioLabel}>{melody}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable style={styles.testButton} onPress={handleTestMelody}>
          <Text style={styles.testButtonText}>Test Melody</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7e3c78ff',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  version: {
    fontSize: 18,
    color: '#ffffffff',
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: '#ffffffff',
  },
  separator: {
    height: 1,
    width: '80%',
    backgroundColor: '#444',
    marginVertical: 30,
  },
  description: {
    fontSize: 20,
    color: '#ffffffff',
    textAlign: 'center',
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  credit: {
    fontSize: 16,
    color: '#ffffffff',
    fontStyle: 'italic',
  },
  pluckier: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e02020ff',
    marginTop: 5,
  },
  melodyContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
  },
  melodyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioSelectedOuter: {
    borderColor: '#e02020ff',
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#e02020ff',
  },
  radioLabel: {
    fontSize: 16,
    color: '#fff',
  },
  testButton: {
    backgroundColor: '#34A853',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
