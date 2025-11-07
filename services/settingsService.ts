import AsyncStorage from '@react-native-async-storage/async-storage';

export type Melody = 'Call' | 'Bugle' | 'Hawaii';

const MELODY_KEY = 'user_selected_melody';

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