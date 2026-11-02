import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import ScreenState from '@/components/ScreenState';
import SectionTitle from '@/components/SectionTitle';
import TechnologyChip from '@/components/TechnologyChip';
import { Text, useColors } from '@/components/Themed';
import { useCurriculum } from '@/context/CurriculumContext';
import { api } from '@/services/api';
import type { Project } from '@/types/curriculum';

function LinkButton({
  icon,
  label,
  url,
  variant,
}: {
  icon: SymbolViewProps['name'];
  label: string;
  url: string;
  variant: 'primary' | 'outline';
}) {
  const colors = useColors();
  const primary = variant === 'primary';

  async function handlePress() {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Não foi possível abrir o link', url);
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.linkButton,
        {
          backgroundColor: primary ? colors.tint : 'transparent',
          borderColor: colors.tint,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <SymbolView name={icon} tintColor={primary ? colors.onTint : colors.tint} size={18} />
      <Text style={[styles.linkText, { color: primary ? colors.onTint : colors.tint }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function ProjetoScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { curriculum } = useCurriculum();

  const [project, setProject] = useState<Project | null>(
    () => curriculum?.projects.find((item) => item.id === id) ?? null,
  );
  const [loading, setLoading] = useState(!project);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setProject(await api.getProject(id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (!project) {
    if (loading) return <ScreenState type="loading" message="Carregando projeto..." />;
    return (
      <ScreenState
        type="error"
        message={error ?? 'Projeto não encontrado.'}
        onRetry={() => {
          setLoading(true);
          load();
        }}
      />
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: project.name }} />

      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.content}
      >
        {project.imageUrl ? (
          <Image source={{ uri: project.imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.placeholder, { backgroundColor: colors.tintSoft }]}>
            <SymbolView
              name={{ ios: 'chevron.left.forwardslash.chevron.right', android: 'code', web: 'code' }}
              tintColor={colors.tint}
              size={56}
            />
          </View>
        )}

        <View style={styles.header}>
          <Text style={styles.name}>{project.name}</Text>
          {project.profile && (
            <Text style={[styles.author, { color: colors.textMuted }]}>
              por {project.profile.name}
            </Text>
          )}
        </View>

        {project.description && (
          <View style={styles.section}>
            <SectionTitle title="Descrição" />
            <Text style={styles.description}>{project.description}</Text>
          </View>
        )}

        {project.technologies.length > 0 && (
          <View style={styles.section}>
            <SectionTitle title="Tecnologias" />
            <View style={styles.chips}>
              {project.technologies.map((technology) => (
                <TechnologyChip key={technology.id} name={technology.name} />
              ))}
            </View>
          </View>
        )}

        {(project.repositoryUrl || project.demoUrl) && (
          <View style={[styles.section, styles.links]}>
            {project.repositoryUrl && (
              <LinkButton
                icon={{ ios: 'chevron.left.forwardslash.chevron.right', android: 'code', web: 'code' }}
                label="Ver repositório"
                url={project.repositoryUrl}
                variant="primary"
              />
            )}
            {project.demoUrl && (
              <LinkButton
                icon={{ ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' }}
                label="Ver demonstração"
                url={project.demoUrl}
                variant={project.repositoryUrl ? 'outline' : 'primary'}
              />
            )}
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
  },
  image: {
    width: '100%',
    height: 200,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    padding: 16,
    gap: 4,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
  },
  author: {
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  links: {
    gap: 10,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '700',
  },
});