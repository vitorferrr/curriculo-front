import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import type { FullProfile, Technology } from '@/types/curriculum';
import { formatDuration, formatPeriod } from '@/utils/formatDate';

function escapeHtml(value: string | null | undefined) {
  return (value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function shortUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

function link(url: string) {
  return `<a href="${escapeHtml(url)}">${escapeHtml(shortUrl(url))}</a>`;
}

function toBullets(description: string | null) {
  if (!description) return '';

  const sentences = description
    .split(/\n+|\.\s+/)
    .map((sentence) => sentence.trim().replace(/\.$/, ''))
    .filter(Boolean);

  return `<ul>${sentences.map((sentence) => `<li>${escapeHtml(sentence)}.</li>`).join('')}</ul>`;
}

function section(title: string, content: string) {
  if (!content) return '';
  return `
    <section>
      <h2>${title}</h2>
      ${content}
    </section>`;
}

function entry(options: {
  title: string;
  right: string;
  subtitle?: string;
  subtitleRight?: string;
  description?: string | null;
}) {
  return `
    <div class="entry">
      <div class="row">
        <span class="entry-title">${options.title}</span>
        <span>${options.right}</span>
      </div>
      ${
        options.subtitle || options.subtitleRight
          ? `<div class="row italic">
              <span>${options.subtitle ?? ''}</span>
              <span>${options.subtitleRight ?? ''}</span>
            </div>`
          : ''
      }
      ${toBullets(options.description ?? null)}
    </div>`;
}

function groupSkills(curriculum: FullProfile) {
  const unique = new Map<string, Technology>();
  curriculum.projects.forEach((project) =>
    project.technologies.forEach((technology) => unique.set(technology.id, technology)),
  );

  const groups = new Map<string, string[]>();
  unique.forEach((technology) => {
    const category = technology.category ?? 'Outras';
    groups.set(category, [...(groups.get(category) ?? []), technology.name]);
  });

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(
      ([category, names]) =>
        `<p class="skill"><strong>${escapeHtml(category)}:</strong> ${names
          .sort((a, b) => a.localeCompare(b))
          .map(escapeHtml)
          .join(', ')}</p>`,
    )
    .join('');
}

export function buildCurriculumHtml(curriculum: FullProfile) {
  const contacts = [
    curriculum.phone && escapeHtml(curriculum.phone),
    `<a href="mailto:${escapeHtml(curriculum.email)}">${escapeHtml(curriculum.email)}</a>`,
    curriculum.linkedinUrl && link(curriculum.linkedinUrl),
    curriculum.githubUrl && link(curriculum.githubUrl),
  ]
    .filter(Boolean)
    .map((item) => `<span class="contact">${item}</span>`)
    .join('<span class="sep">|</span>');

  const academic = curriculum.academicExperiences
    .map((item) =>
      entry({
        title: escapeHtml(item.institution),
        right: escapeHtml(capitalize(formatPeriod(item.startDate, item.endDate))),
        subtitle: escapeHtml(item.course),
        subtitleRight: escapeHtml(item.degree ?? (item.endDate ? 'Concluído' : 'Em andamento')),
        description: item.description,
      }),
    )
    .join('');

  const professional = curriculum.professionalExperiences
    .map((item) =>
      entry({
        title: escapeHtml(item.position),
        right: escapeHtml(capitalize(formatPeriod(item.startDate, item.endDate))),
        subtitle: escapeHtml(item.company),
        subtitleRight: escapeHtml(formatDuration(item.startDate, item.endDate)),
        description: item.description,
      }),
    )
    .join('');

  const projects = curriculum.projects
    .map((project) => {
      const technologies = project.technologies.map((t) => escapeHtml(t.name)).join(', ');
      const url = project.repositoryUrl ?? project.demoUrl;

      return entry({
        title: escapeHtml(project.name),
        right: url ? link(url) : '',
        subtitle: technologies,
        description: project.description,
      });
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    @page { size: A4; margin: 15mm 16mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Latin Modern Roman", "CMU Serif", "Computer Modern", Georgia, "Times New Roman", serif;
      color: #000;
      font-size: 10.5pt;
      line-height: 1.35;
    }
    a { color: #000; text-decoration: underline; }

    header { text-align: center; margin-bottom: 6pt; }
    h1 { font-size: 24pt; font-weight: 700; font-variant: small-caps; letter-spacing: 0.5pt; }
    .headline { font-size: 11pt; margin-top: 1pt; }
    .contacts { font-size: 9.5pt; margin-top: 3pt; }
    .contact { white-space: nowrap; }
    .sep { margin: 0 5pt; }

    section { margin-top: 9pt; }
    h2 {
      font-size: 12pt;
      font-weight: 400;
      font-variant: small-caps;
      letter-spacing: 0.4pt;
      border-bottom: 0.8pt solid #000;
      padding-bottom: 1pt;
      margin-bottom: 5pt;
    }

    .entry { margin-bottom: 6pt; page-break-inside: avoid; }
    .row { display: flex; justify-content: space-between; align-items: baseline; gap: 12pt; }
    .row span:last-child { text-align: right; white-space: nowrap; }
    .entry-title { font-weight: 700; }
    .italic { font-style: italic; font-size: 10pt; }

    ul { margin: 2pt 0 0 14pt; }
    li { font-size: 10pt; margin-bottom: 1pt; }

    .summary { text-align: justify; }
    .skill { font-size: 10pt; margin-bottom: 1.5pt; }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(curriculum.name)}</h1>
    ${
      curriculum.title || curriculum.location
        ? `<p class="headline">${[curriculum.title, curriculum.location]
            .filter(Boolean)
            .map((item) => escapeHtml(item))
            .join(' · ')}</p>`
        : ''
    }
    <p class="contacts">${contacts}</p>
  </header>

  ${section('Resumo', curriculum.summary ? `<p class="summary">${escapeHtml(curriculum.summary)}</p>` : '')}
  ${section('Formação Acadêmica', academic)}
  ${section('Experiência Profissional', professional)}
  ${section('Projetos', projects)}
  ${section('Habilidades Técnicas', groupSkills(curriculum))}
</body>
</html>`;
}

export async function generateAndSharePdf(curriculum: FullProfile) {
  const { uri } = await Print.printToFileAsync({
    html: buildCurriculumHtml(curriculum),
  });

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('O compartilhamento não está disponível neste aparelho.');
  }

  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    UTI: 'com.adobe.pdf',
    dialogTitle: `Currículo de ${curriculum.name}`,
  });
}