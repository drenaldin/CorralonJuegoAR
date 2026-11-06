-- Base de datos del ranking de la Muestra Anual 2026 (UTU San Marcos).
-- Solo se guardan los puntos de cada partida terminada.
CREATE TABLE IF NOT EXISTS partidas (
  id          TEXT PRIMARY KEY,                      -- identificador generado en el celular (evita duplicados)
  apodo       TEXT NOT NULL CHECK (length(apodo) BETWEEN 1 AND 24),
  aciertos    INTEGER NOT NULL CHECK (aciertos BETWEEN 0 AND 15),
  pistas      INTEGER NOT NULL DEFAULT 0 CHECK (pistas BETWEEN 0 AND 45),
  segundos    INTEGER NOT NULL CHECK (segundos BETWEEN 0 AND 86400),
  puntos      INTEGER NOT NULL,
  creada      TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
CREATE INDEX IF NOT EXISTS partidas_orden ON partidas (puntos DESC, segundos ASC);
