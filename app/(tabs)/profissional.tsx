import { FlatList, RefreshControl, StyleSheet } from 'react-native';

import ExperienceCard from '@/components/ExperienceCard';
import ScreenState from '@/components/ScreenState';
import SectionTitle from '@/components/SectionTitle';
import { useColors } from '@/components/Themed';
import { useCurriculum } from '@/context/CurriculumContext';

export default function ProfissionalScreen() {
  const colors = useColors();
  const { curriculum, loading, refreshing, error, refresh, retry } = useCurriculum();

  if (loading) return <ScreenState type="loading" />;
  if (error && !curriculum) return <ScreenState type="error" message={error} onRetry={retry} />;
  if (!curriculum) return <ScreenState type="empty" message="Nenhum currículo cadastrado." />;

  const items = curriculum.professionalExperiences;
  const total = items.length;
  const current = items.filter((item) => item.endDate === null).length;

  const subtitle =
    `${curriculum.name} · ${total} ${total === 1 ? 'experiência' : 'experiências'}` +
    (current > 0 ? ` · ${current} ${current === 1 ? 'atual' : 'atuais'}` : '');

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      ListHeaderComponent={<SectionTitle title="Carreira" subtitle={subtitle} />}
      ListEmptyComponent={
        <ScreenState type="empty" message="Nenhuma experiência profissional cadastrada." />
      }
      renderItem={({ item }) => (
        <ExperienceCard
          kind="professional"
          title={item.position}
          place={item.company}
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