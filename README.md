# Búsqueda del QR · Muestra Anual 2026 · UTU San Marcos

Juego de preguntas por paradas. Cada persona juega con su celular: primero escanea el QR «Tutorial» para practicar, después el de la parada 1 (ahí arranca el tiempo). En cada parada escanea el QR impreso, contesta 3 preguntas de trivia (deporte y cuerpo humano) y recibe la pista hacia la próxima parada. Al terminar, solo los puntos se guardan en la base de datos de la PC de Diego.

| Parada | Lugar | Pista que lleva ahí |
| --- | --- | --- |
| Tutorial | Stand de Deporte y Recreación, salón 6 (entrada) | práctica: apodo y 3 preguntas, sin tiempo ni puntos |
| 1 | Stand de Deporte y Recreación, salón 6, al lado del Tutorial | arranca el tiempo |
| 2 | Salón 7, cerca del 7 verde pintado | "el número de la suerte" |
| 3 | Asientos de neumáticos pintados | asientos redondos de goma |
| 4 | Fogón | bancos en ronda alrededor del fuego |
| 5 | Stand de Deporte y Recreación, salón 6 (final) | volver al inicio |

Puntaje: 100 por acierto (15 preguntas) − 25 por cada pista + bono de tiempo `max(0, 300 - segundos/10)`. Máximo 1800, nunca menos de 0. Cada pista tacha una opción incorrecta, hasta dejar solo la correcta. En el tutorial las pistas son gratis. El orden es obligatorio: un QR fuera de orden muestra la pista que corresponde.

## Carpetas
- `docs/`: el juego (HTML, CSS, JS). Se publica en GitHub Pages: https://drenaldin.github.io/corralon-qr/
  - `docs/js/paradas.js`: preguntas, pistas y códigos de cada QR.
  - `docs/js/config.js`: dirección del servidor del ranking.
  - `docs/ranking.html`: pantalla del ranking para mostrar en el stand (se actualiza cada 10 s).
- `servidor/`: ranking en la PC. `server.js` + `schema.sql`; la base queda en `servidor/ranking.db` (SQLite).
- `qr/qr-paradas.pdf`: las 6 hojas (Tutorial y paradas 1 a 5) para imprimir. `scripts/generar-qr.py` las vuelve a generar si cambia la URL del sitio.

## Poner en marcha (Windows, PowerShell)
1. Instalar Node y Cloudflare Tunnel (una sola vez; después cerrar y abrir PowerShell):
   ```powershell
   winget install OpenJS.NodeJS.LTS
   winget install Cloudflare.cloudflared
   ```
2. Servidor del ranking (dejar la ventana abierta):
   ```powershell
   cd "C:\Users\diego\Documents\GitHub\Corralon QR\servidor"
   node server.js
   ```
3. En otra ventana, publicar el servidor en internet (dejarla abierta):
   ```powershell
   cloudflared tunnel --url http://localhost:8787
   ```
   Copiar la dirección `https://....trycloudflare.com` que aparece y pegarla en `docs/js/config.js`.
4. Publicar el juego en GitHub (repo **público** `corralon-qr`):
   ```powershell
   cd "C:\Users\diego\Documents\GitHub\Corralon QR"
   git init
   git add .
   git commit -m "Búsqueda del QR para la Muestra Anual 2026"
   git branch -M main
   git remote add origin https://github.com/drenaldin/corralon-qr.git
   git push -u origin main
   ```
   En GitHub: Settings → Pages → Deploy from a branch → `main` → `/docs` → Save.
5. Imprimir `qr/qr-paradas.pdf` y pegar cada hoja en su lugar (al pie de cada hoja dice dónde).

Si se reinicia `cloudflared`, la dirección cambia: pegar la nueva en `docs/js/config.js` y hacer `git commit -am "Nueva URL" ; git push`. Los QR no cambian.
Si un celular no pudo enviar los puntos, la pantalla final tiene "Reintentar envío".

Para ver los puntos guardados: abrir `docs/ranking.html` publicado (`https://drenaldin.github.io/corralon-qr/ranking.html`).
