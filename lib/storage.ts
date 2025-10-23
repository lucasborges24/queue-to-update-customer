import { buildWeekOrdering, WeekOrdering } from './algo';
import { currentWeekKey } from './dates';
import { join } from 'node:path';

type WeekDoc = {
  key: string; // YYYY-MM-DD (segunda)
  createdAt: string; // ISO
  orderings: WeekOrdering;
};

const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN; // defina na Vercel

const DATA_DIR = process.env.VERCEL ? '/tmp/queue-to-update-customer-data' : 'data';
const DATA_FILE = join(DATA_DIR, 'weeks.json');
let memoryCache: Record<string, WeekDoc> = {};
let hasMemoryCache = false;

// ---------- Local FS (dev) ----------
async function readLocal(): Promise<Record<string, WeekDoc>> {
  if (hasMemoryCache) return memoryCache;
  const fs = await import('node:fs/promises');
  try {
    const buf = await fs.readFile(DATA_FILE, 'utf8');
    memoryCache = JSON.parse(buf || '{}');
    hasMemoryCache = true;
    return memoryCache;
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Storage read fallback (using in-memory cache)', err);
    }
    if (!hasMemoryCache) {
      memoryCache = {};
      hasMemoryCache = true;
    }
    return memoryCache;
  }
}
async function writeLocal(all: Record<string, WeekDoc>): Promise<void> {
  const fs = await import('node:fs/promises');
  memoryCache = all;
  hasMemoryCache = true;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), 'utf8');
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Storage write fallback (persisting in memory only)', err);
    }
  }
}

// ---------- Vercel Blob (prod persistente) ----------
// async function getBlobUrlFor(key: string) {
//   return `weeks/${key}.json`;
// }
// async function readBlob(key: string): Promise<WeekDoc | null> {
//   const { list } = await import('@vercel/blob');
//   const path = await getBlobUrlFor(key);
//   const res = await list({ prefix: 'weeks/' });
//   const hit = res.blobs.find((b: { pathname: string; }) => b.pathname === path);
//   if (!hit) return null;
//   const data = await fetch(hit.url).then((r) => r.json());
//   return data as WeekDoc;
// }
// async function writeBlob(doc: WeekDoc): Promise<void> {
//   const { put } = await import('@vercel/blob');
//   const path = await getBlobUrlFor(doc.key);
//   await put(path, JSON.stringify(doc), {
//     access: 'public',
//     contentType: 'application/json'
//   });
// }

// ---------- API pública do storage ----------
export async function getOrCreateWeek(key?: string): Promise<WeekDoc> {
  const wk = key ?? currentWeekKey();

  // Local file fallback (dev). Em produção sem Blob não persiste entre execuções.
  const all = await readLocal();
  if (all[wk]) return all[wk];
  const created: WeekDoc = {
    key: wk,
    createdAt: new Date().toISOString(),
    orderings: buildWeekOrdering(wk)
  };
  all[wk] = created;
  await writeLocal(all);
  return created;
  
}

export async function getWeek(key: string): Promise<WeekDoc | null> {
//   if (USE_BLOB) {
//     return await readBlob(key);
//   } else {
    const all = await readLocal();
    return all[key] ?? null;
//   }
}
