import AsyncStorage from '@react-native-async-storage/async-storage';

export type Melody = 'Call' | 'Bugle' | 'Hawaii';

const MELODY_KEY = 'user_selected_melody';
const VOLUME_KEY = 'user_selected_volume';

export const saveSelectedMelody = async (melody: Melody) => {
  try {
    await AsyncStorage.setItem(MELODY_KEY, melody);
  } catch (e) {
    console.error('Failed to save melody setting.', e);
  }
};

export const getSelectedMelody = async (): Promise<Melody> => {
  try {
    const melody = await AsyncStorage.getItem(MELODY_KEY);
    return (melody as Melody) || 'Call'; // Default to 'Call'
  } catch (e) {
    console.error('Failed to get melody setting.', e);
    return 'Call'; // Default on error
  }
};

export const saveVolume = async (volume: number) => {
  try {
    // Ensure volume is between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, volume));
    await AsyncStorage.setItem(VOLUME_KEY, JSON.stringify(clampedVolume));
  } catch (e) {
    console.error('Failed to save volume setting.', e);
  }
};

export const getVolume = async (): Promise<number> => {
  try {
    const volumeStr = await AsyncStorage.getItem(VOLUME_KEY);
    // Default to 1 (max volume) if not set
    return volumeStr !== null ? JSON.parse(volumeStr) : 1;
  } catch (e) {
    console.error('Failed to get volume setting.', e);
    return 1; // Default on error
  }
};