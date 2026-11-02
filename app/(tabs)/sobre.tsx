import { StyleSheet, View } from 'react-native';

import SectionTitle from '@/components/SectionTitle';
import { useColors } from '@/components/Themed';

export default function SobreScreen() {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SectionTitle title="Sobre o app" subtitle="Tecnologias e funcionalidade extra" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});