// Supabase: datos públicos del proyecto (nunca pegar una clave secret o service_role).
export const SUPABASE_URL = 'https://ukgbxerbrtmhvletnvfv.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_DkGAVPxokADFkUzOicx8Xw_PcFxGIgZ';

// Corta el pedido a los 10 s. Compatible con celulares viejos (sin AbortSignal.timeout).
function senalConLimite(ms) {
  if (typeof AbortController === 'undefined') return undefined;
  const c = new AbortController();
  setTimeout(() => c.abort(), ms);
  return c.signal;
}

export async function rpc(nombre, datos = {}) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${nombre}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
    signal: senalConLimite(10000),
    cache: 'no-store'
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}
