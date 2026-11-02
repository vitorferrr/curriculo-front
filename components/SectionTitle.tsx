import { StyleSheet, View } from 'react-native';

import { Text, useColors } from '@/components/Themed';

type Props = {
  title: string;
  subtitle?: string;
};

export default function SectionTitle({ title, subtitle }: Props) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.bar, { backgroundColor: colors.tint }]} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {subtitle && <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bar: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginLeft: 12,
  },
});