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

export const playFirstCallMelody = () => {
  // Using expo-av to play a local WAV file
  // Assuming the file is located at assets/sounds/firstcall.wav
  // If the path is different, please adjust require() accordingly.
  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/firstcall.mp3')
      );
      await sound.playAsync();
      // Optionally, you can unload the sound after it finishes playing to free up resources.
      // For short, single-shot sounds, this might not be strictly necessary immediately.
      // await sound.unloadAsync();
    } catch (error) {
      console.error('Error playing firstcall.mp3:', error);
    }
  };
  void playSound(); // Call the async function
};

export const playXXXXMelody = () => {
  // Using expo-av to play a local WAV file
  // Assuming the file is located at assets/sounds/firstcall.wav
  // If the path is different, please adjust require() accordingly.
  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/rocking.mp3')
      );
      await sound.playAsync();
      // Optionally, you can unload the sound after it finishes playing to free up resources.
      // For short, single-shot sounds, this might not be strictly necessary immediately.
      // await sound.unloadAsync();
    } catch (error) {
      console.error('Error playing rocking.mp3:', error);
    }
  };
  void playSound(); // Call the async function
};

export const playYYYYMelody = () => {
  // Using expo-av to play a local MP3 file
  // Assuming the file is located at assets/sounds/piano.mp3
  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/piano.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing piano.mp3:', error);
    }
  };
  void playSound(); // Call the async function
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