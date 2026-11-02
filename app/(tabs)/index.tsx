import { SymbolView } from 'expo-symbols';
import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import ContactButton from '@/components/ContactButton';
import ProfileSwitcher from '@/components/ProfileSwitcher';
import ScreenState from '@/components/ScreenState';
import SectionTitle from '@/components/SectionTitle';
import { Text, useColors } from '@/components/Themed';
import { useCurriculum } from '@/context/CurriculumContext';

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export default function HomeScreen() {
  const colors = useColors();
  const { curriculum, loading, refreshing, error, refresh, retry } = useCurriculum();
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null);

  if (loading) return <ScreenState type="loading" />;
  if (error && !curriculum) return <ScreenState type="error" message={error} onRetry={retry} />;
  if (!curriculum) return <ScreenState type="empty" message="Nenhum currículo cadastrado." />;

  const photoUrl = curriculum.photoUrl && curriculum.photoUrl !== failedPhoto ? curriculum.photoUrl : null;

  const stats: { label: string; value: number; href: Href }[] = [
    { label: 'Formações', value: curriculum.academicExperiences.length, href: '/academica' },
    { label: 'Experiências', value: curriculum.professionalExperiences.length, href: '/profissional' },
    { label: 'Projetos', value: curriculum.projects.length, href: '/projetos' },
  ];

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          tintColor={colors.tint}
          colors={[colors.tint]}
        />
      }
    >
      <ProfileSwitcher />

      {/* Cabeçalho com foto, nome e cargo */}
      <View style={[styles.hero, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.cover, { backgroundColor: colors.tint }]} />

        <View style={[styles.avatarRing, { backgroundColor: colors.card }]}>
          {photoUrl ? (
            <Image
              source={{ uri: photoUrl }}
              style={styles.avatar}
              onError={() => setFailedPhoto(photoUrl)}
            />
          ) : (
            <View style={[styles.avatar, styles.initials, { backgroundColor: colors.tintSoft }]}>
              <Text style={[styles.initialsText, { color: colors.tint }]}>
                {getInitials(curriculum.name)}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.name}>{curriculum.name}</Text>
        {curriculum.title && (
          <Text style={[styles.title, { color: colors.tint }]}>{curriculum.title}</Text>
        )}

        {curriculum.location && (
          <View style={styles.locationRow}>
            <SymbolView
              name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
              tintColor={colors.textMuted}
              size={14}
            />
            <Text style={[styles.location, { color: colors.textMuted }]}>{curriculum.location}</Text>
          </View>
        )}
      </View>

      {/* Números do currículo: cada um leva para a aba correspondente */}
      <View style={styles.stats}>
        {stats.map((stat) => (
          <Pressable
            key={stat.label}
            onPress={() => router.navigate(stat.href)}
            style={({ pressed }) => [
              styles.stat,
              { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={[styles.statValue, { color: colors.tint }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>{stat.label}</Text>
          </Pressable>
        ))}
      </View>

      {curriculum.summary && (
        <View style={styles.section}>
          <SectionTitle title="Sobre mim" />
          <Text style={styles.summary}>{curriculum.summary}</Text>
        </View>
      )}

      <View style={styles.section}>
        <SectionTitle title="Contato" />

        <ContactButton
          icon={{ ios: 'envelope.fill', android: 'mail', web: 'mail' }}
          label="E-mail"
          value={curriculum.email}
          url={`mailto:${curriculum.email}`}
        />

        {curriculum.phone && (
          <ContactButton
            icon={{ ios: 'phone.fill', android: 'call', web: 'call' }}
            label="Telefone"
            value={curriculum.phone}
            url={`tel:${curriculum.phone.replace(/\D/g, '')}`}
          />
        )}

        {curriculum.githubUrl && (
          <ContactButton
            icon={{ ios: 'chevron.left.forwardslash.chevron.right', android: 'code', web: 'code' }}
            label="GitHub"
            value={curriculum.githubUrl.replace(/^https?:\/\/(www\.)?/, '')}
            url={curriculum.githubUrl}
          />
        )}

        {curriculum.linkedinUrl && (
          <ContactButton
            icon={{ ios: 'link', android: 'link', web: 'link' }}
            label="LinkedIn"
            value={curriculum.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
            url={curriculum.linkedinUrl}
          />
        )}
      </View>
    </ScrollView>
  );
}

const AVATAR_SIZE = 104;

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
  },
  hero: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
    paddingBottom: 20,
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
  },
  cover: {
    alignSelf: 'stretch',
    height: 88,
  },
  avatarRing: {
    marginTop: -(AVATAR_SIZE / 2) - 4,
    padding: 4,
    borderRadius: 999,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  initials: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontSize: 36,
    fontWeight: '800',
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 12,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  location: {
    fontSize: 14,
  },
  stats: {
    flexDirection: 'row',
    gap: 8,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginTop: 4,
  },
  summary: {
    fontSize: 15,
    lineHeight: 23,
  },
});