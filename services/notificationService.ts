import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

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


  if (secondsUntilAMinuteBeforeRace <= 0) {
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

        const notes = {
          C4: 261.63, E4: 329.63, G4: 392.00, A4: 440.00,
          C5: 523.25, D5: 587.33, E5: 659.25,
        };

        const melody = [
          { note: notes.C4, duration: 0.1, delay: 0 },
          { note: notes.E4, duration: 0.1, delay: 0.15 },
          { note: notes.G4, duration: 0.1, delay: 0.3 },
          { note: notes.C5, duration: 0.2, delay: 0.45 },

          { note: notes.A4, duration: 0.1, delay: 0.8 },
          { note: notes.C5, duration: 0.1, delay: 0.95 },
          { note: notes.D5, duration: 0.1, delay: 1.1 },
          { note: notes.E5, duration: 0.3, delay: 1.25 },
        ];

        const startTime = audioContext.currentTime;
        
        // Play the melody twice
        melody.forEach(note => {
          playTone(note.note, startTime + note.delay, note.duration);
        });

        const secondPartStart = startTime + 2.0; // Start the second part after a pause
        melody.forEach(note => {
          playTone(note.note, secondPartStart + note.delay, note.duration);
        });

      } catch (e) {
        console.error("Could not play sound:", e);
      }
    };

    const timeoutId = setTimeout(() => {
      playAlertSound();
      alert(`TWO MINUTE WARNING\n\nRace Time: ${race.time} at ${race.place}\n${race.details}`);
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
      seconds: secondsUntilAMinuteBeforeRace,
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