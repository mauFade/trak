import { Input } from "@/components/ui/input";
import { StyledText } from "@/components/ui/text";
import { useAuth } from "@/context/auth-provider";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    setIsLoading(true);

    try {
      await signIn("test", { id: "1", name: "User", email });

      Alert.alert("Sucesso", "Login realizado com sucesso!");
    } catch (error) {
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Erro desconhecido",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-zinc-950"
    >
      <View className="flex-1 justify-center px-6">
        <View className="mb-10">
          <StyledText className="text-3xl font-bold text-zinc-50 mb-2">
            Bem-vindo
          </StyledText>
          <StyledText className="text-zinc-400 text-base">
            Faça login para continuar
          </StyledText>
        </View>

        <View className="gap-4">
          <View
            className={cn(
              "flex-row items-center h-14 bg-zinc-900 rounded-xl px-4 border",
              emailFocused ? "border-emerald-500" : "border-zinc-800",
            )}
          >
            <Mail color={emailFocused ? "#10b981" : "#a1a1aa"} size={20} />
            <Input
              className="flex-1 ml-3 text-zinc-50 text-base"
              placeholder="Seu e-mail"
              placeholderTextColor="#a1a1aa"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>

          <View
            className={cn(
              "flex-row items-center h-14 bg-zinc-900 rounded-xl px-4 border",
              passwordFocused ? "border-emerald-500" : "border-zinc-800",
            )}
          >
            <Lock color={passwordFocused ? "#10b981" : "#a1a1aa"} size={20} />
            <Input
              className="flex-1 ml-3 text-zinc-50 text-base"
              placeholder="Sua senha"
              placeholderTextColor="#a1a1aa"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff color="#a1a1aa" size={20} />
              ) : (
                <Eye color="#a1a1aa" size={20} />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className={cn(
              "h-14 rounded-xl flex-row items-center justify-center mt-4",
              isLoading
                ? "bg-emerald-500/70"
                : "bg-emerald-500 active:bg-emerald-600",
            )}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-zinc-50 font-semibold text-lg">Enter</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
