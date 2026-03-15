import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  ALL_KEYS,
  ScaleName,
  ScaleData,
  buildScaleData,
  SCALE_DEFINITIONS,
} from "@/lib/musicTheory";

interface MusicContextType {
  selectedKey: string;
  selectedScale: ScaleName;
  scaleData: ScaleData;
  setKey: (key: string) => void;
  setScale: (scale: ScaleName) => void;
  favoriteKeys: string[];
  toggleFavoriteKey: (key: string) => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

const STORAGE_KEY = "music_theory_prefs";

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [selectedKey, setSelectedKey] = useState<string>("C");
  const [selectedScale, setSelectedScale] = useState<ScaleName>("Major");
  const [favoriteKeys, setFavoriteKeys] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) {
        try {
          const prefs = JSON.parse(val);
          if (prefs.key && ALL_KEYS.includes(prefs.key)) setSelectedKey(prefs.key);
          if (prefs.scale && SCALE_DEFINITIONS[prefs.scale as ScaleName]) setSelectedScale(prefs.scale);
          if (Array.isArray(prefs.favoriteKeys)) setFavoriteKeys(prefs.favoriteKeys);
        } catch {}
      }
    });
  }, []);

  const savePrefs = useCallback((key: string, scale: ScaleName, favs: string[]) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ key, scale, favoriteKeys: favs }));
  }, []);

  const setKey = useCallback((key: string) => {
    setSelectedKey(key);
    setFavoriteKeys((favs) => {
      savePrefs(key, selectedScale, favs);
      return favs;
    });
  }, [selectedScale, savePrefs]);

  const setScale = useCallback((scale: ScaleName) => {
    setSelectedScale(scale);
    savePrefs(selectedKey, scale, favoriteKeys);
  }, [selectedKey, favoriteKeys, savePrefs]);

  const toggleFavoriteKey = useCallback((key: string) => {
    setFavoriteKeys((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      savePrefs(selectedKey, selectedScale, next);
      return next;
    });
  }, [selectedKey, selectedScale, savePrefs]);

  const scaleData = buildScaleData(selectedKey, selectedScale);

  return (
    <MusicContext.Provider value={{
      selectedKey,
      selectedScale,
      scaleData,
      setKey,
      setScale,
      favoriteKeys,
      toggleFavoriteKey,
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusicContext(): MusicContextType {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusicContext must be used within MusicProvider");
  return ctx;
}
