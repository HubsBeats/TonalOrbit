import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, G, Line, Path, Text as SvgText } from "react-native-svg";
import Colors from "@/constants/colors";
import { CIRCLE_OF_FIFTHS } from "@/lib/musicTheory";

interface CircleOfFifthsProps {
  activeKey: string;
  onSelectKey: (key: string) => void;
}

const SIZE = 300;
const CENTER = SIZE / 2;
const OUTER_R = 130;
const INNER_R = 85;
const MINOR_R = 55;

function polarToXY(angleDeg: number, r: number, cx: number, cy: number) {
  const angle = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToXY(startAngle, r, cx, cy);
  const end = polarToXY(endAngle, r, cx, cy);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export function CircleOfFifths({ activeKey, onSelectKey }: CircleOfFifthsProps) {
  const colors = Colors.light;
  const sliceAngle = 360 / 12;

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {CIRCLE_OF_FIFTHS.map((item, i) => {
          const startAngle = i * sliceAngle - sliceAngle / 2;
          const endAngle = startAngle + sliceAngle;
          const midAngle = i * sliceAngle;

          const isActive = item.major === activeKey || item.minor === activeKey;
          const outerPos = polarToXY(midAngle, (OUTER_R + INNER_R) / 2, CENTER, CENTER);
          const innerPos = polarToXY(midAngle, (INNER_R + MINOR_R) / 2, CENTER, CENTER);
          const minorPos = polarToXY(midAngle, MINOR_R / 2 + 12, CENTER, CENTER);

          const outerFill = isActive ? colors.tint : colors.backgroundSecondary;
          const innerFill = isActive ? colors.tintLight + "99" : colors.border + "88";
          const minorFill = isActive ? colors.tintDark + "55" : "#E8E4F5" + "88";

          const outerD = [
            `M ${polarToXY(startAngle, INNER_R, CENTER, CENTER).x} ${polarToXY(startAngle, INNER_R, CENTER, CENTER).y}`,
            `L ${polarToXY(startAngle, OUTER_R, CENTER, CENTER).x} ${polarToXY(startAngle, OUTER_R, CENTER, CENTER).y}`,
            describeArc(CENTER, CENTER, OUTER_R, startAngle, endAngle),
            `L ${polarToXY(endAngle, INNER_R, CENTER, CENTER).x} ${polarToXY(endAngle, INNER_R, CENTER, CENTER).y}`,
            describeArc(CENTER, CENTER, INNER_R, endAngle, startAngle),
            "Z",
          ].join(" ");

          const innerD = [
            `M ${polarToXY(startAngle, MINOR_R, CENTER, CENTER).x} ${polarToXY(startAngle, MINOR_R, CENTER, CENTER).y}`,
            `L ${polarToXY(startAngle, INNER_R, CENTER, CENTER).x} ${polarToXY(startAngle, INNER_R, CENTER, CENTER).y}`,
            describeArc(CENTER, CENTER, INNER_R, startAngle, endAngle),
            `L ${polarToXY(endAngle, MINOR_R, CENTER, CENTER).x} ${polarToXY(endAngle, MINOR_R, CENTER, CENTER).y}`,
            describeArc(CENTER, CENTER, MINOR_R, endAngle, startAngle),
            "Z",
          ].join(" ");

          const sharpsFlats = item.sharpsFlats;
          const sfText =
            sharpsFlats > 0
              ? `${sharpsFlats}♯`
              : sharpsFlats < 0
              ? `${Math.abs(sharpsFlats)}♭`
              : "0";

          return (
            <G key={item.key}>
              <Path
                d={outerD}
                fill={outerFill}
                stroke={colors.surface}
                strokeWidth={1.5}
                onPress={() => onSelectKey(item.major)}
              />
              <Path
                d={innerD}
                fill={innerFill}
                stroke={colors.surface}
                strokeWidth={1}
                onPress={() => onSelectKey(item.major)}
              />
              <SvgText
                x={outerPos.x}
                y={outerPos.y + 1}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize={isActive ? 14 : 13}
                fontWeight={isActive ? "bold" : "600"}
                fill={isActive ? "#fff" : colors.text}
              >
                {item.major}
              </SvgText>
              <SvgText
                x={innerPos.x}
                y={innerPos.y}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize={10}
                fill={isActive ? colors.tintDark : colors.textSecondary}
              >
                {item.minor}
              </SvgText>
            </G>
          );
        })}

        <Circle cx={CENTER} cy={CENTER} r={MINOR_R} fill={colors.backgroundSecondary} stroke={colors.border} strokeWidth={1} />
        <SvgText
          x={CENTER}
          y={CENTER - 10}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={12}
          fontWeight="bold"
          fill={colors.tint}
        >
          Circle
        </SvgText>
        <SvgText
          x={CENTER}
          y={CENTER + 6}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={11}
          fill={colors.textSecondary}
        >
          of 5ths
        </SvgText>

        <Line x1={CENTER} y1={CENTER - MINOR_R + 2} x2={CENTER} y2={CENTER - OUTER_R - 2} stroke={colors.border} strokeWidth={0.5} strokeDasharray="3,3" />
      </Svg>

      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={[styles.legendBox, { backgroundColor: colors.tint }]} />
          <Text style={styles.legendText}>Major keys (outer ring)</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendBox, { backgroundColor: colors.tintLight + "99" }]} />
          <Text style={styles.legendText}>Relative minor (inner ring)</Text>
        </View>
      </View>

      <View style={styles.sfInfo}>
        <Text style={styles.sfTitle}>Key Signatures</Text>
        <View style={styles.sfGrid}>
          {CIRCLE_OF_FIFTHS.filter((k) => k.sharpsFlats >= 0).map((k) => (
            <TouchableOpacity key={k.key} onPress={() => onSelectKey(k.major)} style={[
              styles.sfChip,
              activeKey === k.major && { backgroundColor: colors.tint },
            ]}>
              <Text style={[styles.sfKey, activeKey === k.major && { color: "#fff" }]}>{k.major}</Text>
              <Text style={[styles.sfVal, activeKey === k.major && { color: "#fff" }]}>
                {k.sharpsFlats === 0 ? "♮" : `${k.sharpsFlats}♯`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={[styles.sfGrid, { marginTop: 6 }]}>
          {CIRCLE_OF_FIFTHS.filter((k) => k.sharpsFlats < 0).map((k) => (
            <TouchableOpacity key={k.key} onPress={() => onSelectKey(k.major)} style={[
              styles.sfChip,
              activeKey === k.major && { backgroundColor: colors.tint },
            ]}>
              <Text style={[styles.sfKey, activeKey === k.major && { color: "#fff" }]}>{k.major}</Text>
              <Text style={[styles.sfVal, activeKey === k.major && { color: "#fff" }]}>
                {`${Math.abs(k.sharpsFlats)}♭`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  legend: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  sfInfo: {
    marginTop: 16,
    width: "100%",
    paddingHorizontal: 4,
  },
  sfTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  sfGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  sfChip: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  sfKey: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.light.text,
  },
  sfVal: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
});
