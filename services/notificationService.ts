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

        // A more complete "First Call" melody
        const melody = [
          // Bar 1
          { note: notes.G4, duration: 0.15, delay: 0.0 },
          { note: notes.C5, duration: 0.15, delay: 0.2 },
          { note: notes.E5, duration: 0.15, delay: 0.4 },
          { note: notes.G5, duration: 0.4, delay: 0.6 },
          // Bar 2
          { note: notes.G4, duration: 0.15, delay: 1.2 },
          { note: notes.C5, duration: 0.15, delay: 1.4 },
          { note: notes.E5, duration: 0.15, delay: 1.6 },
          { note: notes.G5, duration: 0.4, delay: 1.8 },
          // Bar 3
          { note: notes.C5, duration: 0.15, delay: 2.4 },
          { note: notes.C5, duration: 0.15, delay: 2.6 },
          { note: notes.C5, duration: 0.3, delay: 2.8 },
          // Bar 4
          { note: notes.G4, duration: 0.15, delay: 3.2 },
          { note: notes.C5, duration: 0.15, delay: 3.4 },
          { note: notes.E5, duration: 0.15, delay: 3.6 },
          { note: notes.G5, duration: 0.5, delay: 3.8 },
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