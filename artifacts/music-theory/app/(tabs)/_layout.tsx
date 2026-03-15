import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "music.note.list", selected: "music.note.list" }} />
        <Label>Scale</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="chords">
        <Icon sf={{ default: "guitars", selected: "guitars.fill" }} />
        <Label>Chords</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="circle">
        <Icon sf={{ default: "circle.hexagongrid", selected: "circle.hexagongrid.fill" }} />
        <Label>Circle</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="reference">
        <Icon sf={{ default: "books.vertical", selected: "books.vertical.fill" }} />
        <Label>Theory</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";
  const safeAreaInsets = useSafeAreaInsets();
  const colors = Colors.light;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : isDark ? "#0D0D1A" : colors.surface,
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: colors.border,
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={90}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.surface }]} />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Scale",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="music.note.list" tintColor={color} size={22} />
            ) : (
              <Feather name="music" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="chords"
        options={{
          title: "Chords",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="guitars" tintColor={color} size={22} />
            ) : (
              <Feather name="layers" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="circle"
        options={{
          title: "Circle",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="circle.hexagongrid" tintColor={color} size={22} />
            ) : (
              <Feather name="disc" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="reference"
        options={{
          title: "Theory",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="books.vertical" tintColor={color} size={22} />
            ) : (
              <Feather name="book-open" size={22} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
