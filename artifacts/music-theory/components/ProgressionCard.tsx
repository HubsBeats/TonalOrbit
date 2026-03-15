import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";
import { Chord } from "@/lib/musicTheory";

interface ProgressionCardProps {
  name: string;
  degrees: number[];
  numerals: string[];
  chords: Chord[];
}

export function ProgressionCard({ name, degrees, numerals, chords }: ProgressionCardProps) {
  const colors = Colors.light;

  const getChordForDegree = (degree: number) => {
    return chords.find((c) => c.degree === degree);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.progression}>
        {numerals.map((numeral, i) => {
          const chord = getChordForDegree(degrees[i]);
          return (
            <View key={i} style={styles.step}>
              <View style={[styles.numeralBadge, { backgroundColor: colors.tint + "22" }]}>
                <Text style={[styles.numeral, { color: colors.tint }]}>{numeral}</Text>
              </View>
              {chord ? (
                <Text style={styles.chordName}>{chord.name}</Text>
              ) : (
                <Text style={styles.chordName}>{numeral}</Text>
              )}
              {i < numerals.length - 1 && (
                <Text style={styles.arrow}>→</Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
  name: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 10,
  },
  progression: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  numeralBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  numeral: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
  },
  chordName: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  arrow: {
    color: Colors.light.border,
    fontSize: 14,
    marginHorizontal: 2,
  },
});
