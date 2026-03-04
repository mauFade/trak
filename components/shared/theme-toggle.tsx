import { useTheme } from "@/context/theme-provider";
import * as Haptics from "expo-haptics";
import { Moon, Sun } from "lucide-react-native";
import { Pressable, View } from "react-native";

export default function ThemeToggleButton() {
  const { setTheme, isDarkColorScheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = isDarkColorScheme ? "light" : "dark";
    setTheme(newTheme);
  };

  const handlePressIn = () => {
    Haptics.selectionAsync().catch(() => {});
  };

  // Cores dos ícones baseadas no tema
  const iconColor = isDarkColorScheme ? "#ffffff" : "#000000";

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPress={toggleTheme}
      className="active:opacity-70"
    >
      <View className="size-10 rounded-md border border-border bg-card items-center justify-center">
        {isDarkColorScheme ? (
          <Moon color={iconColor} size={20} strokeWidth={2} />
        ) : (
          <Sun color={iconColor} size={20} strokeWidth={2} />
        )}
      </View>
    </Pressable>
  );
}
