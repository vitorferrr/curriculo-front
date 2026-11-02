import { StyleSheet, View } from 'react-native';

import SectionTitle from '@/components/SectionTitle';
import { useColors } from '@/components/Themed';

export default function ProfissionalScreen() {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SectionTitle title="Experiência Profissional" subtitle="Empresas e cargos" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});