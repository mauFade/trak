import ThemeToggleButton from "@/components/shared/theme-toggle";
import { Card } from "@/components/ui/card";
import { StyledText } from "@/components/ui/text";
import { ScrollView, View } from "react-native";

export default function Dashbaord() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
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

      <View className="gap-4">
        <View className="flex-row gap-4">
          <Card className="flex-1">
            <StyledText>Card content</StyledText>
          </Card>
          <Card className="flex-1">
            <StyledText>Card content</StyledText>
          </Card>
        </View>

        <View className="flex-row gap-4">
          <Card className="flex-1">
            <StyledText>Card content</StyledText>
          </Card>
          <Card className="flex-1">
            <StyledText>Card content</StyledText>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
