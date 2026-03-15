import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";
import { Chord, ChordQuality } from "@/lib/musicTheory";

interface ChordCardProps {
  chord: Chord;
  compact?: boolean;
}

function getChordColor(quality: ChordQuality): string {
  const c = Colors.light.chord;
  switch (quality) {
    case "maj":
    case "maj7":
      return c.major;
    case "min":
    case "min7":
      return c.minor;
    case "dim":
    case "dim7":
    case "min7b5":
      return c.diminished;
    case "aug":
      return c.augmented;
    case "7":
      return c.dominant;
    default:
      return c.major;
  }
}

function getQualityLabel(quality: ChordQuality): string {
  switch (quality) {
    case "maj": return "Major";
    case "min": return "Minor";
    case "dim": return "Dim";
    case "aug": return "Aug";
    case "maj7": return "Maj7";
    case "min7": return "Min7";
    case "7": return "Dom7";
    case "min7b5": return "ø7";
    case "dim7": return "°7";
    default: return "";
  }
}

export function ChordCard({ chord, compact = false }: ChordCardProps) {
  const color = getChordColor(chord.quality);

  if (compact) {
    return (
      <View style={[styles.compact, { borderLeftColor: color }]}>
        <View style={styles.compactHeader}>
          <Text style={[styles.compactNumeral, { color }]}>{chord.romanNumeral}</Text>
          <Text style={styles.compactName}>{chord.name}</Text>
        </View>
        <View style={styles.notesRow}>
          {chord.notes.map((n, i) => (
            <View key={i} style={[styles.noteTag, { backgroundColor: color + "22" }]}>
              <Text style={[styles.noteTagText, { color }]}>{n}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, { borderTopColor: color, borderTopWidth: 3 }]}>
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>{chord.romanNumeral}</Text>
      </View>
      <Text style={styles.chordName}>{chord.name}</Text>
      <Text style={styles.qualityLabel}>{getQualityLabel(chord.quality)}</Text>
      <View style={styles.notesContainer}>
        {chord.notes.map((note, i) => (
          <View key={i} style={[styles.noteCircle, { backgroundColor: color }]}>
            <Text style={styles.noteCircleText}>{note}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.degreeText}>Degree {chord.degree}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    width: 120,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginRight: 12,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  badgeText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 12,
  },
  chordName: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: Colors.light.text,
    textAlign: "center",
  },
  qualityLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  notesContainer: {
    flexDirection: "row",
    gap: 4,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  noteCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  noteCircleText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
  },
  degreeText: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginTop: 8,
  },
  compact: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  compactHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  compactNumeral: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    width: 36,
  },
  compactName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.light.text,
  },
  notesRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
    paddingLeft: 44,
  },
  noteTag: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  noteTagText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },
});
