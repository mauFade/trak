import ThemeToggleButton from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { StyledText } from "@/components/ui/text";
import { useAuth } from "@/context/auth-provider";
import { ArrowRight, BadgeDollarSign, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, View } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        "Missing information",
        "Please enter your email and password.",
      );
      return;
    }

    setIsLoading(true);

    try {
      await signIn("test", {
        id: "1",
        name: email || "User",
        email: email || "user@example.com",
      });

      Alert.alert("Success", "Login successful!");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Unknown error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View className="flex-1 bg-background px-6 pb-8">
        {/* Top bar with theme toggle */}
        <View className="items-end pt-4">
          <ThemeToggleButton />
        </View>

        {/* Main content */}
        <View className="flex-1 items-center justify-center">
          {/* Logo */}
          <View className="mb-8 items-center">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full border-2 border-primary/80 bg-primary/10">
              <Icon as={BadgeDollarSign} className="text-primary" size={32} />
            </View>

            <StyledText variant="h3" className="text-foreground text-center">
              Welcome to Trak
            </StyledText>
            <StyledText
              variant="muted"
              className="mt-1 text-center px-6 text-muted-foreground"
            >
              Track your finances, simply and beautifully.
            </StyledText>

            {/* accent underline */}
            <View className="mt-3 h-1 w-16 rounded-full bg-accent/80" />
          </View>

          {/* Form */}
          <View className="w-full gap-5">
            <View className="gap-2">
              <StyledText variant="small" className="text-muted-foreground">
                Email
              </StyledText>
              <View className="flex-row items-center gap-2 rounded-full border border-input bg-muted/40 px-4 py-3 shadow-sm shadow-black/5">
                <Icon as={Mail} className="text-muted-foreground" size={18} />
                <Input
                  className="flex-1 border-0 p-2 h-9"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                  editable={!isLoading}
                />
              </View>
            </View>

            <View className="gap-2">
              <StyledText variant="small" className="text-muted-foreground">
                Password
              </StyledText>
              <View className="flex-row items-center gap-2 rounded-full border border-input bg-muted/40 px-4 py-3 shadow-sm shadow-black/5">
                <Icon as={Lock} className="text-muted-foreground" size={18} />
                <Input
                  className="flex-1 border-0 p-2 h-9"
                  placeholder="Create password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Bottom actions */}
        <View className="gap-4">
          <Button
            className="w-full h-10 rounded-full mt-2"
            disabled={isLoading}
            onPress={handleLogin}
          >
            <StyledText className="text-white font-semibold">
              {isLoading ? "Signing in..." : "Login"}
            </StyledText>
            <Icon as={ArrowRight} className="text-white ml-2" size={18} />
          </Button>

          <StyledText variant="muted" className="text-center mt-1">
            Don&apos;t have an account?{" "}
            <StyledText variant="muted" className="font-semibold text-accent">
              Sign up
            </StyledText>
          </StyledText>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
