import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";

interface NoteChipProps {
  note: string;
  isRoot?: boolean;
  size?: "sm" | "md" | "lg";
  style?: object;
}

export function NoteChip({ note, isRoot = false, size = "md", style }: NoteChipProps) {
  const colors = Colors.light;
  const sizeStyle = size === "sm" ? styles.sm : size === "lg" ? styles.lg : styles.md;
  const textStyle = size === "sm" ? styles.textSm : size === "lg" ? styles.textLg : styles.textMd;

  return (
    <View style={[
      styles.chip,
      sizeStyle,
      isRoot ? { backgroundColor: colors.noteRoot } : { backgroundColor: colors.note },
      style,
    ]}>
      <Text style={[styles.text, textStyle]}>{note}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  sm: { width: 32, height: 32 },
  md: { width: 44, height: 44 },
  lg: { width: 56, height: 56 },
  text: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
  },
  textSm: { fontSize: 11 },
  textMd: { fontSize: 14 },
  textLg: { fontSize: 18 },
});
