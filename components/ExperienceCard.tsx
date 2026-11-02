import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { Text, useColors } from '@/components/Themed';
import { formatDuration, formatPeriod } from '@/utils/formatDate';

type Props = {
  kind: 'academic' | 'professional';
  title: string;
  place: string;
  detail?: string | null;
  startDate: string;
  endDate: string | null;
  description?: string | null;
};

export default function ExperienceCard({
  kind,
  title,
  place,
  detail,
  startDate,
  endDate,
  description,
}: Props) {
  const colors = useColors();
  const current = endDate === null;

  const icon =
    kind === 'academic'
      ? ({ ios: 'graduationcap.fill', android: 'school', web: 'school' } as const)
      : ({ ios: 'briefcase.fill', android: 'work', web: 'work' } as const);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.tintSoft }]}>
          <SymbolView name={icon} tintColor={colors.tint} size={22} />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={[styles.place, { color: colors.tint }]}>
            {place}
            {detail ? ` · ${detail}` : ''}
          </Text>
        </View>
      </View>

      <View style={styles.periodRow}>
        <Text style={[styles.period, { color: colors.textMuted }]}>
          {formatPeriod(startDate, endDate)} · {formatDuration(startDate, endDate)}
        </Text>

        {current && (
          <View style={[styles.badge, { borderColor: colors.success }]}>
            <Text style={[styles.badgeText, { color: colors.success }]}>
              {kind === 'academic' ? 'Cursando' : 'Atual'}
            </Text>
          </View>
        )}
      </View>

      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 12,
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
  },
  header: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  place: {
    fontSize: 14,
    fontWeight: '600',
  },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  period: {
    fontSize: 13,
    flexShrink: 1,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
  },
});