import { StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";

// Tela provisória: vira a Home do currículo na etapa 7
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Currículo</Text>
      <Text>Em construção...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
