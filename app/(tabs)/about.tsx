import Slider from '@react-native-community/slider';
import { useEffect, useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { playSound, setVolume as setAudioVolume } from '../../services/audioManager';
import { getSelectedMelody, getVolume, Melody, saveSelectedMelody } from '../../services/settingsService';

export default function AboutScreen() {
  const appName = "UK Race Alarm";
  // A simple check for mobile web. On mobile browsers, volume is controlled by the device hardware buttons.
  const isMobileWeb = Platform.OS === 'web' && (typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

  const appVersion = "1.0.0";
  const currentDate = "05/11/2025";
  const [selectedMelody, setSelectedMelody] = useState<Melody>('Call');
  const [volume, setLocalVolume] = useState(1);
  const melodies: Melody[] = ['Call', 'Bugle', 'Hawaii'];

  useEffect(() => {
    const loadMelody = async () => {
      const savedMelody = await getSelectedMelody();
      setSelectedMelody(savedMelody);
    };
    const loadVolume = async () => {
      const savedVolume = await getVolume();
      setLocalVolume(savedVolume);
    };
    void loadMelody();
    void loadVolume();
  }, []);

  const handleTestMelody = async () => {
    await playSound(selectedMelody);
  };

  const handleMelodySelection = (melody: Melody) => {
    setSelectedMelody(melody);
    void saveSelectedMelody(melody);
  };

  // This is called when the user releases the slider
  const handleSlidingComplete = async (value: number) => {
    // setAudioVolume saves the value and updates the sound objects
    await setAudioVolume(value);
    // Play a sound so the user can hear the new volume
    // await playSound(selectedMelody);
  };

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
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
      <View style={styles.creditLineContainer}>
        <Text style={styles.credit}>Brought to you by TK courtesy of</Text>
        <Text style={styles.pluckier} onPress={() => Linking.openURL('https://www.pluckier.co.uk')}>
          Pluckier
        </Text>
      </View>
      </View>
      <View style={styles.melodyContainer}>
        <Text style={styles.melodyTitle}>Alarm Melody</Text>
        <View style={styles.radioGroup}>
          {melodies.map((melody) => (
            <Pressable key={melody} style={styles.radioButton} onPress={() => handleMelodySelection(melody)}>
              <View style={[styles.radioOuter, selectedMelody === melody && styles.radioSelectedOuter]}>
                {selectedMelody === melody && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioLabel}>{melody}</Text>
            </Pressable>
          ))}
        </View>
        {isMobileWeb ? (
          <Text style={styles.volumeInfoText}>Use your device's volume buttons to adjust alarm sound.</Text>
        ) : (
          <View style={styles.volumeSliderContainer}>
            <Text style={styles.volumeLabel}>Volume</Text>
            <Text style={styles.volumePercentageText}>{`${Math.round(volume * 100)}%`}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={volume}
              onValueChange={setLocalVolume} // Updates UI and local state in real-time
              onSlidingComplete={handleSlidingComplete} // Finalizes volume and plays preview
              minimumTrackTintColor="#e02020ff"
              maximumTrackTintColor="#ffffff"
              thumbTintColor="#ffffff"
            />
          </View>
        )}
        <Pressable style={styles.testButton} onPress={handleTestMelody}>
          <Text style={styles.testButtonText}>Test Melody</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#7e3c78ff',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  mainContent: {
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
    marginVertical: 20,
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
    color: '#ffffffff',
    marginLeft: 5,
  },
  melodyContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
  },
  melodyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 15,
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
    marginTop: 15,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  volumeLabel: {
    fontSize: 16,
    color: '#fff',
    marginRight: 10,
  },
  volumeSliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  volumePercentageText: {
    fontSize: 16,
    color: '#fff',
    minWidth: 45, // Ensures space for "100%"
    textAlign: 'left',
    marginRight: 10,
  },
  volumeInfoText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  creditLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10, // Add some margin to separate from the separator
  },
});
