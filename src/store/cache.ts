const mem = new Map<string, { t: number; v: any }>();

export function getCache(key: string, maxAgeSec = 120) {
  const hit = mem.get(key);
  if (!hit) {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.t > maxAgeSec * 1000) return null;
    mem.set(key, parsed);
    return parsed.v;
  }
  if (Date.now() - hit.t > maxAgeSec * 1000) return null;
  return hit.v;
}

export function setCache(key: string, v: any) {
  const entry = { t: Date.now(), v };
  mem.set(key, entry);
  sessionStorage.setItem(key, JSON.stringify(entry));
}
