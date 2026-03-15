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

type Section = "intervals" | "chords" | "scales" | "terminology";

const INTERVALS = [
  { semitones: 0, name: "Perfect Unison", abbr: "P1", consonance: "Perfect" },
  { semitones: 1, name: "Minor Second", abbr: "m2", consonance: "Dissonant" },
  { semitones: 2, name: "Major Second", abbr: "M2", consonance: "Mild dissonant" },
  { semitones: 3, name: "Minor Third", abbr: "m3", consonance: "Consonant" },
  { semitones: 4, name: "Major Third", abbr: "M3", consonance: "Consonant" },
  { semitones: 5, name: "Perfect Fourth", abbr: "P4", consonance: "Consonant" },
  { semitones: 6, name: "Tritone / Aug 4th", abbr: "TT", consonance: "Dissonant" },
  { semitones: 7, name: "Perfect Fifth", abbr: "P5", consonance: "Perfect" },
  { semitones: 8, name: "Minor Sixth", abbr: "m6", consonance: "Consonant" },
  { semitones: 9, name: "Major Sixth", abbr: "M6", consonance: "Consonant" },
  { semitones: 10, name: "Minor Seventh", abbr: "m7", consonance: "Mild dissonant" },
  { semitones: 11, name: "Major Seventh", abbr: "M7", consonance: "Dissonant" },
  { semitones: 12, name: "Perfect Octave", abbr: "P8", consonance: "Perfect" },
];

const CHORD_FORMULAS = [
  { name: "Major", symbol: "", formula: "1 – 3 – 5", semitones: "0-4-7", sound: "Bright, happy" },
  { name: "Minor", symbol: "m", formula: "1 – b3 – 5", semitones: "0-3-7", sound: "Dark, sad" },
  { name: "Diminished", symbol: "°", formula: "1 – b3 – b5", semitones: "0-3-6", sound: "Tense, unstable" },
  { name: "Augmented", symbol: "+", formula: "1 – 3 – #5", semitones: "0-4-8", sound: "Mysterious" },
  { name: "Sus2", symbol: "sus2", formula: "1 – 2 – 5", semitones: "0-2-7", sound: "Open, floating" },
  { name: "Sus4", symbol: "sus4", formula: "1 – 4 – 5", semitones: "0-5-7", sound: "Suspended, tense" },
  { name: "Major 7th", symbol: "maj7", formula: "1 – 3 – 5 – 7", semitones: "0-4-7-11", sound: "Dreamy, lush" },
  { name: "Minor 7th", symbol: "m7", formula: "1 – b3 – 5 – b7", semitones: "0-3-7-10", sound: "Smooth, jazz" },
  { name: "Dominant 7th", symbol: "7", formula: "1 – 3 – 5 – b7", semitones: "0-4-7-10", sound: "Bluesy, tense" },
  { name: "Diminished 7th", symbol: "°7", formula: "1 – b3 – b5 – bb7", semitones: "0-3-6-9", sound: "Very tense" },
  { name: "Half Dim 7th", symbol: "ø7", formula: "1 – b3 – b5 – b7", semitones: "0-3-6-10", sound: "Jazz, moody" },
  { name: "Major 9th", symbol: "maj9", formula: "1 – 3 – 5 – 7 – 9", semitones: "0-4-7-11-14", sound: "Rich, full" },
  { name: "Minor 9th", symbol: "m9", formula: "1 – b3 – 5 – b7 – 9", semitones: "0-3-7-10-14", sound: "Deep, mellow" },
  { name: "Add9", symbol: "add9", formula: "1 – 3 – 5 – 9", semitones: "0-4-7-14", sound: "Bright, open" },
];

const TERMINOLOGY = [
  { term: "Tonic", def: "The root note of a key. The 'home' note that everything resolves to." },
  { term: "Dominant", def: "The 5th degree of a scale. Creates strong tension that wants to resolve to the tonic." },
  { term: "Subdominant", def: "The 4th degree. Creates mild tension and is a common chord in progressions." },
  { term: "Leading Tone", def: "The 7th degree (a half step below the octave). Strongly pulls toward the tonic." },
  { term: "Diatonic", def: "Notes or chords that belong to the scale. All 7 chords built from a scale are diatonic." },
  { term: "Chromatic", def: "Notes outside the current key signature. Used for color and passing tones." },
  { term: "Modulation", def: "Changing from one key to another during a song." },
  { term: "Cadence", def: "A sequence of chords that creates a sense of arrival or rest." },
  { term: "Inversion", def: "Playing a chord with a note other than the root in the bass." },
  { term: "Voice Leading", def: "The smooth movement of individual notes between chords." },
  { term: "Transposition", def: "Moving a melody or chord progression to a different key." },
  { term: "Mode", def: "A scale built starting on a different degree of the major scale." },
  { term: "Enharmonic", def: "Two notes that sound the same but are spelled differently (e.g., C# and Db)." },
  { term: "Polyphony", def: "Multiple independent melodic lines played simultaneously." },
  { term: "Harmony", def: "The combination of notes played simultaneously to support a melody." },
  { term: "Counterpoint", def: "The technique of combining two or more melodic lines simultaneously." },
  { term: "Resolution", def: "The movement from tension (dissonance) to rest (consonance)." },
  { term: "Tritone", def: "An interval of 6 semitones (augmented 4th / diminished 5th). The most dissonant interval." },
  { term: "Chord Voicing", def: "The arrangement of notes within a chord, including which octave each note is played." },
  { term: "Pedal Point", def: "A sustained or repeated note (usually the root or 5th) held while harmonies change above it." },
];

const SCALE_THEORY_SECTIONS = [
  {
    title: "Major Scale Formula",
    content: "W W H W W W H\n(Whole, Whole, Half, Whole, Whole, Whole, Half)\n\nThis pattern of whole and half steps defines the major scale sound. Any major scale follows this exact pattern starting from its root note.",
  },
  {
    title: "Natural Minor Scale Formula",
    content: "W H W W H W W\n\nThe natural minor is the relative minor of a major scale — it uses the same notes but starts on the 6th degree. This gives it a darker, more melancholic character.",
  },
  {
    title: "The Modes",
    content: "The 7 modes are built on each degree of the major scale:\n\n1. Ionian (= Major)\n2. Dorian (minor with ♮6)\n3. Phrygian (minor with ♭2)\n4. Lydian (major with ♯4)\n5. Mixolydian (major with ♭7)\n6. Aeolian (= Natural Minor)\n7. Locrian (diminished with ♭2)",
  },
  {
    title: "Diatonic Chord Qualities",
    content: "In a major key, the 7 diatonic chords are:\n\nI  = Major\nii = Minor\niii = Minor\nIV = Major\nV  = Major (or Dom7)\nvi = Minor\nvii° = Diminished\n\nIn a natural minor key:\ni = Minor, ii° = Dim, III = Major, iv = Minor, v = Minor, VI = Major, VII = Major",
  },
  {
    title: "Functional Harmony",
    content: "Chords have harmonic functions:\n\nTonic (T): I, iii, vi — stable, at rest\nSubdominant (S): ii, IV — mild tension, departure\nDominant (D): V, vii° — strong tension, wants to resolve\n\nThe most fundamental progression: T → S → D → T",
  },
  {
    title: "Secondary Dominants",
    content: "Any chord can be temporarily 'tonicized' by preceding it with its own dominant 7th chord.\n\nV/V (the dominant of the dominant) — very common in pop and classical music.\n\nExample in C major: D7 → G (V/V → V)",
  },
  {
    title: "Parallel vs. Relative",
    content: "Parallel keys share the same root note:\nC major and C minor are parallel keys.\n\nRelative keys share the same key signature:\nC major and A minor are relative keys (both have no sharps or flats).\n\nBorrowing chords from a parallel key adds color and contrast.",
  },
];

export default function ReferenceScreen() {
  const insets = useSafeAreaInsets();
  const [activeSection, setActiveSection] = useState<Section>("intervals");
  const colors = Colors.light;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 100 : insets.bottom + 90;

  const SECTIONS: { key: Section; label: string; icon: string }[] = [
    { key: "intervals", label: "Intervals", icon: "bar-chart-2" },
    { key: "chords", label: "Chords", icon: "layers" },
    { key: "scales", label: "Scales", icon: "book" },
    { key: "terminology", label: "Terms", icon: "type" },
  ];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={styles.headerTitle}>Music Theory</Text>
        <Text style={styles.headerSubtitle}>Reference Guide</Text>
      </View>

      <View style={styles.navBar}>
        {SECTIONS.map((s) => (
          <Pressable
            key={s.key}
            onPress={() => setActiveSection(s.key)}
            style={[styles.navBtn, activeSection === s.key && { backgroundColor: colors.tint }]}
          >
            <Feather name={s.icon as any} size={14} color={activeSection === s.key ? "#fff" : colors.textSecondary} />
            <Text style={[styles.navText, activeSection === s.key && { color: "#fff" }]}>{s.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPad, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {activeSection === "intervals" && (
          <>
            <Text style={styles.sectionIntro}>
              An interval is the distance between two notes measured in semitones. Understanding intervals is fundamental to all music theory.
            </Text>
            <View style={styles.tableCard}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, styles.tableCellHeader, { flex: 0.7 }]}>st</Text>
                <Text style={[styles.tableCell, styles.tableCellHeader, { flex: 2 }]}>Interval</Text>
                <Text style={[styles.tableCell, styles.tableCellHeader, { flex: 0.7 }]}>Abbr</Text>
                <Text style={[styles.tableCell, styles.tableCellHeader, { flex: 1.2 }]}>Type</Text>
              </View>
              {INTERVALS.map((int, i) => (
                <View key={i} style={[styles.tableRow, i % 2 === 1 && { backgroundColor: colors.backgroundSecondary }]}>
                  <Text style={[styles.tableCell, { flex: 0.7, color: colors.tint, fontFamily: "Inter_700Bold" }]}>{int.semitones}</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{int.name}</Text>
                  <Text style={[styles.tableCell, { flex: 0.7, fontFamily: "Inter_600SemiBold" }]}>{int.abbr}</Text>
                  <Text style={[styles.tableCell, { flex: 1.2, color: getConsonanceColor(int.consonance) }]}>{int.consonance}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {activeSection === "chords" && (
          <>
            <Text style={styles.sectionIntro}>
              Chords are built by stacking intervals. The formula tells you which scale degrees to use relative to the root.
            </Text>
            {CHORD_FORMULAS.map((c, i) => (
              <View key={i} style={styles.chordRow}>
                <View style={styles.chordRowLeft}>
                  <Text style={styles.chordRowName}>{c.name}</Text>
                  <Text style={styles.chordRowSymbol}>{c.symbol || "—"}</Text>
                </View>
                <View style={styles.chordRowRight}>
                  <Text style={styles.chordRowFormula}>{c.formula}</Text>
                  <Text style={styles.chordRowSt}>Semitones: {c.semitones}</Text>
                  <Text style={styles.chordRowSound}>{c.sound}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {activeSection === "scales" && (
          <>
            <Text style={styles.sectionIntro}>
              Key scale theory concepts every musician should know. Understanding these principles unlocks composition and improvisation.
            </Text>
            {SCALE_THEORY_SECTIONS.map((s, i) => (
              <View key={i} style={styles.theoryCard}>
                <Text style={styles.theoryTitle}>{s.title}</Text>
                <Text style={styles.theoryContent}>{s.content}</Text>
              </View>
            ))}
          </>
        )}

        {activeSection === "terminology" && (
          <>
            <Text style={styles.sectionIntro}>
              Essential music theory vocabulary. These terms appear throughout study, composition, and performance.
            </Text>
            {TERMINOLOGY.map((t, i) => (
              <View key={i} style={styles.termRow}>
                <Text style={styles.term}>{t.term}</Text>
                <Text style={styles.termDef}>{t.def}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function getConsonanceColor(type: string): string {
  if (type === "Perfect") return Colors.light.chord.major;
  if (type === "Consonant") return Colors.light.chord.dominant;
  if (type.includes("Dissonant")) return Colors.light.chord.diminished;
  return Colors.light.textSecondary;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
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
  navBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  navText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  sectionIntro: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 21,
    marginBottom: 16,
  },
  tableCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 14,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  tableCell: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.light.text,
  },
  tableCellHeader: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  chordRow: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: "row",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  chordRowLeft: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  chordRowName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.light.text,
    textAlign: "center",
  },
  chordRowSymbol: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: Colors.light.tint,
    textAlign: "center",
  },
  chordRowRight: {
    flex: 1,
    justifyContent: "center",
    gap: 3,
  },
  chordRowFormula: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.light.text,
  },
  chordRowSt: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  chordRowSound: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.light.tint,
    fontStyle: "italic",
  },
  theoryCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  theoryTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 8,
  },
  theoryContent: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  termRow: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingVertical: 12,
  },
  term: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: Colors.light.tint,
    marginBottom: 4,
  },
  termDef: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 19,
  },
});
