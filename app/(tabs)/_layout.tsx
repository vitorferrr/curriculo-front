import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { useColors } from '@/components/Themed';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

type IconName = SymbolViewProps['name'];

function TabIcon({ name, color }: { name: IconName; color: ColorValue }) {
  return <SymbolView name={name} tintColor={color} size={24} />;
}

export default function TabLayout() {
  const colors = useColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: useClientOnlyValue(false, true),
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          headerTitle: 'Currículo',
          tabBarIcon: ({ color }) => (
            <TabIcon name={{ ios: 'house.fill', android: 'home', web: 'home' }} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="academica"
        options={{
          title: 'Acadêmica',
          headerTitle: 'Experiência Acadêmica',
          tabBarIcon: ({ color }) => (
            <TabIcon
              name={{ ios: 'graduationcap.fill', android: 'school', web: 'school' }}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profissional"
        options={{
          title: 'Profissional',
          headerTitle: 'Experiência Profissional',
          tabBarIcon: ({ color }) => (
            <TabIcon name={{ ios: 'briefcase.fill', android: 'work', web: 'work' }} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="projetos"
        options={{
          title: 'Projetos',
          tabBarIcon: ({ color }) => (
            <TabIcon name={{ ios: 'folder.fill', android: 'folder', web: 'folder' }} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sobre"
        options={{
          title: 'Sobre',
          headerTitle: 'Sobre o app',
          tabBarIcon: ({ color }) => (
            <TabIcon name={{ ios: 'info.circle.fill', android: 'info', web: 'info' }} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}