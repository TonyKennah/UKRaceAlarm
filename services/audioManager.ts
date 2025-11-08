import { Audio } from 'expo-av';
import { getVolume, Melody, saveVolume } from './settingsService';

const sounds: { [key in Melody]?: Audio.Sound } = {};

export const preloadSounds = async () => {
  console.log('Preloading sounds...');
  try {
    const initialVolume = await getVolume();
    const initialStatus = { volume: initialVolume };

    const callSound = new Audio.Sound();
    await callSound.loadAsync(require('../assets/sounds/firstcall.mp3'), initialStatus);
    sounds['Call'] = callSound;

    const bugleSound = new Audio.Sound();
    await bugleSound.loadAsync(require('../assets/sounds/rocking.mp3'), initialStatus);
    sounds['Bugle'] = bugleSound;

    const hawaiiSound = new Audio.Sound();
    await hawaiiSound.loadAsync(require('../assets/sounds/piano.mp3'), initialStatus);
    sounds['Hawaii'] = hawaiiSound;

    console.log('Sounds preloaded successfully.');
  } catch (error) {
    console.error('Failed to preload sounds:', error);
  }
};

export const playSound = async (melody: Melody) => {
  const soundObject = sounds[melody];
  if (soundObject) {
    try {
      // Rewind the sound to the beginning before playing
      await soundObject.replayAsync();
    } catch (error) {
      console.error(`Error playing sound for melody ${melody}:`, error);
    }
  } else {
    console.warn(`Sound for melody "${melody}" is not loaded.`);
  }
};

export const setVolume = async (volume: number) => {
  const clampedVolume = Math.max(0, Math.min(1, volume));
  try {
    // Set volume for all loaded sounds
    for (const melody in sounds) {
      const soundObject = sounds[melody as Melody];
      if (soundObject) {
        await soundObject.setVolumeAsync(clampedVolume);
      }
    }
    // Save the volume setting for future sessions
    await saveVolume(clampedVolume);
  } catch (error) {
    console.error('Failed to set volume:', error);
  }
};