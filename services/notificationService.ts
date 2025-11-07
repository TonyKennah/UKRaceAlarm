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

export const playFirstCallMelody = () => {
  if (Platform.OS !== 'web') {
    // On native, we can't play this custom sound easily without a sound library.
    // For now, we can just provide feedback that it's a web-only feature.
    alert('Custom melody preview is only available on the web platform.');
    return;
  }
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

export const playXXXXMelody = () => {
  if (Platform.OS !== 'web') {
    // On native, we can't play this custom sound easily without a sound library.
    // For now, we can just provide feedback that it's a web-only feature.
    alert('Custom melody preview is only available on the web platform.');
    return;
  }
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (!audioContext) return;

    const notes = {
      G4: 392.00,
      C5: 523.25,
      E5: 659.25,
      G5: 783.99,
    };

    const melody = [
      { note: notes.C5, duration: 0.1, delay: 0.0 },
      { note: notes.E5, duration: 0.1, delay: 0.1 },
      { note: notes.G5, duration: 0.1, delay: 0.2 },
      { note: notes.C5, duration: 0.25, delay: 0.35 },
      { note: notes.G4, duration: 0.25, delay: 0.65 },
      { note: notes.C5, duration: 0.35, delay: 1.0 },
      { note: notes.E5, duration: 0.1, delay: 1.35 },
      { note: notes.G5, duration: 0.25, delay: 1.5 },
      { note: notes.C5, duration: 0.25, delay: 1.8 },
      { note: notes.E5, duration: 0.25, delay: 2.1 },
      { note: notes.C5, duration: 0.1, delay: 2.5 },
      { note: notes.E5, duration: 0.1, delay: 2.6 },
      { note: notes.G5, duration: 0.1, delay: 2.7 },
      { note: notes.C5, duration: 0.25, delay: 2.9 },
      { note: notes.G4, duration: 0.25, delay: 3.2 },
      { note: notes.E5, duration: 0.25, delay: 3.6 },
      { note: notes.C5, duration: 0.5, delay: 3.9 },
    ];

    const now = audioContext.currentTime;

    melody.forEach(item => {

      const customWaveform = audioContext.createPeriodicWave(
        new Float32Array([0, 1, 0.5, 0.3, 0.1]), // real array
        new Float32Array([0, 0, 0, 0, 0])      // imag array (all zeros for no phase shift)
      );


        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.setPeriodicWave(customWaveform);
        oscillator.frequency.setValueAtTime(item.note, now + item.delay);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const startTime = now + item.delay;
        const stopTime = now + item.delay + item.duration + 0.05; 
        const attackTime = 0.02;
        const releaseTime = 0.1;

        gainNode.gain.setValueAtTime(0.0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.7, startTime + attackTime);
        gainNode.gain.setValueAtTime(0.7, stopTime - releaseTime);
        gainNode.gain.linearRampToValueAtTime(0.001, stopTime);

        oscillator.start(startTime);
        oscillator.stop(stopTime);
      });
  } catch (e) {
    console.error("Could not play sound:", e);
  }
};

export const playYYYYMelody = () => {
  if (Platform.OS !== 'web') {
    // On native, we can't play this custom sound easily without a sound library.
    // For now, we can just provide feedback that it's a web-only feature.
    alert('Custom melody preview is only available on the web platform.');
    return;
  }
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (!audioContext) return;

    // Define the frequencies for notes in C Minor
    const noteFrequencies = {
        G3: 196.00,
        C4: 261.63, D4: 293.66, Eb4: 311.13, F4: 349.23, G4: 392.00,
        A4: 440.00, Bb4: 466.16, C5: 523.25, D5: 587.33, Eb5: 622.25, F5: 698.46, G5: 783.99,
        rest: 0,
    };

    // The main riff of the Hawaii Five-O theme
    const melody = [
        // Da da DAH da da DAH da da DAH DAH DAH!
        // Very fast tempo
        { note: noteFrequencies.G4, duration: 0.125, delay: 0.0 },
        { note: noteFrequencies.C5, duration: 0.125, delay: 0.125 },
        { note: noteFrequencies.G4, duration: 0.25, delay: 0.25 }, // DAH
        { note: noteFrequencies.G4, duration: 0.125, delay: 0.5 },
        { note: noteFrequencies.C5, duration: 0.125, delay: 0.625 },
        { note: noteFrequencies.G4, duration: 0.25, delay: 0.75 }, // DAH
        { note: noteFrequencies.G4, duration: 0.125, delay: 1.0 },
        { note: noteFrequencies.C5, duration: 0.125, delay: 1.125 },
        { note: noteFrequencies.G4, duration: 0.125, delay: 1.25 }, // DAH
        { note: noteFrequencies.C5, duration: 0.125, delay: 1.375 }, // DAH
        { note: noteFrequencies.G4, duration: 0.25, delay: 1.5 }, // DAH!

        { note: noteFrequencies.rest, duration: 0.25, delay: 1.75 },

        // Follow up descending riff (simplified)
        { note: noteFrequencies.Eb5, duration: 0.25, delay: 2.0 },
        { note: noteFrequencies.D5, duration: 0.25, delay: 2.25 },
        { note: noteFrequencies.C5, duration: 0.25, delay: 2.5 },
        { note: noteFrequencies.Bb4, duration: 0.25, delay: 2.75 },
        { note: noteFrequencies.A4, duration: 0.5, delay: 3.0 },
        { note: noteFrequencies.rest, duration: 0.5, delay: 3.5 },

        // Return to main riff feel
        { note: noteFrequencies.G4, duration: 0.125, delay: 4.0 },
        { note: noteFrequencies.C5, duration: 0.125, delay: 4.125 },
        { note: noteFrequencies.G4, duration: 0.25, delay: 4.25 }, 
        { note: noteFrequencies.G4, duration: 0.125, delay: 4.5 },
        { note: noteFrequencies.C5, duration: 0.125, delay: 4.625 },
        { note: noteFrequencies.G4, duration: 0.25, delay: 4.75 },
        { note: noteFrequencies.G4, duration: 0.125, delay: 5.0 },
        { note: noteFrequencies.C5, duration: 0.125, delay: 5.125 },
        { note: noteFrequencies.G4, duration: 0.125, delay: 5.25 }, 
        { note: noteFrequencies.C5, duration: 0.125, delay: 5.375 }, 
        { note: noteFrequencies.G4, duration: 0.25, delay: 5.5 }, 
    ];

    // Use a Sawtooth wave for a punchier, rock/guitar sound
    const waveformType = 'sawtooth'; 
    const now = audioContext.currentTime;

    melody.forEach(item => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = waveformType;
        if (item.note > 0) {
            oscillator.frequency.setValueAtTime(item.note, now + item.delay);
        } else {
            gainNode.gain.setValueAtTime(0.0, now + item.delay);
        }

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const startTime = now + item.delay;
        const stopTime = now + item.delay + item.duration;
        // Fast attack and quick release for staccato feel
        const attackTime = 0.01;
        const releaseTime = 0.03; 

        if (item.note > 0) {
            gainNode.gain.setValueAtTime(0.0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.5, startTime + attackTime);
            gainNode.gain.setValueAtTime(0.5, stopTime - releaseTime);
            gainNode.gain.linearRampToValueAtTime(0.001, stopTime);
        }

        oscillator.start(startTime);
        oscillator.stop(stopTime);
      });
  } catch (e) {
    console.error("Could not play sound:", e);
  }
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
    const timeoutId = setTimeout(() => {
      playFirstCallMelody();
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