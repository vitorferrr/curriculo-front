import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { Text, useColors } from "@/components/Themed";

type Props =
  | { type: "loading"; message?: string }
  | { type: "error"; message: string; onRetry?: () => void }
  | { type: "empty"; message: string };

export default function ScreenState(props: Props) {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {props.type === "loading" && (
        <>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.message, { color: colors.textMuted }]}>
            {props.message ?? "Carregando currículo..."}
          </Text>
        </>
      )}

      {props.type === "error" && (
        <>
          <Text style={styles.emoji}></Text>
          <Text style={styles.title}>Algo deu errado</Text>
          <Text style={[styles.message, { color: colors.textMuted }]}>
            {props.message}
          </Text>
          {props.onRetry && (
            <Pressable
              onPress={props.onRetry}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: colors.tint, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={[styles.buttonText, { color: colors.onTint }]}>
                Tentar novamente
              </Text>
            </Pressable>
          )}
        </>
      )}

      {props.type === "empty" && (
        <>
          <Text style={styles.emoji}>📭</Text>
          <Text style={[styles.message, { color: colors.textMuted }]}>
            {props.message}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  message: {
    fontSize: 15,
    textAlign: "center",
  },
  button: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  buttonText: {
    fontWeight: "700",
  },
});
