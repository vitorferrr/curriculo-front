const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function parseDate(value: string) {
  const [year, month] = value.split('-').map(Number);
  return { year, month };
}

export function formatMonthYear(value: string) {
  const { year, month } = parseDate(value);
  return `${MONTHS[month - 1]} ${year}`;
}

export function formatPeriod(startDate: string, endDate: string | null) {
  const end = endDate ? formatMonthYear(endDate) : 'Atual';
  return `${formatMonthYear(startDate)} – ${end}`;
}

export function formatDuration(startDate: string, endDate: string | null, today = new Date()) {
  const start = parseDate(startDate);
  const end = endDate
    ? parseDate(endDate)
    : { year: today.getFullYear(), month: today.getMonth() + 1 };

  const totalMonths = Math.max(1, (end.year - start.year) * 12 + (end.month - start.month));
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'ano' : 'anos'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'mês' : 'meses'}`);

  return parts.join(' e ');
}