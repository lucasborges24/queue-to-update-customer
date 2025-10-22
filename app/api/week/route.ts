import { NextRequest } from 'next/server';
import { getOrCreateWeek, getWeek } from '@/lib/storage';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  if (!key) {
    return new Response(JSON.stringify({ error: 'Informe ?key=YYYY-MM-DD' }), { status: 400 });
  }
  const wk = await getWeek(key);
  if (!wk) return new Response(JSON.stringify({ error: 'Semana não encontrada' }), { status: 404 });
  return Response.json(wk);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const key: string | undefined = body?.key;
  const wk = await getOrCreateWeek(key);
  return Response.json(wk);
}
