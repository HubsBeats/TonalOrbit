import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";
import { ScaleData } from "@/lib/musicTheory";

interface StepSequencerProps {
  scaleData: ScaleData;
}

export function StepSequencer({ scaleData }: StepSequencerProps) {
  const colors = Colors.light;
  const { notes, scaleInfo } = scaleData;
  const intervals = scaleInfo.intervals;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {notes.map((note, i) => {
          const step = intervals[i];
          const isHalf = step === 1;
          const stepLabel = step === 1 ? "H" : step === 2 ? "W" : step === 3 ? "W+H" : `${step}`;

          return (
            <View key={i} style={styles.noteGroup}>
              <View style={[styles.noteBox, { backgroundColor: i === 0 ? colors.noteRoot : colors.note }]}>
                <Text style={styles.noteText}>{note}</Text>
              </View>
              {i < notes.length - 1 && intervals[i] !== undefined && (
                <View style={styles.stepContainer}>
                  <View style={[styles.stepLine, { backgroundColor: isHalf ? colors.stepHalf : colors.stepWhole }]} />
                  <View style={[styles.stepBadge, { backgroundColor: isHalf ? colors.stepHalf : colors.stepWhole }]}>
                    <Text style={styles.stepText}>{stepLabel}</Text>
                  </View>
                  <View style={[styles.stepLine, { backgroundColor: isHalf ? colors.stepHalf : colors.stepWhole }]} />
                </View>
              )}
            </View>
          );
        })}
        {notes.length > 0 && (
          <View style={[styles.noteBox, { backgroundColor: colors.note + "88" }]}>
            <Text style={styles.noteText}>{notes[0]}</Text>
          </View>
        )}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.stepWhole }]} />
          <Text style={styles.legendText}>W = Whole Step (2 semitones)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.stepHalf }]} />
          <Text style={styles.legendText}>H = Half Step (1 semitone)</Text>
        </View>
        {scaleInfo.intervals.includes(3) && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.note }]} />
            <Text style={styles.legendText}>W+H = Augmented 2nd (3 semitones)</Text>
          </View>
        )}
      </View>

      <View style={styles.semitonesRow}>
        <Text style={styles.semitonesLabel}>Semitone intervals: </Text>
        <Text style={styles.semitonesValue}>
          {scaleInfo.intervals.slice(0, notes.length - 1).join(" – ")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 0,
  },
  noteGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  noteBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  noteText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 12,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  stepLine: {
    height: 2,
    width: 6,
    borderRadius: 1,
  },
  stepBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    marginHorizontal: 1,
  },
  stepText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 9,
  },
  legend: {
    marginTop: 16,
    gap: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  semitonesRow: {
    flexDirection: "row",
    marginTop: 12,
    flexWrap: "wrap",
  },
  semitonesLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  semitonesValue: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.light.tint,
  },
});
