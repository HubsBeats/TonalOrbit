// Pure JavaScript audio synthesis — no native modules required
// Generates PCM sine wave tones with harmonics, encodes as WAV base64

const SAMPLE_RATE = 22050;

export const NOTE_FREQUENCIES: Record<string, number> = {
  C: 261.63,
  "C#": 277.18, Db: 277.18,
  D: 293.66,
  "D#": 311.13, Eb: 311.13,
  E: 329.63,
  F: 349.23,
  "F#": 369.99, Gb: 369.99,
  G: 392.0,
  "G#": 415.3, Ab: 415.3,
  A: 440.0,
  "A#": 466.16, Bb: 466.16,
  B: 493.88,
};

export function getNoteFrequency(note: string, octave: number = 4): number {
  const base = NOTE_FREQUENCIES[note];
  if (!base) return 440;
  return base * Math.pow(2, octave - 4);
}

function generateSamples(
  frequencies: number[],
  duration: number,
  sampleRate: number
): Float32Array {
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);

  const attackSamples = Math.floor(0.008 * sampleRate);
  const decaySamples = Math.floor(0.12 * sampleRate);
  const releaseSamples = Math.floor(0.25 * sampleRate);
  const sustainLevel = 0.55;

  for (let i = 0; i < numSamples; i++) {
    let envelope: number;
    if (i < attackSamples) {
      envelope = i / attackSamples;
    } else if (i < attackSamples + decaySamples) {
      const t = (i - attackSamples) / decaySamples;
      envelope = 1 - (1 - sustainLevel) * t;
    } else if (i > numSamples - releaseSamples) {
      const t = (i - (numSamples - releaseSamples)) / releaseSamples;
      envelope = sustainLevel * (1 - t);
    } else {
      envelope = sustainLevel;
    }

    let sample = 0;
    for (const freq of frequencies) {
      const t = i / sampleRate;
      // Piano-like harmonics: fundamental + partials with decreasing amplitude
      sample += Math.sin(2 * Math.PI * freq * t) * 0.55;
      sample += Math.sin(2 * Math.PI * freq * 2 * t) * 0.22;
      sample += Math.sin(2 * Math.PI * freq * 3 * t) * 0.10;
      sample += Math.sin(2 * Math.PI * freq * 4 * t) * 0.07;
      sample += Math.sin(2 * Math.PI * freq * 5 * t) * 0.04;
      sample += Math.sin(2 * Math.PI * freq * 0.5 * t) * 0.02;
    }

    // Normalize by frequency count to avoid clipping
    sample = sample / (frequencies.length * 1.0);
    samples[i] = sample * envelope;
  }

  return samples;
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

function samplesToWav(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = samples.length * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  const maxVal = 28000; // slightly below 32767 to prevent clipping
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, s * maxVal, true);
  }

  return buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    for (let j = 0; j < chunk.length; j++) {
      binary += String.fromCharCode(chunk[j]);
    }
  }
  return btoa(binary);
}

export function generateNoteWav(note: string, octave: number = 4, duration: number = 1.0): string {
  const freq = getNoteFrequency(note, octave);
  const samples = generateSamples([freq], duration, SAMPLE_RATE);
  const wav = samplesToWav(samples, SAMPLE_RATE);
  return arrayBufferToBase64(wav);
}

export function generateChordWav(notes: string[], duration: number = 1.8): string {
  // Map each note to a sensible octave (root at 4, others nearby)
  const freqs = notes.map((note, i) => {
    let octave = 4;
    // Keep higher chord tones in the same octave range
    if (i > 0) {
      const rootFreq = getNoteFrequency(notes[0], 4);
      let noteFreq = getNoteFrequency(note, 4);
      // If note freq is lower than root (due to enharmonic/wrap), bump up an octave
      if (noteFreq < rootFreq) octave = 5;
    }
    return getNoteFrequency(note, octave);
  });
  const samples = generateSamples(freqs, duration, SAMPLE_RATE);
  const wav = samplesToWav(samples, SAMPLE_RATE);
  return arrayBufferToBase64(wav);
}

export function generateArpeggioWav(notes: string[], noteDuration: number = 0.35): string {
  // Stitch individual note samples together for an arpeggio
  const totalSamples = Math.floor(SAMPLE_RATE * noteDuration * notes.length);
  const combined = new Float32Array(totalSamples);
  const samplesPerNote = Math.floor(SAMPLE_RATE * noteDuration);

  notes.forEach((note, i) => {
    let octave = 4;
    if (i > 0) {
      const rootFreq = getNoteFrequency(notes[0], 4);
      if (getNoteFrequency(note, 4) < rootFreq) octave = 5;
    }
    const freq = getNoteFrequency(note, octave);
    const noteSamples = generateSamples([freq], noteDuration, SAMPLE_RATE);
    const offset = i * samplesPerNote;
    for (let j = 0; j < noteSamples.length && offset + j < totalSamples; j++) {
      combined[offset + j] = noteSamples[j];
    }
  });

  const wav = samplesToWav(combined, SAMPLE_RATE);
  return arrayBufferToBase64(wav);
}

export function generateScaleArpeggioWav(notes: string[]): string {
  // Play scale up then back down
  const ascending = [...notes];
  const descending = [...notes].reverse().slice(1);
  return generateArpeggioWav([...ascending, ...descending], 0.28);
}
