import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

export default function Index() {
  return (
    <View>
      <View className="grid grid-cols-2 gap-4">
        <Card>
          <Text>Card content</Text>
        </Card>
        <Card>
          <Text>Card content</Text>
        </Card>
        <Card>
          <Text>Card content</Text>
        </Card>
        <Card>
          <Text>Card content</Text>
        </Card>
      </View>
    </View>
  );
}
