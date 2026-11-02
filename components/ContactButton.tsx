import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';

import { Text, useColors } from '@/components/Themed';

type Props = {
  icon: SymbolViewProps['name'];
  label: string;
  value: string;
  url: string;
};

export default function ContactButton({ icon, label, value, url }: Props) {
  const colors = useColors();

  async function handlePress() {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Não foi possível abrir', value);
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: colors.tintSoft }]}>
        <SymbolView name={icon} tintColor={colors.tint} size={20} />
      </View>

      <View style={styles.texts}>
        <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
      </View>

      <SymbolView
        name={{ ios: 'arrow.up.right', android: 'open_in_new', web: 'open_in_new' }}
        tintColor={colors.textMuted}
        size={16}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
  },
});