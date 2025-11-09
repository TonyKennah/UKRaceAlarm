import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { playSound } from './audioManager';
import { AppEvents } from './eventService';
import { getSelectedMelody, Melody } from './settingsService';

// This configures how the app handles notifications.
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    // When a notification is received, play the sound through our audio manager
    // This ensures the user-selected melody and volume are used.
    const selectedMelody = await getSelectedMelody();
    void playSound(selectedMelody);

    // Return the desired behavior for the notification
    return {
      shouldShowAlert: true,
      shouldPlaySound: false, // We are now playing the sound manually
      shouldSetBadge: false,
    };
  },
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
  void playSound('Call');
};

export const playXXXXMelody = () => {
  void playSound('Bugle');
};

export const playYYYYMelody = () => {
  void playSound('Hawaii');
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
      const selectedMelody: Melody = await getSelectedMelody();
      void playSound(selectedMelody);
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
      sound: false, // We disable the default OS sound
    },
    trigger: {
      seconds: Math.max(1, secondsUntilAMinuteBeforeRace), // Ensure trigger is at least 1s in the future
    },
  });
}

export async function cancelRaceNotification(race: Race) {
  const raceId = getRaceId(race);
  console.log(`Cancelling alarm for race: ${raceId}`);

  if (Platform.OS === 'web') {
    const timeoutId = webTimeoutIds.get(raceId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      webTimeoutIds.delete(raceId);
    }
    return;
  }

  await Notifications.cancelScheduledNotificationAsync(raceId);
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