import { Audio } from 'expo-av'; // Import Audio from expo-av
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
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

const playSoundFile = async (soundFile: any, fileName: string) => {
  try {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();

    // Add a listener to unload the sound from memory once it has finished playing.
    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.isLoaded && status.didJustFinish) {
        await sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error(`Error playing ${fileName}:`, error);
  }
};

export const playFirstCallMelody = () => {
  void playSoundFile(require('../assets/sounds/firstcall.mp3'), 'firstcall.mp3');
};

export const playXXXXMelody = () => {
  void playSoundFile(require('../assets/sounds/rocking.mp3'), 'rocking.mp3');
};

export const playYYYYMelody = () => {
  void playSoundFile(require('../assets/sounds/piano.mp3'), 'piano.mp3');
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