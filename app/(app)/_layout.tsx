import ThemeToggleButton from "@/components/shared/theme-toggle";
import { StyledText } from "@/components/ui/text";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function AppLayout() {
  return (
    <View className="flex-1">
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
        }}
      />
    </View>
  );
}
