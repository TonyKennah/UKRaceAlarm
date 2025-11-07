import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { playMelody } from './audioService';
import { AppEvents } from './eventService';
import { getSelectedMelody } from './settingsService';

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

export const playFirstCallMelody = () => {
  const notes = { G4: 392.00, C5: 523.25, E5: 659.25, G5: 783.99 };
  playMelody({
    waveform: 'sine',
    gainValue: 1,
    notes: [
      { frequency: notes.C5, duration: 0.1, delay: 0.0 },
      { frequency: notes.E5, duration: 0.1, delay: 0.1 },
      { frequency: notes.G5, duration: 0.1, delay: 0.2 },
      { frequency: notes.C5, duration: 0.25, delay: 0.4 },
      { frequency: notes.G4, duration: 0.25, delay: 0.7 },
      { frequency: notes.C5, duration: 0.25, delay: 1.1 },
      { frequency: notes.E5, duration: 0.12, delay: 1.4 },
      { frequency: notes.G5, duration: 0.12, delay: 1.55 },
      { frequency: notes.C5, duration: 0.25, delay: 1.7 },
      { frequency: notes.E5, duration: 0.25, delay: 2.0 },
      { frequency: notes.C5, duration: 0.1, delay: 2.4 },
      { frequency: notes.E5, duration: 0.1, delay: 2.5 },
      { frequency: notes.G5, duration: 0.1, delay: 2.6 },
      { frequency: notes.C5, duration: 0.25, delay: 2.8 },
      { frequency: notes.G4, duration: 0.25, delay: 3.1 },
      { frequency: notes.E5, duration: 0.25, delay: 3.5 },
      { frequency: notes.C5, duration: 0.5, delay: 3.8 },
    ]
  });
};

export const playXXXXMelody = () => {
  const notes = { G4: 392.00, C5: 523.25, E5: 659.25, G5: 783.99 };
  playMelody({
    waveform: 'custom',
    customWaveformReal: new Float32Array([0, 1, 0.5, 0.3, 0.1]),
    customWaveformImag: new Float32Array([0, 0, 0, 0, 0]),
    attackTime: 0.02,
    releaseTime: 0.1,
    gainValue: 0.7,
    notes: [
      { frequency: notes.C5, duration: 0.1, delay: 0.0 },
      { frequency: notes.E5, duration: 0.1, delay: 0.1 },
      { frequency: notes.G5, duration: 0.1, delay: 0.2 },
      { frequency: notes.C5, duration: 0.25, delay: 0.35 },
      { frequency: notes.G4, duration: 0.25, delay: 0.65 },
      { frequency: notes.C5, duration: 0.35, delay: 1.0 },
      { frequency: notes.E5, duration: 0.1, delay: 1.35 },
      { frequency: notes.G5, duration: 0.25, delay: 1.5 },
      { frequency: notes.C5, duration: 0.25, delay: 1.8 },
      { frequency: notes.E5, duration: 0.25, delay: 2.1 },
      { frequency: notes.C5, duration: 0.1, delay: 2.5 },
      { frequency: notes.E5, duration: 0.1, delay: 2.6 },
      { frequency: notes.G5, duration: 0.1, delay: 2.7 },
      { frequency: notes.C5, duration: 0.25, delay: 2.9 },
      { frequency: notes.G4, duration: 0.25, delay: 3.2 },
      { frequency: notes.E5, duration: 0.25, delay: 3.6 },
      { frequency: notes.C5, duration: 0.5, delay: 3.9 },
    ]
  });
};

export const playYYYYMelody = () => {
  const notes = { G3: 196.00, C4: 261.63, D4: 293.66, Eb4: 311.13, F4: 349.23, G4: 392.00, A4: 440.00, Bb4: 466.16, C5: 523.25, D5: 587.33, Eb5: 622.25, F5: 698.46, G5: 783.99, rest: 0 };
  playMelody({
    waveform: 'sawtooth',
    attackTime: 0.01,
    releaseTime: 0.03,
    notes: [
      { frequency: notes.G4, duration: 0.125, delay: 0.0 },
      { frequency: notes.C5, duration: 0.125, delay: 0.125 },
      { frequency: notes.G4, duration: 0.25, delay: 0.25 },
      { frequency: notes.G4, duration: 0.125, delay: 0.5 },
      { frequency: notes.C5, duration: 0.125, delay: 0.625 },
      { frequency: notes.G4, duration: 0.25, delay: 0.75 },
      { frequency: notes.G4, duration: 0.125, delay: 1.0 },
      { frequency: notes.C5, duration: 0.125, delay: 1.125 },
      { frequency: notes.G4, duration: 0.125, delay: 1.25 },
      { frequency: notes.C5, duration: 0.125, delay: 1.375 },
      { frequency: notes.G4, duration: 0.25, delay: 1.5 },
      { frequency: notes.rest, duration: 0.25, delay: 1.75 },
      { frequency: notes.Eb5, duration: 0.25, delay: 2.0 },
      { frequency: notes.D5, duration: 0.25, delay: 2.25 },
      { frequency: notes.C5, duration: 0.25, delay: 2.5 },
      { frequency: notes.Bb4, duration: 0.25, delay: 2.75 },
      { frequency: notes.A4, duration: 0.5, delay: 3.0 },
      { frequency: notes.rest, duration: 0.5, delay: 3.5 },
      { frequency: notes.G4, duration: 0.125, delay: 4.0 },
      { frequency: notes.C5, duration: 0.125, delay: 4.125 },
      { frequency: notes.G4, duration: 0.25, delay: 4.25 },
      { frequency: notes.G4, duration: 0.125, delay: 4.5 },
      { frequency: notes.C5, duration: 0.125, delay: 4.625 },
      { frequency: notes.G4, duration: 0.25, delay: 4.75 },
      { frequency: notes.G4, duration: 0.125, delay: 5.0 },
      { frequency: notes.C5, duration: 0.125, delay: 5.125 },
      { frequency: notes.G4, duration: 0.125, delay: 5.25 },
      { frequency: notes.C5, duration: 0.125, delay: 5.375 },
      { frequency: notes.G4, duration: 0.25, delay: 5.5 },
    ]
  });
};

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
    const timeoutId = setTimeout(async () => {
      const selectedMelody = await getSelectedMelody();
      switch (selectedMelody) {
        case 'Call':
          playFirstCallMelody();
          break;
        case 'Bugle':
          playXXXXMelody();
          break;
        case 'Hawaii':
          playYYYYMelody();
          break;
        default:
          playFirstCallMelody();
      }
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