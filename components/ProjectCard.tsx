import { SymbolView } from 'expo-symbols';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import TechnologyChip from '@/components/TechnologyChip';
import { Text, useColors } from '@/components/Themed';
import type { Project } from '@/types/curriculum';

type Props = {
  project: Project;
  onPress?: () => void;
};

export default function ProjectCard({ project, onPress }: Props) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      {project.imageUrl ? (
        <Image source={{ uri: project.imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.placeholder, { backgroundColor: colors.tintSoft }]}>
          <SymbolView
            name={{ ios: 'chevron.left.forwardslash.chevron.right', android: 'code', web: 'code' }}
            tintColor={colors.tint}
            size={36}
          />
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{project.name}</Text>
          {onPress && (
            <SymbolView
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              tintColor={colors.textMuted}
              size={18}
            />
          )}
        </View>

        {project.description && (
          <Text style={[styles.description, { color: colors.textMuted }]} numberOfLines={2}>
            {project.description}
          </Text>
        )}

        {project.technologies.length > 0 && (
          <View style={styles.chips}>
            {project.technologies.map((technology) => (
              <TechnologyChip key={technology.id} name={technology.name} />
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
  },
  image: {
    width: '100%',
    height: 140,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 16,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
});