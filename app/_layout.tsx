import ThemeToggleButton from "@/components/shared/theme-toggle";
import { StyledText } from "@/components/ui/text";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider, useTheme } from "@/context/theme-provider";
import { NAV_THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import "./globals.css";

function RootNavigator() {
  const { colorScheme, isDarkColorScheme } = useTheme();
  const { setColorScheme } = useNativewindColorScheme();
  const insets = useSafeAreaInsets();
  // Sync NativeWind color scheme with our theme
  useEffect(() => {
    setColorScheme(colorScheme);
  }, [colorScheme]);

  return (
    <View
      className={cn("flex-1 px-2 bg-background", isDarkColorScheme ? "dark" : "")}
      style={{
        paddingTop: insets.top,
      }}
    >
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <View className="pt-4 mb-2 flex flex-row justify-between">
        <View>
          <StyledText className="text-2xl font-bold text-foreground">
            Welcome!
          </StyledText>
          <StyledText className="mt-1 text-sm text-muted-foreground">
            Check your finances
          </StyledText>
        </View>

        <ThemeToggleButton />
      </View>
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
    </View>
  );
}
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <RootNavigator />
            <PortalHost />
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
