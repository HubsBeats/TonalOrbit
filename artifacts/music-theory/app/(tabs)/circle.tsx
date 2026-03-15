import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useMusicContext } from "@/context/MusicContext";
import { CircleOfFifths } from "@/components/CircleOfFifths";
import { CIRCLE_OF_FIFTHS } from "@/lib/musicTheory";
import { useAudio } from "@/hooks/useAudio";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";

export default function CircleScreen() {
  const { selectedKey, setKey } = useMusicContext();
  const insets = useSafeAreaInsets();
  const colors = Colors.light;
  const { playNote, playChord } = useAudio();
  const [playingKey, setPlayingKey] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 100 : insets.bottom + 90;

  const currentEntry = CIRCLE_OF_FIFTHS.find((k) => k.major === selectedKey);
  const sfCount = currentEntry?.sharpsFlats ?? 0;
  const sfLabel =
    sfCount > 0 ? `${sfCount} sharp${sfCount > 1 ? "s" : ""}` :
    sfCount < 0 ? `${Math.abs(sfCount)} flat${Math.abs(sfCount) > 1 ? "s" : ""}` :
    "No sharps or flats";

  const handleSelectKey = async (key: string) => {
    setKey(key);
    setPlayingKey(key);
    await playNote(key, 4);
    setPlayingKey(null);
  };

  const handlePlayMajorChord = async (key: string) => {
    if (playingKey === key + "chord") return;
    setPlayingKey(key + "chord");
    // Major triad: root, major 3rd (+4st), perfect 5th (+7st)
    const rootIdx = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"].indexOf(key);
    if (rootIdx === -1) {
      await playNote(key, 4);
    } else {
      const allNotes = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
      const third = allNotes[(rootIdx + 4) % 12];
      const fifth = allNotes[(rootIdx + 7) % 12];
      await playChord([key, third, fifth]);
    }
    setPlayingKey(null);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={styles.headerTitle}>Circle of Fifths</Text>
        <Text style={styles.headerSubtitle}>Tap any key to hear & select it</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPad, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <CircleOfFifths activeKey={selectedKey} onSelectKey={handleSelectKey} />

        {currentEntry && (
          <View style={styles.keyInfo}>
            <View style={[styles.keyInfoHeader, { backgroundColor: colors.tint }]}>
              <View>
                <Text style={styles.keyInfoTitle}>{currentEntry.major} Major</Text>
                <Text style={styles.keyInfoSub}>{currentEntry.minor} — Relative Minor</Text>
              </View>
              <View style={styles.keyAudioBtns}>
                <Pressable
                  onPress={() => handleSelectKey(currentEntry.major)}
                  style={styles.audioBtn}
                >
                  {playingKey === currentEntry.major ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Feather name="music" size={16} color="#fff" />
                  )}
                  <Text style={styles.audioBtnText}>Note</Text>
                </Pressable>
                <Pressable
                  onPress={() => handlePlayMajorChord(currentEntry.major)}
                  style={styles.audioBtn}
                >
                  {playingKey === currentEntry.major + "chord" ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Feather name="layers" size={16} color="#fff" />
                  )}
                  <Text style={styles.audioBtnText}>Chord</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.keyInfoBody}>
              <InfoRow label="Key Signature" value={sfLabel} />
              <InfoRow label="Sharps / Flats" value={sfCount === 0 ? "None" : `${Math.abs(sfCount)}`} />
              <InfoRow label="Adjacent Keys (5ths)" value={getAdjacentKeys(selectedKey)} />
            </View>
          </View>
        )}

        <View style={styles.theoryCard}>
          <Text style={styles.theoryTitle}>Understanding the Circle of Fifths</Text>
          <TheorySection
            title="What is it?"
            text="The Circle of Fifths shows all 12 major keys arranged in a circle where each key is a perfect fifth above the previous. Moving clockwise adds sharps; counter-clockwise adds flats."
          />
          <TheorySection
            title="Major Keys (Outer Ring)"
            text="The outer ring shows major keys. Adjacent keys share 6 of 7 notes, making chord substitutions easy between them."
          />
          <TheorySection
            title="Relative Minors (Inner Ring)"
            text="Each major key has a relative minor that shares the same key signature. The relative minor starts on the 6th degree of the major scale."
          />
          <TheorySection
            title="Perfect Fifth Relationship"
            text="Moving clockwise by a perfect fifth (7 semitones) adds one sharp. Moving counter-clockwise adds one flat. C major has no sharps or flats."
          />
        </View>

        <View style={styles.fifthsTable}>
          <Text style={styles.fifthsTitle}>All Keys — Tap to Hear</Text>
          {CIRCLE_OF_FIFTHS.map((k) => (
            <Pressable
              key={k.key}
              onPress={() => handleSelectKey(k.major)}
              style={({ pressed }) => [styles.fifthsRow, pressed && { opacity: 0.7 }]}
            >
              <View style={[styles.fifthsKeyBadge, selectedKey === k.major && { backgroundColor: colors.tint }]}>
                {playingKey === k.major ? (
                  <ActivityIndicator size="small" color={selectedKey === k.major ? "#fff" : colors.tint} />
                ) : (
                  <Text style={[styles.fifthsKey, selectedKey === k.major && { color: "#fff" }]}>{k.major}</Text>
                )}
              </View>
              <Text style={styles.fifthsMinor}>{k.minor}</Text>
              <Text style={styles.fifthsSF}>
                {k.sharpsFlats === 0 ? "♮ None" : k.sharpsFlats > 0 ? `${k.sharpsFlats}♯` : `${Math.abs(k.sharpsFlats)}♭`}
              </Text>
              <Feather name="volume-2" size={14} color={colors.border} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function TheorySection({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.theorySection}>
      <Text style={styles.theorySectionTitle}>{title}</Text>
      <Text style={styles.theorySectionText}>{text}</Text>
    </View>
  );
}

function getAdjacentKeys(key: string): string {
  const idx = CIRCLE_OF_FIFTHS.findIndex((k) => k.major === key);
  if (idx === -1) return "—";
  const prev = CIRCLE_OF_FIFTHS[(idx + 11) % 12];
  const next = CIRCLE_OF_FIFTHS[(idx + 1) % 12];
  return `${prev.major} ← ${key} → ${next.major}`;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: Colors.light.text,
  },
  headerSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.light.tint,
    marginTop: 2,
  },
  keyInfo: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  keyInfoHeader: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  keyInfoTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: "#fff",
  },
  keyInfoSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  keyAudioBtns: {
    flexDirection: "row",
    gap: 8,
  },
  audioBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
    gap: 4,
    minWidth: 50,
  },
  audioBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: "#fff",
  },
  keyInfoBody: {
    backgroundColor: Colors.light.surface,
    padding: 14,
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  infoValue: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.light.text,
  },
  theoryCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  theoryTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 14,
  },
  theorySection: {
    marginBottom: 14,
  },
  theorySectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.light.tint,
    marginBottom: 4,
  },
  theorySectionText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  fifthsTable: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
  },
  fifthsTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 12,
  },
  fifthsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    gap: 12,
  },
  fifthsKeyBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  fifthsKey: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: Colors.light.text,
  },
  fifthsMinor: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  fifthsSF: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.light.tint,
    minWidth: 40,
    textAlign: "right",
  },
});
