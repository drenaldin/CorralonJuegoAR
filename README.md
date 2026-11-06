# Búsqueda del QR · Muestra Anual 2026 · UTU San Marcos

Juego de trivia por paradas. Cada persona juega con su celular: escanea el QR «Tutorial» para practicar y después el de la parada 1, donde arranca el tiempo. En cada parada responde 3 preguntas (deporte y cuerpo humano) y recibe la pista hacia la próxima. Al terminar, los puntos se guardan en Supabase.

Sitio: https://drenaldin.github.io/CorralonJuegoAR/ · Ranking para pantalla: https://drenaldin.github.io/CorralonJuegoAR/ranking.html

| QR | Dónde se pega |
| --- | --- |
| Tutorial | Stand de Deporte y Recreación, salón 6, en la entrada (práctica: no corre el tiempo) |
| 1 | Stand de Deporte y Recreación, salón 6, al lado del Tutorial (arranca el tiempo) |
| 2 | Salón 7, cerca del 7 verde pintado ("el número de la suerte") |
| 3 | Asientos de neumáticos pintados |
| 4 | Fogón |
| 5 | Stand de Deporte y Recreación, salón 6, separado del QR 1 (final) |

Puntaje: 100 por acierto (15 preguntas) − 25 por pista + bono de tiempo `max(0, 300 - segundos/10)`. Nunca menos de 0. Cada pista tacha una opción incorrecta. En el tutorial las pistas son gratis. El orden de las paradas es obligatorio. El puntaje lo calcula la base de datos.

## Archivos
- `docs/`: el juego, publicado con GitHub Pages (Settings → Pages → `main` → `/docs`).
  - `docs/js/paradas.js`: preguntas, pistas y códigos de los QR.
  - `docs/js/config.js`: URL y clave pública de Supabase.
- `supabase/setup.sql`: tabla `muestra_puntos` y funciones `registrar_puntos` y `ver_ranking`. Se ejecuta una vez en Supabase → SQL Editor.
- `qr/qr-paradas.pdf`: las 6 hojas para imprimir. `python scripts/generar-qr.py [URL]` las regenera.

Los resultados se ven en Supabase → Table Editor → `muestra_puntos` y se pueden exportar a CSV.
