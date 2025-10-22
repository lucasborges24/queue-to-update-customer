const TZ_OFFSET_MS = -3 * 60 * 60 * 1000; // America/Sao_Paulo (fixo simples)

export function startOfWeekMonday(d = new Date()): Date {
  // normaliza para meia-noite local (aprox)
  const nd = new Date(d.getTime());
  const day = nd.getDay(); // 0=dom..6=sab
  const diff = (day === 0 ? -6 : 1 - day); // segunda como início
  nd.setDate(nd.getDate() + diff);
  nd.setHours(0, 0, 0, 0);
  return nd;
}

export function ymd(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function currentWeekKey(): string {
  return ymd(startOfWeekMonday(new Date()));
}
