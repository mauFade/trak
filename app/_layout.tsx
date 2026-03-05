import { ToastProvider } from "@/components/ui/toast";
import AuthProvider, { useAuth } from "@/context/auth-provider";
import { ThemeProvider, useTheme } from "@/context/theme-provider";
import { NAV_THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { PortalHost } from "@rn-primitives/portal";
import { Stack, useRouter, useSegments } from "expo-router";
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
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const { colorScheme, isDarkColorScheme } = useTheme();
  const { setColorScheme } = useNativewindColorScheme();

  useEffect(() => {
    setColorScheme(colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments.length > 0 && segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(app)/dashboard");
    }
  }, [user, isLoading, segments]);

  return (
    <View
      className={cn(
        "flex-1 px-2 bg-background",
        isDarkColorScheme ? "dark" : "",
      )}
      style={{
        paddingTop: insets.top,
      }}
    >
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
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
      <AuthProvider>
        <SafeAreaProvider>
          <ThemeProvider>
            <ToastProvider>
              <RootNavigator />
              <PortalHost />
            </ToastProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
