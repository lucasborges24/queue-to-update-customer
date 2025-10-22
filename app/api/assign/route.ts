import { NextRequest } from 'next/server';
import { DayKey } from '@/lib/data';
import { assignForDay } from '@/lib/algo';
import { getOrCreateWeek } from '@/lib/storage';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const day = (body?.day ?? '').trim() as DayKey;
  const clients = Number(body?.clients ?? 0);
  const key: string | undefined = body?.weekKey;

  if (!['dom','seg','ter','quar','qui'].includes(day) || !Number.isFinite(clients) || clients < 1) {
    return new Response(JSON.stringify({ error: 'Parâmetros inválidos' }), { status: 400 });
  }

  // Garante que há uma semana (gera se não existir)
  const wk = await getOrCreateWeek(key);
  const result = assignForDay(day, clients, wk.orderings);
  return Response.json({ weekKey: wk.key, ...result });
}
