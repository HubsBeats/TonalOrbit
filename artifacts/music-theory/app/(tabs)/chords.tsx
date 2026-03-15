import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { useMusicContext } from "@/context/MusicContext";
import { ChordCard } from "@/components/ChordCard";
import { ProgressionCard } from "@/components/ProgressionCard";
import { Chord, ChordQuality } from "@/lib/musicTheory";

type TabType = "chords" | "progressions";

export default function ChordsScreen() {
  const { selectedKey, selectedScale, scaleData } = useMusicContext();
  const insets = useSafeAreaInsets();
  const colors = Colors.light;
  const [tab, setTab] = useState<TabType>("chords");
  const [selectedChord, setSelectedChord] = useState<Chord | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 100 : insets.bottom + 90;

  const hasChords = scaleData.chords.length > 0;
  const hasProgressions = scaleData.progressions.length > 0;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View>
          <Text style={styles.headerTitle}>{selectedKey} {selectedScale}</Text>
          <Text style={styles.headerSubtitle}>Chords & Progressions</Text>
        </View>
      </View>

      <View style={styles.tabBar}>
        {(["chords", "progressions"] as TabType[]).map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tabBtn, tab === t && { borderBottomColor: colors.tint, borderBottomWidth: 2 }]}
          >
            <Text style={[styles.tabText, tab === t && { color: colors.tint }]}>
              {t === "chords" ? "Diatonic Chords" : "Progressions"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPad, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {tab === "chords" && (
          <>
            {!hasChords ? (
              <View style={styles.empty}>
                <Feather name="layers" size={40} color={colors.border} />
                <Text style={styles.emptyTitle}>No diatonic chords</Text>
                <Text style={styles.emptyText}>Chord data is not available for this scale type.</Text>
              </View>
            ) : (
              <>
                <Text style={styles.sectionLabel}>SCROLL TO EXPLORE ALL CHORDS</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                  {scaleData.chords.map((chord) => (
                    <Pressable key={chord.degree} onPress={() => setSelectedChord(selectedChord?.degree === chord.degree ? null : chord)}>
                      <ChordCard chord={chord} />
                    </Pressable>
                  ))}
                </ScrollView>

                {selectedChord && (
                  <View style={[styles.detailCard, { borderColor: colors.tint }]}>
                    <View style={styles.detailHeader}>
                      <Text style={styles.detailTitle}>{selectedChord.fullName}</Text>
                      <Pressable onPress={() => setSelectedChord(null)}>
                        <Feather name="x" size={18} color={colors.textSecondary} />
                      </Pressable>
                    </View>
                    <View style={styles.detailRow}>
                      <InfoBadge label="Roman" value={selectedChord.romanNumeral} />
                      <InfoBadge label="Quality" value={getQualityName(selectedChord.quality)} />
                      <InfoBadge label="Degree" value={`${selectedChord.degree}`} />
                    </View>
                    <Text style={styles.detailSubLabel}>CHORD TONES</Text>
                    <View style={styles.chordTones}>
                      {selectedChord.notes.map((n, i) => (
                        <View key={i} style={[styles.toneBubble, { backgroundColor: colors.tint }]}>
                          <Text style={styles.toneNote}>{n}</Text>
                          <Text style={styles.toneRole}>{getChordToneRole(i, selectedChord.quality)}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={styles.detailSubLabel}>INTERVALS</Text>
                    <Text style={styles.intervalText}>{getChordIntervals(selectedChord.quality)}</Text>
                  </View>
                )}

                <Text style={styles.sectionLabel}>ALL CHORDS — LIST VIEW</Text>
                {scaleData.chords.map((chord) => (
                  <ChordCard key={chord.degree} chord={chord} compact />
                ))}

                <View style={styles.chordLegend}>
                  <Text style={styles.legendTitle}>Chord Quality Legend</Text>
                  {[
                    { color: colors.chord.major, label: "Major (bright, stable)" },
                    { color: colors.chord.minor, label: "Minor (dark, melancholic)" },
                    { color: colors.chord.diminished, label: "Diminished (tense, unstable)" },
                    { color: colors.chord.augmented, label: "Augmented (mysterious, tense)" },
                    { color: colors.chord.dominant, label: "Dominant 7th (bluesy, resolving)" },
                  ].map((item) => (
                    <View key={item.label} style={styles.legendRow}>
                      <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                      <Text style={styles.legendText}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </>
        )}

        {tab === "progressions" && (
          <>
            {!hasProgressions ? (
              <View style={styles.empty}>
                <Feather name="shuffle" size={40} color={colors.border} />
                <Text style={styles.emptyTitle}>No progressions</Text>
                <Text style={styles.emptyText}>No common progressions for this scale. Try Major or Natural Minor.</Text>
              </View>
            ) : (
              <>
                <Text style={styles.sectionLabel}>COMMON PROGRESSIONS</Text>
                {scaleData.progressions.map((prog, i) => (
                  <ProgressionCard
                    key={i}
                    name={prog.name}
                    degrees={prog.degrees}
                    numerals={prog.numerals}
                    chords={scaleData.chords}
                  />
                ))}

                <View style={styles.progressionInfo}>
                  <Text style={styles.progressionInfoTitle}>How to Use Progressions</Text>
                  <Text style={styles.progressionInfoText}>
                    Roman numerals indicate the scale degree. Uppercase = Major, lowercase = minor. The numbers show which chord from your scale to play. Try playing each chord in sequence to hear the progression.
                  </Text>
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function InfoBadge({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoBadge}>
      <Text style={styles.infoBadgeLabel}>{label}</Text>
      <Text style={styles.infoBadgeValue}>{value}</Text>
    </View>
  );
}

function getQualityName(q: ChordQuality): string {
  switch (q) {
    case "maj": return "Major";
    case "min": return "Minor";
    case "dim": return "Diminished";
    case "aug": return "Augmented";
    case "maj7": return "Major 7";
    case "min7": return "Minor 7";
    case "7": return "Dominant 7";
    case "min7b5": return "Half Dim";
    case "dim7": return "Full Dim";
  }
}

function getChordToneRole(i: number, q: ChordQuality): string {
  const roles: Record<number, string> = { 0: "Root", 1: "3rd", 2: "5th", 3: "7th" };
  return roles[i] || "";
}

function getChordIntervals(q: ChordQuality): string {
  switch (q) {
    case "maj": return "Root – Major 3rd (4st) – Perfect 5th (7st)";
    case "min": return "Root – Minor 3rd (3st) – Perfect 5th (7st)";
    case "dim": return "Root – Minor 3rd (3st) – Diminished 5th (6st)";
    case "aug": return "Root – Major 3rd (4st) – Augmented 5th (8st)";
    case "maj7": return "Root – Major 3rd – Perfect 5th – Major 7th";
    case "min7": return "Root – Minor 3rd – Perfect 5th – Minor 7th";
    case "7": return "Root – Major 3rd – Perfect 5th – Minor 7th";
    case "min7b5": return "Root – Minor 3rd – Dim 5th – Minor 7th";
    case "dim7": return "Root – Minor 3rd – Dim 5th – Dim 7th";
  }
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    color: Colors.light.text,
  },
  headerSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  tabBtn: {
    paddingVertical: 10,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  sectionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: Colors.light.textSecondary,
    letterSpacing: 1.2,
    marginBottom: 12,
    marginTop: 4,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: Colors.light.text,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: "center",
    maxWidth: 280,
  },
  detailCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  detailTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: Colors.light.text,
  },
  detailRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  infoBadge: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  infoBadgeLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: Colors.light.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoBadgeValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: Colors.light.text,
    marginTop: 2,
  },
  detailSubLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: Colors.light.textSecondary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  chordTones: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  toneBubble: {
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    minWidth: 56,
  },
  toneNote: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#fff",
  },
  toneRole: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  intervalText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  chordLegend: {
    backgroundColor: Colors.light.surface,
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
    marginBottom: 8,
  },
  legendTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 10,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  progressionInfo: {
    backgroundColor: Colors.light.surface,
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
  },
  progressionInfoTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 8,
  },
  progressionInfoText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
});
