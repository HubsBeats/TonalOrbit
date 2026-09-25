import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import * as FileSystem from "expo-file-system/legacy";
import * as Haptics from "expo-haptics";
import { useCallback, useRef } from "react";
import { Platform } from "react-native";
import {
  generateArpeggioWav,
  generateChordWav,
  generateNoteWav,
  generateScaleArpeggioWav,
} from "@/lib/audioEngine";

let audioModeSet = false;
async function ensureAudioMode() {
  if (audioModeSet) return;
  try {
    await setAudioModeAsync({ playsInSilentMode: true });
    audioModeSet = true;
  } catch {}
}

async function playBase64Wav(base64: string): Promise<void> {
  await ensureAudioMode();

  let uri: string;

  if (Platform.OS === "web") {
    uri = `data:audio/wav;base64,${base64}`;
  } else {
    const path = `${FileSystem.cacheDirectory}mt_tone_${Date.now()}.wav`;
    await FileSystem.writeAsStringAsync(path, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    uri = path;
  }

  const player = createAudioPlayer({ uri });
  player.play();

  // Clean up after ~3 seconds to free memory
  setTimeout(() => {
    try { player.remove(); } catch {}
    // Also delete temp file on native
    if (Platform.OS !== "web" && uri.startsWith("file://")) {
      FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => {});
    }
  }, 3000);
}

export function useAudio() {
  const pendingRef = useRef(false);

  const playNote = useCallback(async (note: string, octave = 4) => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      const wav = generateNoteWav(note, octave, 1.0);
      await playBase64Wav(wav);
    } catch (e) {
      console.warn("playNote error:", e);
    } finally {
      pendingRef.current = false;
    }
  }, []);

  const playChord = useCallback(async (notes: string[], duration = 2.0) => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      const wav = generateChordWav(notes, duration);
      await playBase64Wav(wav);
    } catch (e) {
      console.warn("playChord error:", e);
    } finally {
      pendingRef.current = false;
    }
  }, []);

  const playArpeggio = useCallback(async (notes: string[]) => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      const wav = generateArpeggioWav(notes, 0.35);
      await playBase64Wav(wav);
    } catch (e) {
      console.warn("playArpeggio error:", e);
    } finally {
      pendingRef.current = false;
    }
  }, []);

  const playScale = useCallback(async (notes: string[]) => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      const wav = generateScaleArpeggioWav(notes);
      await playBase64Wav(wav);
    } catch (e) {
      console.warn("playScale error:", e);
    } finally {
      pendingRef.current = false;
    }
  }, []);

  return { playNote, playChord, playArpeggio, playScale };
}
