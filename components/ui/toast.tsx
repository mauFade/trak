import { Icon } from "@/components/ui/icon";
import { NativeOnlyAnimatedView } from "@/components/ui/native-only-animated-view";
import { StyledText } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Portal } from "@rn-primitives/portal";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  type LucideIcon,
} from "lucide-react-native";
import * as React from "react";
import { Pressable, useWindowDimensions, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TOAST_DURATION_MS = 4000;

export type ToastVariant = "default" | "success" | "destructive" | "warning";

export type ToastAction = {
  label: string;
  onPress: () => void;
};

export type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: ToastAction;
};

type ToastItem = ToastOptions & {
  id: string;
};

const variantConfig: Record<
  ToastVariant,
  { icon: LucideIcon; iconClassName: string; containerClassName: string }
> = {
  default: {
    icon: Info,
    iconClassName: "text-muted-foreground",
    containerClassName:
      "bg-card border-border shadow-xl shadow-black/20 dark:shadow-black/50",
  },
  success: {
    icon: CheckCircle2,
    iconClassName: "text-emerald-600 dark:text-emerald-400",
    containerClassName:
      "bg-card border-border border-l-4 border-l-emerald-500 dark:border-l-emerald-400 shadow-xl shadow-black/20 dark:shadow-black/50",
  },
  destructive: {
    icon: AlertCircle,
    iconClassName: "text-destructive",
    containerClassName:
      "bg-card border-border border-l-4 border-l-destructive shadow-xl shadow-black/20 dark:shadow-black/50",
  },
  warning: {
    icon: AlertCircle,
    iconClassName: "text-amber-500 dark:text-amber-400",
    containerClassName:
      "bg-card border-border border-l-4 border-l-amber-500 dark:border-l-amber-400 shadow-xl shadow-black/20 dark:shadow-black/50",
  },
};

const ToastContext = React.createContext<{
  toasts: ToastItem[];
  addToast: (options: ToastOptions) => void;
  removeToast: (id: string) => void;
  pauseToast: (id: string, remainingMs: number) => void;
  resumeToast: (id: string) => void;
} | null>(null);

function generateId() {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const timeoutsRef = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const pausedRemainingRef = React.useRef<Map<string, number>>(new Map());

  const removeToast = React.useCallback((id: string) => {
    const t = timeoutsRef.current.get(id);
    if (t) {
      clearTimeout(t);
      timeoutsRef.current.delete(id);
    }
    pausedRemainingRef.current.delete(id);
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const pauseToast = React.useCallback((id: string, remainingMs: number) => {
    const t = timeoutsRef.current.get(id);
    if (t) {
      clearTimeout(t);
      timeoutsRef.current.delete(id);
    }
    if (remainingMs > 0) {
      pausedRemainingRef.current.set(id, remainingMs);
    }
  }, []);

  const resumeToast = React.useCallback(
    (id: string) => {
      const remaining = pausedRemainingRef.current.get(id);
      pausedRemainingRef.current.delete(id);
      if (remaining != null && remaining > 0) {
        const timeout = setTimeout(() => removeToast(id), remaining);
        timeoutsRef.current.set(id, timeout);
      }
    },
    [removeToast],
  );

  const addToast = React.useCallback(
    (options: ToastOptions) => {
      const id = generateId();
      const duration = options.duration ?? TOAST_DURATION_MS;
      const item: ToastItem = { ...options, id };
      setToasts((prev) => [...prev, item]);
      if (duration > 0) {
        const timeout = setTimeout(() => removeToast(id), duration);
        timeoutsRef.current.set(id, timeout);
      }
    },
    [removeToast],
  );

  const value = React.useMemo(
    () => ({ toasts, addToast, removeToast, pauseToast, resumeToast }),
    [toasts, addToast, removeToast, pauseToast, resumeToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  );
}

function ToastViewport() {
  const { toasts, removeToast, pauseToast, resumeToast } =
    React.useContext(ToastContext)!;
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const horizontalPadding = 16;
  const maxWidth = Math.min(width - horizontalPadding * 2, 400);

  if (toasts.length === 0) return null;

  return (
    <Portal name="toast-viewport">
      <View
        className="absolute bottom-0 left-0 right-0 z-[100] px-4 pb-2"
        style={{ paddingBottom: insets.bottom + 8 }}
        pointerEvents="box-none"
      >
        {toasts.map((toast) => (
          <ToastView
            key={toast.id}
            toast={toast}
            onDismiss={() => removeToast(toast.id)}
            onPause={(remainingMs) => pauseToast(toast.id, remainingMs)}
            onResume={() => resumeToast(toast.id)}
            onAction={toast.action?.onPress}
            actionLabel={toast.action?.label}
            maxWidth={maxWidth}
          />
        ))}
      </View>
    </Portal>
  );
}

function ToastView({
  toast,
  onDismiss,
  onPause,
  onResume,
  onAction,
  actionLabel,
  maxWidth,
}: {
  toast: ToastItem;
  onDismiss: () => void;
  onPause: (remainingMs: number) => void;
  onResume: () => void;
  onAction?: () => void;
  actionLabel?: string;
  maxWidth: number;
}) {
  const config = variantConfig[toast.variant ?? "default"];
  const IconComponent = config.icon;
  const duration = toast.duration ?? TOAST_DURATION_MS;
  const progress = useSharedValue(1);
  const startTimeRef = React.useRef(Date.now());
  const phaseDurationRef = React.useRef(duration);
  const isPausedRef = React.useRef(false);
  const pausedRemainingRef = React.useRef(0);
  const didLongPressRef = React.useRef(false);

  React.useEffect(() => {
    if (duration > 0) {
      progress.value = withTiming(0, { duration });
    }
  }, [duration, progress]);

  const handleLongPress = React.useCallback(() => {
    if (duration <= 0) return;
    const elapsed = Date.now() - startTimeRef.current;
    const remainingMs = Math.max(0, phaseDurationRef.current - elapsed);
    progress.value = remainingMs / duration;
    pausedRemainingRef.current = remainingMs;
    isPausedRef.current = true;
    didLongPressRef.current = true;
    onPause(remainingMs);
  }, [duration, progress, onPause]);

  const handlePressOut = React.useCallback(() => {
    if (!isPausedRef.current) return;
    const remaining = pausedRemainingRef.current;
    if (remaining > 0) {
      progress.value = withTiming(0, { duration: remaining });
      startTimeRef.current = Date.now();
      phaseDurationRef.current = remaining;
      onResume();
    }
    isPausedRef.current = false;
  }, [progress, onResume]);

  const handlePress = React.useCallback(() => {
    if (didLongPressRef.current) {
      didLongPressRef.current = false;
      return;
    }
    onDismiss();
  }, [onDismiss]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <NativeOnlyAnimatedView
      entering={FadeInDown.duration(320)}
      exiting={FadeOutDown.duration(260)}
      className="mb-2"
    >
      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        onPressOut={handlePressOut}
        delayLongPress={200}
        className={cn(
          "flex-col overflow-hidden rounded-xl border py-3 pl-3 pr-4",
          config.containerClassName,
        )}
        style={{ maxWidth }}
      >
        <View className="flex-row items-start gap-3">
          <View className="mt-0.5 shrink-0">
            <Icon
              as={IconComponent}
              className={cn("size-5", config.iconClassName)}
              size={20}
            />
          </View>
          <View className="min-w-0 flex-1 flex-col gap-0.5">
            <StyledText
              variant="default"
              className="text-card-foreground font-semibold text-[15px] leading-tight"
              numberOfLines={2}
            >
              {toast.title}
            </StyledText>
            {toast.description ? (
              <StyledText
                variant="muted"
                className="text-muted-foreground text-sm leading-snug"
                numberOfLines={2}
              >
                {toast.description}
              </StyledText>
            ) : null}
            {actionLabel && onAction ? (
              <Pressable
                onPress={() => {
                  onAction();
                  onDismiss();
                }}
                className="mt-2 self-start rounded-md py-1 pr-1"
                hitSlop={8}
              >
                <StyledText
                  variant="default"
                  className="text-emerald-600 font-semibold text-sm dark:text-emerald-400"
                >
                  {actionLabel}
                </StyledText>
              </Pressable>
            ) : null}
          </View>
        </View>
        {duration > 0 ? (
          <View className="mt-3 h-1 w-full overflow-hidden rounded-b-xl">
            <Animated.View
              className="h-full rounded-b-xl bg-emerald-500 dark:bg-emerald-400"
              style={progressBarStyle}
            />
          </View>
        ) : null}
      </Pressable>
    </NativeOnlyAnimatedView>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  const { addToast } = ctx;
  return {
    showToast: addToast,
    successToast: (
      title: string,
      options?: Omit<ToastOptions, "title" | "variant">,
    ) => addToast({ ...options, title, variant: "success" }),
    errorToast: (
      title: string,
      options?: Omit<ToastOptions, "title" | "variant">,
    ) => addToast({ ...options, title, variant: "destructive" }),
    warningToast: (
      title: string,
      options?: Omit<ToastOptions, "title" | "variant">,
    ) => addToast({ ...options, title, variant: "warning" }),
    infoToast: (
      title: string,
      options?: Omit<ToastOptions, "title" | "variant">,
    ) => addToast({ ...options, title, variant: "default" }),
  };
}

export default function Toast() {
  return null;
}
