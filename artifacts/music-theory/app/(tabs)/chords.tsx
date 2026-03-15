import React, { useState } from "react";
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
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { useMusicContext } from "@/context/MusicContext";
import { ChordCard } from "@/components/ChordCard";
import { ProgressionCard } from "@/components/ProgressionCard";
import { Chord, ChordQuality } from "@/lib/musicTheory";
import { useAudio } from "@/hooks/useAudio";

type TabType = "chords" | "progressions";

export default function ChordsScreen() {
  const { selectedKey, selectedScale, scaleData } = useMusicContext();
  const insets = useSafeAreaInsets();
  const colors = Colors.light;
  const [tab, setTab] = useState<TabType>("chords");
  const [selectedChord, setSelectedChord] = useState<Chord | null>(null);
  const [playingChord, setPlayingChord] = useState<number | null>(null);
  const [playingArpeggio, setPlayingArpeggio] = useState<number | null>(null);
  const { playChord, playArpeggio } = useAudio();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 100 : insets.bottom + 90;

  const hasChords = scaleData.chords.length > 0;
  const hasProgressions = scaleData.progressions.length > 0;

  const handlePlayChord = async (chord: Chord) => {
    if (playingChord === chord.degree) return;
    setPlayingChord(chord.degree);
    setSelectedChord(chord);
    await playChord(chord.notes);
    setPlayingChord(null);
  };

  const handlePlayArpeggio = async (chord: Chord) => {
    if (playingArpeggio === chord.degree) return;
    setPlayingArpeggio(chord.degree);
    await playArpeggio(chord.notes);
    setPlayingArpeggio(null);
  };

  const handlePlayProgression = async (degrees: number[]) => {
    for (const degree of degrees) {
      const chord = scaleData.chords.find((c) => c.degree === degree);
      if (chord) {
        setPlayingChord(chord.degree);
        await playChord(chord.notes);
        setPlayingChord(null);
        await delay(150);
      }
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View>
          <Text style={styles.headerTitle}>{selectedKey} {selectedScale}</Text>
          <Text style={styles.headerSubtitle}>Tap any chord to hear it</Text>
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
                <Text style={styles.sectionLabel}>TAP A CHORD CARD TO HEAR IT</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                  <View style={styles.chordScrollRow}>
                    {scaleData.chords.map((chord) => {
                      const isPlaying = playingChord === chord.degree;
                      return (
                        <Pressable
                          key={chord.degree}
                          onPress={() => handlePlayChord(chord)}
                          style={({ pressed }) => [
                            styles.chordCardWrapper,
                            isPlaying && styles.chordCardPlaying,
                            pressed && { opacity: 0.8 },
                          ]}
                        >
                          <ChordCard chord={chord} />
                          {isPlaying && (
                            <View style={styles.playingOverlay}>
                              <ActivityIndicator color="#fff" size="small" />
                            </View>
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>

                {selectedChord && (
                  <View style={[styles.detailCard, { borderColor: colors.tint }]}>
                    <View style={styles.detailHeader}>
                      <Text style={styles.detailTitle}>{selectedChord.fullName}</Text>
                      <View style={styles.detailActions}>
                        <Pressable
                          onPress={() => handlePlayArpeggio(selectedChord)}
                          style={[styles.actionBtn, { backgroundColor: colors.tint + "22" }]}
                        >
                          {playingArpeggio === selectedChord.degree ? (
                            <ActivityIndicator size="small" color={colors.tint} />
                          ) : (
                            <Feather name="activity" size={16} color={colors.tint} />
                          )}
                          <Text style={[styles.actionBtnText, { color: colors.tint }]}>Arpeggio</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => handlePlayChord(selectedChord)}
                          style={[styles.actionBtn, { backgroundColor: colors.tint }]}
                        >
                          {playingChord === selectedChord.degree ? (
                            <ActivityIndicator size="small" color="#fff" />
                          ) : (
                            <Feather name="play" size={16} color="#fff" />
                          )}
                          <Text style={[styles.actionBtnText, { color: "#fff" }]}>Chord</Text>
                        </Pressable>
                        <Pressable onPress={() => setSelectedChord(null)}>
                          <Feather name="x" size={18} color={colors.textSecondary} />
                        </Pressable>
                      </View>
                    </View>
                    <View style={styles.detailRow}>
                      <InfoBadge label="Roman" value={selectedChord.romanNumeral} />
                      <InfoBadge label="Quality" value={getQualityName(selectedChord.quality)} />
                      <InfoBadge label="Degree" value={`${selectedChord.degree}`} />
                    </View>
                    <Text style={styles.detailSubLabel}>CHORD TONES — TAP TO HEAR</Text>
                    <View style={styles.chordTones}>
                      {selectedChord.notes.map((n, i) => (
                        <ToneButton
                          key={i}
                          note={n}
                          role={getChordToneRole(i)}
                          color={colors.tint}
                        />
                      ))}
                    </View>
                    <Text style={styles.detailSubLabel}>INTERVALS</Text>
                    <Text style={styles.intervalText}>{getChordIntervals(selectedChord.quality)}</Text>
                  </View>
                )}

                <Text style={styles.sectionLabel}>ALL CHORDS — TAP TO PLAY</Text>
                {scaleData.chords.map((chord) => (
                  <Pressable
                    key={chord.degree}
                    onPress={() => handlePlayChord(chord)}
                    style={({ pressed }) => [
                      styles.compactChordWrapper,
                      playingChord === chord.degree && { opacity: 0.7 },
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <ChordCard chord={chord} compact />
                    {playingChord === chord.degree && (
                      <View style={styles.compactPlayIndicator}>
                        <ActivityIndicator size="small" color={colors.tint} />
                      </View>
                    )}
                  </Pressable>
                ))}

                <View style={styles.chordLegend}>
                  <Text style={styles.legendTitle}>Chord Quality Legend</Text>
                  {[
                    { color: colors.chord.major, label: "Major (bright, stable)" },
                    { color: colors.chord.minor, label: "Minor (dark, melancholic)" },
                    { color: colors.chord.diminished, label: "Diminished (tense, unstable)" },
                    { color: colors.chord.augmented, label: "Augmented (mysterious)" },
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
                <Text style={styles.sectionLabel}>TAP ▶ TO HEAR A PROGRESSION</Text>
                {scaleData.progressions.map((prog, i) => (
                  <PlayableProgression
                    key={i}
                    name={prog.name}
                    degrees={prog.degrees}
                    numerals={prog.numerals}
                    chords={scaleData.chords}
                    onPlay={() => handlePlayProgression(prog.degrees)}
                    isPlaying={false}
                  />
                ))}

                <View style={styles.progressionInfo}>
                  <Text style={styles.progressionInfoTitle}>How to Use Progressions</Text>
                  <Text style={styles.progressionInfoText}>
                    Roman numerals show the scale degree. Uppercase = Major, lowercase = minor.
                    Press ▶ to hear the chords play in sequence.
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

function ToneButton({ note, role, color }: { note: string; role: string; color: string }) {
  const { playNote } = useAudio();
  const [playing, setPlaying] = useState(false);

  const handlePress = async () => {
    if (playing) return;
    setPlaying(true);
    await playNote(note, 4);
    setPlaying(false);
  };

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
      <View style={[styles.toneBubble, { backgroundColor: color }, playing && { opacity: 0.8 }]}>
        <Text style={styles.toneNote}>{note}</Text>
        <Text style={styles.toneRole}>{role}</Text>
        {playing ? (
          <ActivityIndicator size="small" color="rgba(255,255,255,0.8)" />
        ) : (
          <Feather name="volume-2" size={10} color="rgba(255,255,255,0.6)" />
        )}
      </View>
    </Pressable>
  );
}

function PlayableProgression({
  name, degrees, numerals, chords, onPlay, isPlaying,
}: {
  name: string;
  degrees: number[];
  numerals: string[];
  chords: Chord[];
  onPlay: () => void;
  isPlaying: boolean;
}) {
  const colors = Colors.light;
  const [localPlaying, setLocalPlaying] = useState(false);

  const handlePlay = async () => {
    if (localPlaying) return;
    setLocalPlaying(true);
    await onPlay();
    setLocalPlaying(false);
  };

  const getChordForDegree = (degree: number) => chords.find((c) => c.degree === degree);

  return (
    <View style={styles.progCard}>
      <View style={styles.progHeader}>
        <Text style={styles.progName}>{name}</Text>
        <Pressable onPress={handlePlay} style={[styles.progPlayBtn, localPlaying && { opacity: 0.6 }]}>
          {localPlaying ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Feather name="play" size={14} color="#fff" />
          )}
        </Pressable>
      </View>
      <View style={styles.progChords}>
        {numerals.map((numeral, i) => {
          const chord = getChordForDegree(degrees[i]);
          return (
            <View key={i} style={styles.progStep}>
              <View style={[styles.progNumeralBadge, { backgroundColor: colors.tint + "22" }]}>
                <Text style={[styles.progNumeral, { color: colors.tint }]}>{numeral}</Text>
              </View>
              {chord && <Text style={styles.progChordName}>{chord.name}</Text>}
              {i < numerals.length - 1 && <Text style={styles.progArrow}>→</Text>}
            </View>
          );
        })}
      </View>
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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

function getChordToneRole(i: number): string {
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
    fontSize: 13,
    color: Colors.light.tint,
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
  chordScrollRow: {
    flexDirection: "row",
    gap: 0,
    paddingRight: 8,
  },
  chordCardWrapper: {
    position: "relative",
  },
  chordCardPlaying: {
    transform: [{ scale: 1.05 }],
  },
  playingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
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
    flexWrap: "wrap",
    gap: 8,
  },
  detailTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: Colors.light.text,
    flex: 1,
  },
  detailActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  actionBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
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
    flexWrap: "wrap",
  },
  toneBubble: {
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    minWidth: 60,
    gap: 3,
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
  },
  intervalText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  compactChordWrapper: {
    position: "relative",
  },
  compactPlayIndicator: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
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
  progCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  progHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.light.text,
    flex: 1,
  },
  progPlayBtn: {
    backgroundColor: Colors.light.tint,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  progChords: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
  },
  progStep: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  progNumeralBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  progNumeral: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
  },
  progChordName: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  progArrow: {
    color: Colors.light.border,
    fontSize: 14,
    marginHorizontal: 2,
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
