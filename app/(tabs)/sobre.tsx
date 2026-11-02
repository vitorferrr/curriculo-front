import Constants from 'expo-constants';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { ScrollView, StyleSheet, View } from 'react-native';

import ContactButton from '@/components/ContactButton';
import SectionTitle from '@/components/SectionTitle';
import { Text, useColors } from '@/components/Themed';
import { API_URL } from '@/services/api';

const APP_TECHNOLOGIES = [
  { name: 'React Native', purpose: 'Interface nativa para Android e iOS' },
  { name: 'Expo (SDK 58)', purpose: 'Ambiente de desenvolvimento, build e publicação' },
  { name: 'Expo Router', purpose: 'Navegação por arquivos: abas e tela de detalhes' },
  { name: 'TypeScript', purpose: 'Tipagem dos dados que chegam da API' },
  { name: 'Context API', purpose: 'Estado global do currículo e troca de pessoa' },
  { name: 'expo-print', purpose: 'Geração do currículo em PDF' },
  { name: 'expo-sharing', purpose: 'Compartilhamento do PDF' },
  { name: 'expo-symbols', purpose: 'Ícones nativos (SF Symbols e Material)' },
  { name: 'EAS Update', purpose: 'Publicação do app para abrir no Expo Go' },
];

const API_TECHNOLOGIES = [
  { name: 'Node.js + Express', purpose: 'API REST com CRUD completo' },
  { name: 'Sequelize', purpose: 'ORM: modelos e relacionamentos' },
  { name: 'PostgreSQL (Neon)', purpose: 'Banco de dados na nuvem' },
  { name: 'Vercel', purpose: 'Hospedagem da API' },
];

const EXTRA_STEPS = [
  'Na tela Início, toque em "Gerar PDF".',
  'O app monta um currículo formatado com os dados da API.',
  'Escolha onde enviar: WhatsApp, e-mail, Drive ou salvar no aparelho.',
];

function TechRow({ name, purpose, last }: { name: string; purpose: string; last: boolean }) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.techRow,
        !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: colors.tint }]} />
      <View style={styles.techTexts}>
        <Text style={styles.techName}>{name}</Text>
        <Text style={[styles.techPurpose, { color: colors.textMuted }]}>{purpose}</Text>
      </View>
    </View>
  );
}

// Destaque das outras funcionalidades do app
function Feature({ icon, text }: { icon: SymbolViewProps['name']; text: string }) {
  const colors = useColors();

  return (
    <View style={styles.feature}>
      <SymbolView name={icon} tintColor={colors.tint} size={18} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

export default function SobreScreen() {
  const colors = useColors();
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const card = { backgroundColor: colors.card, borderColor: colors.border };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      {/* Apresentação do app */}
      <View style={[styles.hero, card]}>
        <View style={[styles.appIcon, { backgroundColor: colors.tint }]}>
          <SymbolView
            name={{ ios: 'doc.text.fill', android: 'description', web: 'description' }}
            tintColor={colors.onTint}
            size={36}
          />
        </View>
        <Text style={styles.appName}>Currículo</Text>
        <Text style={[styles.heroText, { color: colors.textMuted }]}>
          Aplicativo de currículo e portfólio que consome uma API REST própria, com dados
          guardados em PostgreSQL.
        </Text>
      </View>

      {/* Funcionalidade extra pedida no trabalho */}
      <View>
        <SectionTitle title="Funcionalidade extra" />
        <View style={[styles.extraCard, { backgroundColor: colors.tintSoft, borderColor: colors.tint }]}>
          <View style={styles.extraHeader}>
            <SymbolView
              name={{ ios: 'square.and.arrow.up.fill', android: 'share', web: 'share' }}
              tintColor={colors.tint}
              size={24}
            />
            <Text style={styles.extraTitle}>Currículo em PDF para compartilhar</Text>
          </View>

          {EXTRA_STEPS.map((step, index) => (
            <View key={step} style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: colors.tint }]}>
                <Text style={[styles.stepNumberText, { color: colors.onTint }]}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.box, card, styles.features]}>
          <Feature
            icon={{ ios: 'person.2.fill', android: 'group', web: 'group' }}
            text="Troca entre os currículos cadastrados"
          />
          <Feature
            icon={{ ios: 'line.3.horizontal.decrease', android: 'filter_list', web: 'filter_list' }}
            text="Filtro de projetos por tecnologia"
          />
          <Feature
            icon={{ ios: 'arrow.clockwise', android: 'refresh', web: 'refresh' }}
            text="Puxar para atualizar em todas as listas"
          />
          <Feature
            icon={{ ios: 'moon.fill', android: 'dark_mode', web: 'dark_mode' }}
            text="Modo claro e escuro automáticos"
          />
        </View>
      </View>

      <View>
        <SectionTitle title="Tecnologias do app" />
        <View style={[styles.box, card]}>
          {APP_TECHNOLOGIES.map((tech, index) => (
            <TechRow key={tech.name} {...tech} last={index === APP_TECHNOLOGIES.length - 1} />
          ))}
        </View>
      </View>

      <View>
        <SectionTitle title="Back-end" subtitle="API desenvolvida para este app" />
        <View style={[styles.box, card]}>
          {API_TECHNOLOGIES.map((tech, index) => (
            <TechRow key={tech.name} {...tech} last={index === API_TECHNOLOGIES.length - 1} />
          ))}
        </View>
      </View>

      <View>
        <SectionTitle title="Links" />
        <ContactButton
          icon={{ ios: 'server.rack', android: 'dns', web: 'dns' }}
          label="API no Vercel"
          value={API_URL.replace(/^https?:\/\//, '')}
          url={API_URL}
        />
        <ContactButton
          icon={{ ios: 'iphone', android: 'smartphone', web: 'smartphone' }}
          label="Código do app"
          value="github.com/vitorferrr/curriculo-front"
          url="https://github.com/vitorferrr/curriculo-front"
        />
        <ContactButton
          icon={{ ios: 'chevron.left.forwardslash.chevron.right', android: 'code', web: 'code' }}
          label="Código da API"
          value="github.com/vitorferrr/curriculo-back"
          url="https://github.com/vitorferrr/curriculo-back"
        />
      </View>

      <Text style={[styles.footer, { color: colors.textMuted }]}>
        Desenvolvido por Vitor Ferreira
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 24,
  },
  hero: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    gap: 4,
  },
  appIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
  },
  version: {
    fontSize: 13,
  },
  heroText: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },
  extraCard: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  extraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  extraTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  box: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  features: {
    marginTop: 12,
    paddingVertical: 8,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
  },
  techRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  techTexts: {
    flex: 1,
  },
  techName: {
    fontSize: 15,
    fontWeight: '700',
  },
  techPurpose: {
    fontSize: 13,
  },
  footer: {
    textAlign: 'center',
    fontSize: 13,
    marginBottom: 8,
  },
});