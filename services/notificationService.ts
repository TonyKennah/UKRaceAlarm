import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { AppEvents } from './eventService';

// This configures the app to show a notification alert when it's in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function setupNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Failed to get permission for notifications!');
    return;
  }
}

interface Race {
  time: string;
  place: string;
  details: string;
  runners: number;
}

const getRaceId = (race: Race) => `${race.time}-${race.place}`;

// Store timeout IDs for web so we can cancel them.
let webTimeoutIds: NodeJS.Timeout[] = [];

export async function scheduleRaceNotification(race: Race, raceTime: Date) {
  const now = new Date();
  const secondsUntilRace = (raceTime.getTime() - now.getTime()) / 1000;
  const secondsUntilAMinuteBeforeRace = secondsUntilRace - 120;


  if (secondsUntilRace <= 0) {
    console.log(`Race ${race.time} at ${race.place} is less than 2 minutes away, not scheduling alarm.`);
    return;
  }

  // For web, use a recurring browser alert as a fallback for notifications.
  if (Platform.OS === 'web') {
    const playAlertSound = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (!audioContext) return;

        const playTone = (frequency: number, startTime: number, duration: number) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(frequency, startTime);
          gainNode.gain.setValueAtTime(1, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);

          oscillator.start(startTime);
          oscillator.stop(startTime + duration);
        };

        const notes = { // Frequencies for the notes in the "First Call"
          G4: 392.00,
          C5: 523.25,
          E5: 659.25,
          G5: 783.99,
        };

        // A transcription of the "First Call" bugle melody, based on the classic 4-bar structure.
        // Tempo is set to be "Quick Time".
        const melody = [
          // Bar 1: C-E-G (triplet), C, G
          { note: notes.C5, duration: 0.1, delay: 0.0 },  // Triplet 1
          { note: notes.E5, duration: 0.1, delay: 0.1 },  // Triplet 2
          { note: notes.G5, duration: 0.1, delay: 0.2 },  // Triplet 3
          { note: notes.C5, duration: 0.25, delay: 0.4 }, // Quarter note
          { note: notes.G4, duration: 0.25, delay: 0.7 }, // Quarter note

          // Bar 2: C, E, G, C, E
          { note: notes.C5, duration: 0.25, delay: 1.1 }, // Quarter note
          { note: notes.E5, duration: 0.12, delay: 1.4 }, // Eighth note
          { note: notes.G5, duration: 0.12, delay: 1.55 },// Eighth note
          { note: notes.C5, duration: 0.25, delay: 1.7 }, // Quarter note
          { note: notes.E5, duration: 0.25, delay: 2.0 }, // Quarter note

          // Bar 3: C-E-G (triplet), C, G
          { note: notes.C5, duration: 0.1, delay: 2.4 },  // Triplet 1
          { note: notes.E5, duration: 0.1, delay: 2.5 },  // Triplet 2
          { note: notes.G5, duration: 0.1, delay: 2.6 },  // Triplet 3
          { note: notes.C5, duration: 0.25, delay: 2.8 }, // Quarter note
          { note: notes.G4, duration: 0.25, delay: 3.1 }, // Quarter note

          // Bar 4: E, C
          { note: notes.E5, duration: 0.25, delay: 3.5 }, // Quarter note
          { note: notes.C5, duration: 0.5, delay: 3.8 },  // Half note
        ];

        const startTime = audioContext.currentTime;
        
        melody.forEach(note => {
          playTone(note.note, startTime + note.delay, note.duration);
        });
      } catch (e) {
        console.error("Could not play sound:", e);
      }
    };

    const timeoutId = setTimeout(() => {
      playAlertSound();
      AppEvents.emit('showAlert', {
        title: 'TWO MINUTE WARNING',
        message: `Race Time: ${race.time} at ${race.place}\n${race.details}`,
        raceId: getRaceId(race),
      });
    }, secondsUntilAMinuteBeforeRace * 1000);
    webTimeoutIds.push(timeoutId);
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Race Time: ${race.time} at ${race.place}`,
      body: `${race.details}\n${race.runners} runners.`,
      sound: 'default', // Plays the default notification sound
    },
    trigger: {
      seconds: Math.max(1, secondsUntilAMinuteBeforeRace), // Ensure trigger is at least 1s in the future
    },
  });
}

export async function cancelAllRaceNotifications() {
  // For web, clear all scheduled timeouts.
  if (Platform.OS === 'web') {
    webTimeoutIds.forEach(clearTimeout);
    webTimeoutIds = [];
    return;
  }

  // For native, cancel all scheduled notifications.
  await Notifications.cancelAllScheduledNotificationsAsync();
}