import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet } from 'react-native';

import { Text, useColors } from '@/components/Themed';
import type { FullProfile } from '@/types/curriculum';
import { generateAndSharePdf } from '@/utils/generatePdf';

type Props = {
  curriculum: FullProfile;
};

export default function GeneratePdfButton({ curriculum }: Props) {
  const colors = useColors();
  const [generating, setGenerating] = useState(false);

  async function handlePress() {
    setGenerating(true);
    try {
      await generateAndSharePdf(curriculum);
    } catch (err) {
      Alert.alert(
        'Não foi possível gerar o PDF',
        err instanceof Error ? err.message : 'Tente novamente.',
      );
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={generating}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.tint, opacity: pressed || generating ? 0.8 : 1 },
      ]}
    >
      {generating ? (
        <ActivityIndicator color={colors.onTint} />
      ) : (
        <SymbolView
          name={{ ios: 'square.and.arrow.up', android: 'picture_as_pdf', web: 'picture_as_pdf' }}
          tintColor={colors.onTint}
          size={20}
        />
      )}
      <Text style={[styles.text, { color: colors.onTint }]}>
        {generating ? 'Gerando PDF...' : 'Gerar PDF e compartilhar'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 14,
    paddingVertical: 15,
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
});