import { StyleSheet, View } from 'react-native';

import { Text, useColors } from '@/components/Themed';

type Props = {
  name: string;
};

export default function TechnologyChip({ name }: Props) {
  const colors = useColors();

  return (
    <View style={[styles.chip, { backgroundColor: colors.tintSoft }]}>
      <Text style={[styles.text, { color: colors.text }]}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});