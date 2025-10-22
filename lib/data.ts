export type DayKey = 'dom' | 'seg' | 'ter' | 'quar' | 'qui';

export interface Worker {
  name: string;
  priority: number; // 5=max, 1=min
}

export const daysOrder: DayKey[] = ['dom', 'seg', 'ter', 'quar', 'qui'];

// Lista base (normalizei "marcos3" etc.)
export const base: Record<DayKey, Worker[]> = {
  dom: [
    { name: 'Yan', priority: 5 },
    { name: 'Lucas Solerne', priority: 5 },
    { name: 'Pedro', priority: 3 },
    { name: 'Anthony', priority: 2 },
    { name: 'Cadu', priority: 1 }
  ],
  seg: [
    { name: 'Cadu', priority: 5 },
    { name: 'Anthony', priority: 5 },
    { name: 'Lucas Solerne', priority: 5 },
    { name: 'Yan', priority: 4 },
    { name: 'Pedro', priority: 3 },
    { name: 'Marcos', priority: 3 }
  ],
  ter: [
    { name: 'Pedro', priority: 5 },
    { name: 'Paulo', priority: 5 },
    { name: 'Cadu', priority: 5 },
    { name: 'Lucas Solerne', priority: 5 },
    { name: 'Anthony', priority: 5 },
    { name: 'Marcos', priority: 4 },
    { name: 'Yan', priority: 3 },
    { name: 'Jerf', priority: 1 }
  ],
  quar: [
    { name: 'Pedro', priority: 5 },
    { name: 'Anthony', priority: 5 },
    { name: 'Lucas Solerne', priority: 4 },
    { name: 'Yan', priority: 3 },
    { name: 'Marcos', priority: 3 },
    { name: 'Cadu', priority: 1 },
    { name: 'Jerf', priority: 1 }
  ],
  qui: [
    { name: 'Cadu', priority: 5 },
    { name: 'Anthony', priority: 5 },
    { name: 'Lucas Solerne', priority: 4 },
    { name: 'Paulo', priority: 3 },
    { name: 'Yan', priority: 3 },
    { name: 'Marcos', priority: 2 },
    { name: 'Pedro', priority: 1 }
  ]
};
