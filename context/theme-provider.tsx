import { THEME } from "@/lib/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SystemUI from "expo-system-ui";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform, useColorScheme } from "react-native";

type Theme = "light" | "dark" | "system";
type ColorScheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorScheme;
  setTheme: (theme: Theme) => void;
  isLoading: boolean;
  isDarkColorScheme: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@app-theme-preference";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>("system");
  const [isLoading, setIsLoading] = useState(true);

  // Determine the actual color scheme to use
  const colorScheme: ColorScheme =
    theme === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : theme;

  const isDarkColorScheme = colorScheme === "dark";

  // Update Android navigation bar and root background when theme changes
  useEffect(() => {
    // With edge-to-edge, the area behind the nav bar uses the root view background
    if (Platform.OS === "android") {
      const bg =
        colorScheme === "dark" ? THEME.dark.background : THEME.light.background;
      SystemUI.setBackgroundColorAsync(bg).catch(() => {});
    }
  }, [colorScheme]);

  // Load theme preference from AsyncStorage on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

      if (!savedTheme) {
        setThemeState("system");
      } else if (
        savedTheme === "light" ||
        savedTheme === "dark" ||
        savedTheme === "system"
      ) {
        setThemeState(savedTheme);
      }
    } catch (error) {
      console.error("Failed to load theme preference:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme, colorScheme, setTheme, isLoading, isDarkColorScheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
