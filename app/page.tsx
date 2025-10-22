'use client';

import { useState, useMemo } from 'react';
import { daysOrder } from '@/lib/data';

export default function HomePage() {
  const [day, setDay] = useState<'dom'|'seg'|'ter'|'quar'|'qui'>('qui');
  const [clients, setClients] = useState(5);
  const [weekKey, setWeekKey] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);
  const capacityInfo = useMemo(() => {
    if (!res) return '';
    const { capacity, requested } = res;
    if (requested > capacity) {
      return `Capacidade diária é ${capacity}. ${requested - capacity} cliente(s) ficaram sem alocação.`;
    }
    return '';
  }, [res]);

  const submit = async () => {
    setLoading(true);
    setRes(null);
    try {
      const r = await fetch('/api/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day, clients, weekKey: weekKey || undefined })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'Erro');
      setRes(j);
      if (!weekKey) setWeekKey(j.weekKey);
    } catch (e: any) {
      alert(e.message || 'Falha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-4">Alocar Atualizações</h1>

      <div className="grid gap-3">
        <label className="grid gap-1">
          <span>Dia</span>
          <select
            className="border rounded p-2"
            value={day}
            onChange={(e) => setDay(e.target.value as any)}
          >
            {daysOrder.map((d) => (
              <option key={d} value={d}>
                {({ dom:'Domingo', seg:'Segunda', ter:'Terça', quar:'Quarta', qui:'Quinta' } as any)[d]}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1">
          <span>Quantidade de clientes</span>
          <input
            type="number"
            min={1}
            className="border rounded p-2"
            value={clients}
            onChange={(e) => setClients(Math.max(1, Number(e.target.value)))}
          />
        </label>

        <label className="grid gap-1">
          <span>Semana (YYYY-MM-DD, segunda) — opcional</span>
          <input
            type="text"
            placeholder="ex.: 2025-10-20"
            className="border rounded p-2"
            value={weekKey}
            onChange={(e) => setWeekKey(e.target.value)}
          />
        </label>

        <button
          className="bg-black text-white rounded p-2 disabled:opacity-50"
          onClick={submit}
          disabled={loading}
        >
          {loading ? 'Alocando...' : 'Alocar'}
        </button>
      </div>

      {res && (
        <section className="mt-6">
          <h2 className="font-semibold">Resultado</h2>
          <p className="text-sm text-gray-600">Semana: {res.weekKey} — Dia: {res.day}</p>
          {capacityInfo && <p className="text-sm text-orange-600">{capacityInfo}</p>}
          <ol className="list-decimal pl-6 mt-2">
            {res.assignments.map((n: string, i: number) => (
              <li key={i}>{n}</li>
            ))}
          </ol>

          <h3 className="mt-4 font-medium">Carga por colaborador</h3>
          <ul className="list-disc pl-6">
            {Object.entries(res.perWorker).map(([k, v]) => (
              <li key={k}>{k}: {String(v)}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8">
        <a href="/semanas" className="underline">Gerar prioridades da semana →</a>
      </div>
    </main>
  );
}
