import { DayKey, Worker, base } from './data';

// xmur3 + mulberry32 p/ RNG seedado (determinístico por semana/dia/prioridade)
function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seededShuffle<T>(arr: T[], seedStr: string): T[] {
  const seed = xmur3(seedStr)();
  const rnd = mulberry32(seed);
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type WeekOrdering = Record<DayKey, Record<number, string[]>>;
// Ex.: orderings['qui'][5] = ['cadu','ant'] (ordem fixa p/ empates de prioridade 5)

export function buildWeekOrdering(weekKey: string): WeekOrdering {
  const out: WeekOrdering = { dom: {}, seg: {}, ter: {}, quar: {}, qui: {} };
  (Object.keys(base) as DayKey[]).forEach((day) => {
    const byPriority: Record<number, string[]> = {};
    base[day].forEach((w) => {
      byPriority[w.priority] = byPriority[w.priority] || [];
      byPriority[w.priority].push(w.name);
    });
    Object.entries(byPriority).forEach(([pStr, names]) => {
      const p = Number(pStr);
      out[day][p] = seededShuffle(names, `${weekKey}-${day}-prio-${p}`);
    });
  });
  return out;
}

export interface AssignResult {
  assignments: string[]; // nomes na ordem (cliente 1 -> colaborador, etc.)
  perWorker: Record<string, number>;
  capacity: number;
  requested: number;
  day: DayKey;
}

export function assignForDay(
  day: DayKey,
  clients: number,
  weekOrdering: WeekOrdering
): AssignResult {
  const list = base[day].slice();
  const capacityPerWorker = 2;
  const perWorker: Record<string, number> = {};
  list.forEach((w) => (perWorker[w.name] = 0));

  const priorities = Array.from(new Set(list.map((w) => w.priority))).sort((a, b) => b - a);
  const pointers: Record<number, number> = {};
  priorities.forEach((p) => (pointers[p] = 0));

  const capacity = list.length * capacityPerWorker;
  const take = Math.min(clients, capacity);
  const assignments: string[] = [];

  for (let i = 0; i < take; i++) {
    let picked: string | null = null;

    for (const p of priorities) {
      const order = weekOrdering[day][p] || list.filter((w) => w.priority === p).map((w) => w.name);
      if (!order.length) continue;

      // percorre a ordem circular para achar alguém com slot
      const L = order.length;
      let idx = pointers[p] % (L || 1);
      let tried = 0;

      while (tried < L) {
        const name = order[idx];
        if (perWorker[name] < capacityPerWorker) {
          picked = name;
          if (perWorker[name] + 1 >= capacityPerWorker) {
            pointers[p] = (idx + 1) % L; // avanca quando esgota a capacidade
          } else {
            pointers[p] = idx; // mantem o mesmo colaborador ate completar os 2 clientes
          }
          break;
        }
        idx = (idx + 1) % L;
        tried++;
      }
      if (picked) break;
    }

    if (!picked) break; // esgotou capacidade
    perWorker[picked]++;
    assignments.push(picked);
  }

  return { assignments, perWorker, capacity, requested: clients, day };
}
