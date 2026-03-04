import { Card } from "@/components/ui/card";
import { StyledText } from "@/components/ui/text";
import { ScrollView, View } from "react-native";

export default function Index() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
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
