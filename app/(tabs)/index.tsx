import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import ExperienceCard from '@/components/ExperienceCard';
import ProjectCard from '@/components/ProjectCard';
import ScreenState from '@/components/ScreenState';
import SectionTitle from '@/components/SectionTitle';
import { Text, useColors } from '@/components/Themed';
import { useCurriculum } from '@/context/CurriculumContext';

export default function HomeScreen() {
  const colors = useColors();
  const { profiles, curriculum, selectedProfileId, loading, error, selectProfile, retry } =
    useCurriculum();

  if (loading) return <ScreenState type="loading" />;
  if (error) return <ScreenState type="error" message={error} onRetry={retry} />;
  if (!curriculum) return <ScreenState type="empty" message="Nenhum currículo cadastrado." />;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <View style={styles.switcher}>
        {profiles.map((profile) => {
          const active = profile.id === selectedProfileId;
          return (
            <Pressable
              key={profile.id}
              onPress={() => selectProfile(profile.id)}
              style={[
                styles.button,
                { borderColor: colors.tint },
                active && { backgroundColor: colors.tint },
              ]}
            >
              <Text style={active ? { color: colors.onTint, fontWeight: '700' } : undefined}>
                {profile.name.split(' ')[0]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <SectionTitle title={curriculum.name} subtitle={curriculum.title ?? undefined} />

      {curriculum.academicExperiences.map((item) => (
        <ExperienceCard
          key={item.id}
          kind="academic"
          title={item.course}
          place={item.institution}
          detail={item.degree}
          startDate={item.startDate}
          endDate={item.endDate}
          description={item.description}
        />
      ))}

      {curriculum.professionalExperiences.map((item) => (
        <ExperienceCard
          key={item.id}
          kind="professional"
          title={item.position}
          place={item.company}
          startDate={item.startDate}
          endDate={item.endDate}
          description={item.description}
        />
      ))}

      {curriculum.projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  switcher: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
  },
});