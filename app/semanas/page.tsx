'use client';

import { useState } from 'react';

// pequena util local p/ default
function defaultWeekKey() {
  return currentWeekYMD();
}

export default function WeeksPage() {
  const [key, setKey] = useState<string>(defaultWeekKey());
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function gerar() {
    setLoading(true);
    setData(null);
    try {
      const r = await fetch('/api/week', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'Erro ao gerar semana');
      setData(j);
      setKey(j.key);
      alert(`Semana ${j.key} gerada/salva!`);
    } catch (e: any) {
      alert(e.message || 'Falha');
    } finally {
      setLoading(false);
    }
  }

  async function carregar() {
    setLoading(true);
    setData(null);
    try {
      const r = await fetch(`/api/week?key=${encodeURIComponent(key)}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'Não encontrada');
      setData(j);
    } catch (e: any) {
      alert(e.message || 'Falha');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-4">Prioridades da Semana</h1>
      <p className="text-sm text-gray-600 mb-4">
        Gere uma única vez por semana: fixa o embaralhamento para desempate por prioridade em cada dia.
      </p>

      <div className="grid gap-3">
        <label className="grid gap-1">
          <span>Semana (segunda-feira, YYYY-MM-DD)</span>
          <input
            className="border rounded p-2"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="ex.: 2025-10-20"
          />
        </label>

        <div className="flex gap-2">
          <button
            className="bg-black text-white rounded p-2 disabled:opacity-50"
            onClick={gerar}
            disabled={loading}
          >
            {loading ? 'Gerando...' : 'Gerar/Salvar semana'}
          </button>
          <button
            className="border rounded p-2 disabled:opacity-50"
            onClick={carregar}
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Carregar'}
          </button>
        </div>
      </div>

      {data && (
        <section className="mt-6">
          <h2 className="font-semibold">Semana {data.key}</h2>
          <pre className="mt-2 p-3 bg-gray-50 border rounded overflow-auto text-sm">
{JSON.stringify(data.orderings, null, 2)}
          </pre>

          <div className="mt-4">
            <a className="underline" href="/">← Voltar para alocação</a>
          </div>
        </section>
      )}
    </main>
  );
}

// util local para sugerir YYYY-MM-DD da segunda-feira atual
function currentWeekYMD() {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const wd = d.getDay(); // 0=dom..6=sab
  const diff = (wd === 0 ? -6 : 1 - wd);
  d.setDate(d.getDate() + diff);
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const dd = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${dd}`;
}
