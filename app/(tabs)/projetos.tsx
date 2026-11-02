import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import ProjectCard from '@/components/ProjectCard';
import ScreenState from '@/components/ScreenState';
import SectionTitle from '@/components/SectionTitle';
import { Text, useColors } from '@/components/Themed';
import { useCurriculum } from '@/context/CurriculumContext';
import type { Technology } from '@/types/curriculum';

export default function ProjetosScreen() {
  const colors = useColors();
  const { curriculum, loading, refreshing, error, refresh, retry } = useCurriculum();
  const [filterId, setFilterId] = useState<string | null>(null);

  const projects = curriculum?.projects ?? [];

  const technologies = useMemo(() => {
    const map = new Map<string, Technology>();
    projects.forEach((project) =>
      project.technologies.forEach((technology) => map.set(technology.id, technology)),
    );
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [projects]);

  const activeFilter = technologies.some((technology) => technology.id === filterId)
    ? filterId
    : null;

  const filtered = activeFilter
    ? projects.filter((project) => project.technologies.some((t) => t.id === activeFilter))
    : projects;

  if (loading) return <ScreenState type="loading" />;
  if (error && !curriculum) return <ScreenState type="error" message={error} onRetry={retry} />;
  if (!curriculum) return <ScreenState type="empty" message="Nenhum currículo cadastrado." />;

  const filterOptions = [{ id: null, name: 'Todas' }, ...technologies];

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.id}
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <View>
          <SectionTitle
            title="Portfólio"
            subtitle={`${curriculum.name} · ${projects.length} ${projects.length === 1 ? 'projeto' : 'projetos'}`}
          />

          {technologies.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
              style={styles.filtersScroll}
            >
              {filterOptions.map((option) => {
                const active = option.id === activeFilter;
                return (
                  <Pressable
                    key={option.id ?? 'all'}
                    onPress={() => setFilterId(option.id)}
                    style={[
                      styles.filter,
                      { borderColor: active ? colors.tint : colors.border },
                      { backgroundColor: active ? colors.tint : colors.card },
                    ]}
                  >
                    <Text
                      style={[styles.filterText, { color: active ? colors.onTint : colors.text }]}
                    >
                      {option.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </View>
      }
      ListEmptyComponent={
        <ScreenState
          type="empty"
          message={
            activeFilter ? 'Nenhum projeto com essa tecnologia.' : 'Nenhum projeto cadastrado.'
          }
        />
      }
      renderItem={({ item }) => (
        <ProjectCard project={item} onPress={() => router.push(`/projeto/${item.id}`)} />
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          tintColor={colors.tint}
          colors={[colors.tint]}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    flexGrow: 1,
  },
  filtersScroll: {
    marginHorizontal: -16,
    marginBottom: 16,
  },
  filters: {
    gap: 8,
    paddingHorizontal: 16,
  },
  filter: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
});