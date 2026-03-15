import React, { useCallback, useState } from "react";
import {
  FlatList,
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
import { NoteChip } from "@/components/NoteChip";
import { StepSequencer } from "@/components/StepSequencer";
import { SCALE_CATEGORIES, SCALE_DEFINITIONS, ScaleName, ALL_KEYS } from "@/lib/musicTheory";

const DISPLAY_KEYS = ["C", "G", "D", "A", "E", "B", "F#", "Gb", "Db", "Ab", "Eb", "Bb", "F"];

export default function ScaleScreen() {
  const { selectedKey, selectedScale, scaleData, setKey, setScale } = useMusicContext();
  const insets = useSafeAreaInsets();
  const colors = Colors.light;
  const [showScalePicker, setShowScalePicker] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 100 : insets.bottom + 90;

  const scaleNames = Object.keys(SCALE_DEFINITIONS) as ScaleName[];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View>
          <Text style={styles.headerTitle}>Music Theory</Text>
          <Text style={styles.headerSubtitle}>Visual Scale Explorer</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SELECT KEY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.keyRow}>
            {DISPLAY_KEYS.map((key) => (
              <Pressable
                key={key}
                onPress={() => setKey(key)}
                style={({ pressed }) => [
                  styles.keyBtn,
                  selectedKey === key && { backgroundColor: colors.tint },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={[styles.keyBtnText, selectedKey === key && { color: "#fff" }]}>{key}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SELECT SCALE</Text>
          <Pressable
            onPress={() => setShowScalePicker(!showScalePicker)}
            style={styles.scalePicker}
          >
            <View>
              <Text style={styles.scalePickerKey}>{selectedKey} {selectedScale}</Text>
              <Text style={styles.scalePickerDesc}>{scaleData.scaleInfo.description}</Text>
            </View>
            <Feather name={showScalePicker ? "chevron-up" : "chevron-down"} size={20} color={colors.tint} />
          </Pressable>

          {showScalePicker && (
            <View style={styles.scaleDropdown}>
              {Object.entries(SCALE_CATEGORIES).map(([category, scales]) => (
                <View key={category}>
                  <Text style={styles.categoryLabel}>{category}</Text>
                  <View style={styles.scaleGrid}>
                    {scales.map((scale) => (
                      <Pressable
                        key={scale}
                        onPress={() => { setScale(scale); setShowScalePicker(false); }}
                        style={[
                          styles.scaleChip,
                          selectedScale === scale && { backgroundColor: colors.tint },
                        ]}
                      >
                        <Text style={[styles.scaleChipText, selectedScale === scale && { color: "#fff" }]}>{scale}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={[styles.scaleHighlight, { backgroundColor: colors.tint }]}>
          <Text style={styles.highlightKey}>{selectedKey}</Text>
          <Text style={styles.highlightScale}>{selectedScale}</Text>
          <View style={styles.moodRow}>
            {scaleData.scaleInfo.moods.map((mood) => (
              <View key={mood} style={styles.moodTag}>
                <Text style={styles.moodText}>{mood}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>NOTES IN SCALE</Text>
          <View style={styles.card}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.notesRow}>
                {scaleData.notes.map((note, i) => (
                  <View key={i} style={styles.noteWithDegree}>
                    <NoteChip note={note} isRoot={i === 0} size="lg" />
                    <Text style={styles.degreeNum}>{i + 1}</Text>
                    <Text style={styles.degreeName}>{getDegreeLabel(i, scaleData.scale)}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {(scaleData.relativeMinor || scaleData.relativeMajor) && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>RELATIVE KEYS</Text>
            <View style={styles.relativeRow}>
              {scaleData.relativeMinor && (
                <Pressable
                  style={styles.relativeCard}
                  onPress={() => { setKey(scaleData.relativeMinor!); setScale("Natural Minor"); }}
                >
                  <Text style={styles.relativeLabel}>Relative Minor</Text>
                  <Text style={styles.relativeKey}>{scaleData.relativeMinor}m</Text>
                  <Feather name="arrow-right" size={16} color={colors.tint} />
                </Pressable>
              )}
              {scaleData.relativeMajor && (
                <Pressable
                  style={styles.relativeCard}
                  onPress={() => { setKey(scaleData.relativeMajor!); setScale("Major"); }}
                >
                  <Text style={styles.relativeLabel}>Relative Major</Text>
                  <Text style={styles.relativeKey}>{scaleData.relativeMajor}</Text>
                  <Feather name="arrow-right" size={16} color={colors.tint} />
                </Pressable>
              )}
              {scaleData.parallelMinor && (
                <Pressable
                  style={[styles.relativeCard, { borderColor: Colors.light.chord.minor }]}
                  onPress={() => { setScale("Natural Minor"); }}
                >
                  <Text style={styles.relativeLabel}>Parallel Minor</Text>
                  <Text style={[styles.relativeKey, { color: Colors.light.chord.minor }]}>{scaleData.parallelMinor}m</Text>
                  <Feather name="arrow-right" size={16} color={Colors.light.chord.minor} />
                </Pressable>
              )}
              {scaleData.parallelMajor && (
                <Pressable
                  style={[styles.relativeCard, { borderColor: Colors.light.chord.major }]}
                  onPress={() => { setScale("Major"); }}
                >
                  <Text style={styles.relativeLabel}>Parallel Major</Text>
                  <Text style={[styles.relativeKey, { color: Colors.light.chord.major }]}>{scaleData.parallelMajor}</Text>
                  <Feather name="arrow-right" size={16} color={Colors.light.chord.major} />
                </Pressable>
              )}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>STEP SEQUENCER</Text>
          <View style={styles.card}>
            <StepSequencer scaleData={scaleData} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SCALE INFO</Text>
          <View style={styles.card}>
            <Text style={styles.infoText}>{scaleData.scaleInfo.description}</Text>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoItemLabel}>Total Notes</Text>
                <Text style={styles.infoItemVal}>{scaleData.notes.length}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoItemLabel}>Semitones</Text>
                <Text style={styles.infoItemVal}>{scaleData.scaleInfo.intervals.reduce((a, b) => a + b, 0)}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoItemLabel}>Root</Text>
                <Text style={styles.infoItemVal}>{selectedKey}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function getDegreeLabel(i: number, scale: ScaleName): string {
  const labels: Record<number, string> = {
    0: "Root",
    1: "2nd",
    2: "3rd",
    3: "4th",
    4: "5th",
    5: "6th",
    6: "7th",
  };
  return labels[i] || "";
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: Colors.light.textSecondary,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  keyRow: {
    gap: 8,
    paddingRight: 20,
  },
  keyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.light.backgroundSecondary,
    minWidth: 44,
    alignItems: "center",
  },
  keyBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.light.text,
  },
  scalePicker: {
    backgroundColor: Colors.light.surface,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  scalePickerKey: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: Colors.light.text,
  },
  scalePickerDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
    maxWidth: 260,
  },
  scaleDropdown: {
    backgroundColor: Colors.light.surface,
    borderRadius: 14,
    marginTop: 6,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  categoryLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: Colors.light.textSecondary,
    letterSpacing: 0.8,
    marginTop: 12,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  scaleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  scaleChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  scaleChipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.light.text,
  },
  scaleHighlight: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  highlightKey: {
    fontFamily: "Inter_700Bold",
    fontSize: 48,
    color: "#fff",
    lineHeight: 56,
  },
  highlightScale: {
    fontFamily: "Inter_500Medium",
    fontSize: 18,
    color: "rgba(255,255,255,0.85)",
    marginBottom: 12,
  },
  moodRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  moodTag: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  moodText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: "#fff",
  },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  notesRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  noteWithDegree: {
    alignItems: "center",
    gap: 4,
  },
  degreeNum: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: Colors.light.tint,
  },
  degreeName: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
  relativeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  relativeCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: Colors.light.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.light.tint,
    gap: 4,
  },
  relativeLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  relativeKey: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: Colors.light.tint,
  },
  infoText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: "row",
    gap: 16,
  },
  infoItem: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  infoItemLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  infoItemVal: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: Colors.light.text,
    marginTop: 2,
  },
});
