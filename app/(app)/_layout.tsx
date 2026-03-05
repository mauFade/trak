import { useTheme } from "@/context/theme-provider";
import { NAV_THEME } from "@/lib/theme";
import { Stack } from "expo-router";
import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useEffect } from "react";

export default function AppLayout() {
  const { colorScheme } = useTheme();
  const { setColorScheme } = useNativewindColorScheme();

  useEffect(() => {
    setColorScheme(colorScheme);
  }, [colorScheme]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: NAV_THEME[colorScheme].colors.background,
        },
        contentStyle: {
          backgroundColor: NAV_THEME[colorScheme].colors.background,
        },
      }}
    />
  );
}
