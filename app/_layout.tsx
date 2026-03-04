import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "./globals.css";

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ paddingTop: insets.top }}
      className="px-2 flex-1 bg-background"
    >
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <PortalHost />
    </View>
  );
}
