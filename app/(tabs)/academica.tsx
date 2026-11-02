import { FlatList, RefreshControl, StyleSheet } from 'react-native';

import ExperienceCard from '@/components/ExperienceCard';
import ScreenState from '@/components/ScreenState';
import SectionTitle from '@/components/SectionTitle';
import { useColors } from '@/components/Themed';
import { useCurriculum } from '@/context/CurriculumContext';

export default function AcademicaScreen() {
  const colors = useColors();
  const { curriculum, loading, refreshing, error, refresh, retry } = useCurriculum();

  if (loading) return <ScreenState type="loading" />;
  if (error && !curriculum) return <ScreenState type="error" message={error} onRetry={retry} />;
  if (!curriculum) return <ScreenState type="empty" message="Nenhum currículo cadastrado." />;

  const items = curriculum.academicExperiences;
  const total = items.length;

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <SectionTitle
          title="Formação"
          subtitle={`${curriculum.name} · ${total} ${total === 1 ? 'formação' : 'formações'}`}
        />
      }
      ListEmptyComponent={
        <ScreenState type="empty" message="Nenhuma formação acadêmica cadastrada." />
      }
      renderItem={({ item }) => (
        <ExperienceCard
          kind="academic"
          title={item.course}
          place={item.institution}
          detail={item.degree}
          startDate={item.startDate}
          endDate={item.endDate}
          description={item.description}
        />
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
});