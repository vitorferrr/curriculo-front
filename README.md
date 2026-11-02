#  Currículo — App Mobile

Aplicativo de **currículo e portfólio** feito com **React Native + Expo**. Os dados vêm de uma **API REST própria** ([curriculo-back](https://github.com/vitorferrr/curriculo-back)), desenvolvida com Express e PostgreSQL e hospedada no Vercel.

O app mostra o currículo completo de duas pessoas cadastradas no banco, permite trocar entre elas e **gera o currículo em PDF para compartilhar**.

---

##  Links

| | |
|---|---|
| **App publicado (QR code para o Expo Go)** | https://expo.dev/preview/update?message=Primeira+vers%C3%A3o+do+app+Curr%C3%ADculo&updateRuntimeVersion=1.0.0&createdAt=2026-11-02T18%3A06%3A43.809Z&slug=exp&projectId=7965ed90-ed6b-4d76-a274-6cfb00ec2081&group=51ea944a-6871-4575-8ea9-f9beb2e17063 |
| **API (Vercel)** | https://curriculo-back.vercel.app |
| **Repositório da API** | https://github.com/vitorferrr/curriculo-back |

### Como abrir no celular
1. Instale o **Expo Go** (SDK 58) pela Play Store ou App Store.
2. Abra o link do app publicado e escaneie o **QR code** com o Expo Go (Android) ou com a câmera (iPhone).

---

##  Funcionalidades

- **Início**: foto, cargo, cidade, resumo e contatos. Os contatos abrem o e-mail, o telefone, o GitHub e o LinkedIn.
- **Experiência Acadêmica**: formações com período, duração e o selo "Cursando".
- **Experiência Profissional**: cargos com período, duração e o selo "Atual".
- **Projetos**: lista com **filtro por tecnologia** e **tela de detalhes**, com links para o repositório e a demonstração.
- **Sobre**: tecnologias usadas no app e na API, e a funcionalidade extra.
- **Troca de currículo**: alterna entre as pessoas cadastradas na API.
- **Modo claro e escuro** automáticos.
- Telas de **carregando**, **erro** (com "Tentar novamente") e **lista vazia**.

###  Funcionalidade extra: currículo em PDF
Na tela Início, o botão **"Gerar PDF e compartilhar"**:
1. monta o currículo da pessoa selecionada num layout profissional no **padrão LaTeX**;
2. converte esse layout em PDF com o **expo-print**;
3. abre a janela de compartilhar do celular com o **expo-sharing** (WhatsApp, e-mail, Drive, salvar…).

---

##  Tecnologias

| Tecnologia | Uso |
|---|---|
| React Native | Interface nativa |
| Expo SDK 58 | Ambiente de desenvolvimento e publicação |
| Expo Router | Navegação por arquivos (abas + rota dinâmica) |
| TypeScript | Tipagem das respostas da API |
| Context API | Estado global do currículo e troca de pessoa |
| expo-print / expo-sharing | Geração e compartilhamento do PDF |
| expo-symbols | Ícones nativos (SF Symbols / Material Symbols) |
| EAS Update | Publicação para abrir no Expo Go |

---
