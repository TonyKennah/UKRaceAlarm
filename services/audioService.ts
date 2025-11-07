import { Platform } from 'react-native';

export interface Note {
  frequency: number;
  duration: number;
  delay: number;
}

export interface Melody {
  notes: Note[];
  waveform: OscillatorType;
  attackTime?: number;
  releaseTime?: number;
  gainValue?: number;
}

export interface CustomMelody extends Melody {
  waveform: 'custom';
  customWaveformReal: Float32Array;
  customWaveformImag: Float32Array;
}

const playNote = (
  audioContext: AudioContext,
  note: Note,
  params: Melody | CustomMelody,
  customWave?: PeriodicWave
) => {
  const { frequency, duration, delay } = note;
  const startTime = audioContext.currentTime + delay;
  const stopTime = startTime + duration;

  if (frequency <= 0) return; // Handle rests
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  if (params.waveform === 'custom' && customWave) {
    oscillator.setPeriodicWave(customWave);
  } else {
    oscillator.type = params.waveform;
  }

  oscillator.frequency.setValueAtTime(frequency, startTime);

  // Envelope
  const attackTime = params.attackTime ?? 0.01;
  const releaseTime = params.releaseTime ?? 0.01;
  const gainValue = params.gainValue ?? 0.5;
  gainNode.gain.setValueAtTime(0.0, startTime);
  gainNode.gain.linearRampToValueAtTime(gainValue, startTime + attackTime);
  gainNode.gain.setValueAtTime(gainValue, stopTime - releaseTime);
  gainNode.gain.linearRampToValueAtTime(0.001, stopTime);

  oscillator.start(startTime);
  oscillator.stop(stopTime);
};

export const playMelody = (melody: Melody | CustomMelody) => {
  if (Platform.OS !== 'web') {
    alert('Custom melody playback is only available on the web platform.');
    return;
  }
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (!audioContext) return;

    let customWave: PeriodicWave | undefined;
    if (melody.waveform === 'custom' && 'customWaveformReal' in melody) {
      // Create the custom wave only ONCE per melody playback.
      customWave = audioContext.createPeriodicWave(melody.customWaveformReal, melody.customWaveformImag);
    }

    melody.notes.forEach(note => playNote(audioContext, note, melody, customWave));
  } catch (e) {
    console.error("Could not play sound:", e);
  }
};
