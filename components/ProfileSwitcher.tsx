import { Pressable, StyleSheet, View } from 'react-native';

import { Text, useColors } from '@/components/Themed';
import { useCurriculum } from '@/context/CurriculumContext';

export default function ProfileSwitcher() {
  const colors = useColors();
  const { profiles, selectedProfileId, selectProfile } = useCurriculum();

  if (profiles.length < 2) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {profiles.map((profile) => {
        const active = profile.id === selectedProfileId;

        return (
          <Pressable
            key={profile.id}
            onPress={() => selectProfile(profile.id)}
            style={[styles.option, active && { backgroundColor: colors.tint }]}
          >
            <Text
              style={[styles.label, { color: active ? colors.onTint : colors.textMuted }]}
              numberOfLines={1}
            >
              {profile.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 999,
    padding: 4,
    gap: 4,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
});