import React from "react";
import {
  Platform,
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

export default function CircleScreen() {
  const { selectedKey, setKey } = useMusicContext();
  const insets = useSafeAreaInsets();
  const colors = Colors.light;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 100 : insets.bottom + 90;

  const currentEntry = CIRCLE_OF_FIFTHS.find((k) => k.major === selectedKey);
  const sfCount = currentEntry?.sharpsFlats ?? 0;
  const sfLabel =
    sfCount > 0 ? `${sfCount} sharp${sfCount > 1 ? "s" : ""}` :
    sfCount < 0 ? `${Math.abs(sfCount)} flat${Math.abs(sfCount) > 1 ? "s" : ""}` :
    "No sharps or flats";

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={styles.headerTitle}>Circle of Fifths</Text>
        <Text style={styles.headerSubtitle}>Tap any key to select it</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPad, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <CircleOfFifths activeKey={selectedKey} onSelectKey={setKey} />

        {currentEntry && (
          <View style={styles.keyInfo}>
            <View style={[styles.keyInfoHeader, { backgroundColor: colors.tint }]}>
              <Text style={styles.keyInfoTitle}>{currentEntry.major} Major</Text>
              <Text style={styles.keyInfoSub}>{currentEntry.minor} — Relative Minor</Text>
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
            text="The Circle of Fifths is a diagram showing the 12 major keys arranged in a circle, where each key is a perfect fifth above the previous one. Moving clockwise adds sharps; counter-clockwise adds flats."
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
          <TheorySection
            title="Chord Borrowing"
            text="Neighboring keys on the circle share many common chords, making modulation and chord borrowing between adjacent keys feel natural."
          />
        </View>

        <View style={styles.fifthsTable}>
          <Text style={styles.fifthsTitle}>All Keys — Sharps & Flats</Text>
          {CIRCLE_OF_FIFTHS.map((k) => (
            <View key={k.key} style={styles.fifthsRow}>
              <View style={[styles.fifthsKeyBadge, selectedKey === k.major && { backgroundColor: colors.tint }]}>
                <Text style={[styles.fifthsKey, selectedKey === k.major && { color: "#fff" }]}>{k.major}</Text>
              </View>
              <Text style={styles.fifthsMinor}>{k.minor}</Text>
              <Text style={styles.fifthsSF}>
                {k.sharpsFlats === 0 ? "♮ None" : k.sharpsFlats > 0 ? `${k.sharpsFlats}♯` : `${Math.abs(k.sharpsFlats)}♭`}
              </Text>
            </View>
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
    fontSize: 14,
    color: Colors.light.textSecondary,
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
    paddingVertical: 7,
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
