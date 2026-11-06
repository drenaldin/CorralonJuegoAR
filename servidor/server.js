// Servidor del ranking: guarda los puntos en ranking.db (SQLite, en esta carpeta).
// Uso: node server.js   (puerto 8787)
import http from 'node:http';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

const PUERTO = Number(process.env.PUERTO || 8787);
const dir = new URL('.', import.meta.url);
const db = new DatabaseSync(fileURLToPath(new URL('ranking.db', dir)));
db.exec(readFileSync(new URL('schema.sql', dir), 'utf8'));
// Si la base se creó con una versión anterior, agrega la columna de pistas.
if (!db.prepare('PRAGMA table_info(partidas)').all().some(c => c.name === 'pistas')) {
  db.exec('ALTER TABLE partidas ADD COLUMN pistas INTEGER NOT NULL DEFAULT 0');
}

const insertar = db.prepare(`INSERT OR IGNORE INTO partidas (id, apodo, aciertos, pistas, segundos, puntos) VALUES (?, ?, ?, ?, ?, ?)`);
const top = db.prepare(`SELECT apodo, aciertos, pistas, segundos, puntos FROM partidas ORDER BY puntos DESC, segundos ASC, creada ASC LIMIT 20`);
const total = db.prepare(`SELECT count(*) AS n FROM partidas`);

export const calcularPuntos = (aciertos, pistas, segundos) =>
  Math.max(0, aciertos * 100 - pistas * 25 + Math.max(0, 300 - Math.floor(segundos / 10)));

function responder(res, estado, datos) {
  res.writeHead(estado, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(datos));
}

function leerCuerpo(req) {
  return new Promise((ok, mal) => {
    let txt = '';
    req.on('data', c => { txt += c; if (txt.length > 2000) { mal(new Error('grande')); req.destroy(); } });
    req.on('end', () => { try { ok(JSON.parse(txt)); } catch (e) { mal(e); } });
  });
}

http.createServer(async (req, res) => {
  const ruta = new URL(req.url, 'http://x').pathname;
  if (req.method === 'OPTIONS') return responder(res, 204, {});
  try {
    if (req.method === 'GET' && ruta === '/api/ranking') {
      return responder(res, 200, { filas: top.all(), total: total.get().n });
    }
    if (req.method === 'POST' && ruta === '/api/puntos') {
      const d = await leerCuerpo(req);
      const id = String(d.id || '').slice(0, 64);
      const apodo = String(d.apodo || '').normalize('NFKC').replace(/\s+/g, ' ').trim().slice(0, 24);
      const aciertos = Number.parseInt(d.aciertos, 10);
      const segundos = Number.parseInt(d.segundos, 10);
      const pistas = Number.parseInt(d.pistas ?? 0, 10);
      if (!id || !apodo || !(aciertos >= 0 && aciertos <= 15) || !(segundos >= 0 && segundos <= 86400) || !(pistas >= 0 && pistas <= 45)) {
        return responder(res, 400, { ok: false, error: 'Datos inválidos' });
      }
      const puntos = calcularPuntos(aciertos, pistas, segundos);
      insertar.run(id, apodo, aciertos, pistas, segundos, puntos);
      return responder(res, 200, { ok: true, puntos });
    }
    if (ruta === '/') return responder(res, 200, { ok: true, servicio: 'ranking Muestra UTU San Marcos' });
    responder(res, 404, { ok: false });
  } catch {
    responder(res, 400, { ok: false });
  }
}).listen(PUERTO, () => console.log(`Ranking listo en http://localhost:${PUERTO}  (base: ranking.db)`));
