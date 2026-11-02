import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useCurriculum } from '@/context/CurriculumContext';

export default function HomeScreen() {
  const { profiles, curriculum, selectedProfileId, loading, error, selectProfile, retry } =
    useCurriculum();

  return (
    <View style={styles.container}>
      <View style={styles.switcher}>
        {profiles.map((profile) => {
          const active = profile.id === selectedProfileId;
          return (
            <Pressable
              key={profile.id}
              onPress={() => selectProfile(profile.id)}
              style={[styles.button, active && styles.buttonActive]}
            >
              <Text style={active ? styles.buttonTextActive : undefined}>
                {profile.name.split(' ')[0]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {loading && <ActivityIndicator />}

      {error && (
        <>
          <Text style={styles.error}>{error}</Text>
          <Pressable onPress={retry} style={styles.button}>
            <Text>Tentar novamente</Text>
          </Pressable>
        </>
      )}

      {!loading && curriculum && (
        <>
          <Text style={styles.title}>{curriculum.name}</Text>
          <Text>{curriculum.title}</Text>
          <Text>
            {curriculum.academicExperiences.length} formação(ões) ·{' '}
            {curriculum.professionalExperiences.length} experiência(s) ·{' '}
            {curriculum.projects.length} projeto(s)
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 20,
  },
  switcher: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  buttonActive: {
    backgroundColor: '#2563eb',
  },
  buttonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  error: {
    color: '#dc2626',
    textAlign: 'center',
  },
});