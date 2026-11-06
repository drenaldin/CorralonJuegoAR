import { PARADAS, TUTORIAL, TOTAL_PREGUNTAS, PUNTOS_PISTA, calcularPuntos } from './paradas.js?v=3';
import { rpc } from './config.js?v=3';

const CLAVE = 'muestra-utu-2026';
const CLAVE_APODO = 'muestra-utu-2026-apodo';
const app = document.getElementById('app');
let almacen;
try { almacen = window.localStorage; } catch { almacen = null; }

// Partida: { id, apodo, inicio, fin, siguiente (1..5, 6 = terminado), aciertos, pistas,
//            respuestas: {"1-0": true}, tachadas: {"1-0": [índices]}, enviada }
let partida = leer();
let reloj;

function leer() { try { return JSON.parse(almacen?.getItem(CLAVE)) || null; } catch { return null; } }
function guardar() { try { almacen?.setItem(CLAVE, JSON.stringify(partida)); } catch { /* sin guardado */ } }
const apodoGuardado = () => { try { return almacen?.getItem(CLAVE_APODO) || ''; } catch { return ''; } };
const guardarApodo = a => { try { almacen?.setItem(CLAVE_APODO, a); } catch { /* sin guardado */ } };
const limpiarApodo = t => t.normalize('NFKC').replace(/\s+/g, ' ').trim().slice(0, 24);

const segundos = () => partida ? Math.floor(((partida.fin || Date.now()) - partida.inicio) / 1000) : 0;
const formato = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
const puntos = () => calcularPuntos(partida.aciertos, partida.pistas, segundos());
const parada = n => n === 0 ? TUTORIAL : PARADAS[n - 1];

function el(tag, attrs = {}, ...hijos) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'onclick') e.addEventListener('click', v);
    else if (k === 'class') e.className = v;
    else e.setAttribute(k, v);
  }
  e.append(...hijos.filter(h => h !== null && h !== undefined && h !== false));
  return e;
}

function pintar(...nodos) {
  app.replaceChildren(...nodos.filter(Boolean));
  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0 });
  actualizarBarra();
}

function actualizarBarra() {
  const m = document.getElementById('marcador');
  m.hidden = !partida;
  if (partida) {
    document.getElementById('m-puntos').textContent = puntos();
    document.getElementById('m-tiempo').textContent = formato(segundos());
  }
  document.getElementById('franjas').replaceChildren(...PARADAS.map(p => {
    const hecha = partida && partida.siguiente > p.numero;
    return el('li', { class: `${p.color}${hecha ? ' hecha' : ''}`, 'aria-label': `Parada ${p.numero}${hecha ? ' completada' : ''}` });
  }));
}

// ---------- Lectura del QR ----------
function leerQR() {
  const q = new URLSearchParams(location.search);
  if (!q.has('p')) return null;
  const n = Number(q.get('p'));
  const p = Number.isInteger(n) ? parada(n) : null;
  if (!p || q.get('c') !== p.codigo) return null;
  history.replaceState(null, '', location.pathname);   // que no quede el código en la barra
  return n;
}

// ---------- Pantallas ----------
function portada(mensaje) {
  pintar(
    el('section', { class: 'bloque verde' },
      el('p', { class: 'etiqueta' }, 'Búsqueda del QR'),
      el('h1', {}, 'Recorré la Muestra jugando'),
      el('p', {}, 'Son 5 paradas con 3 preguntas de trivia de deporte y del cuerpo humano. Cada parada te da una pista para encontrar el próximo QR.')),
    mensaje ? el('p', { class: 'aviso' }, mensaje) : null,
    el('div', { class: 'texto' },
      el('h2', {}, 'Cómo empezar'),
      el('p', {}, 'En el stand de Deporte y Recreación del salón 6 escaneá con la cámara del celular el QR «Tutorial» para practicar. Después escaneá el QR de la parada 1 y empieza a correr el tiempo.'),
      el('a', { class: 'btn btn-borde', href: './ranking.html' }, 'Ver el ranking'))
  );
}

// Formulario de apodo. alListo(apodo) se llama al enviar.
function formularioApodo(textoBoton, alListo) {
  const input = el('input', { id: 'apodo', maxlength: '24', autocomplete: 'nickname', required: '', placeholder: 'Ej.: Rayo' });
  input.value = apodoGuardado();
  const form = el('form', { class: 'texto' },
    el('label', { for: 'apodo' }, 'Tu apodo para el ranking'),
    input,
    el('button', { class: 'btn btn-amarillo', type: 'submit' }, textoBoton));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const apodo = limpiarApodo(input.value);
    if (!apodo) return input.focus();
    guardarApodo(apodo);
    alListo(apodo);
  });
  return [form, input];
}

function inicioTutorial() {
  const [form, input] = formularioApodo('Continuar', apodo => comoSeJuega(apodo));
  pintar(
    el('section', { class: 'bloque azul' },
      el('p', { class: 'etiqueta' }, 'Tutorial · Práctica'),
      el('h1', {}, '¡Bienvenido a la búsqueda!'),
      el('p', {}, 'Antes de jugar, probá con 3 preguntas de práctica. No corre el tiempo y no cuenta para el ranking.')),
    form);
  input.focus();
}

function comoSeJuega(apodo) {
  const paso = (color, num, titulo, texto) =>
    el('li', { class: 'paso' }, el('span', { class: `num ${color}` }, num), el('div', {}, el('b', {}, titulo), el('p', {}, texto)));
  pintar(
    el('section', { class: 'bloque azul' },
      el('p', { class: 'etiqueta' }, `Hola, ${apodo}`),
      el('h1', {}, 'Cómo se juega'),
      el('p', {}, 'Son 5 paradas por la UTU. En cada una se repite lo mismo:')),
    el('div', { class: 'texto' },
      el('ol', { class: 'pasos' },
        paso('verde', '1', 'Escaneá el QR', 'Con la cámara del celular, en el lugar de la parada. El de la parada 1 está acá, en el stand.'),
        paso('celeste', '2', 'Respondé 3 preguntas', 'De deporte y del cuerpo humano. Cada respuesta correcta suma 100 puntos.'),
        paso('naranja', '3', '¿Dudás? Pedí una pista', `El botón «Pista» tacha una opción incorrecta y resta ${PUNTOS_PISTA} puntos. Podés pedir varias.`),
        paso('rojo', '4', 'Leé la pista del lugar', 'Al terminar las 3 preguntas aparece un acertijo que te dice dónde está el próximo QR.'),
        paso('agua', '5', 'Buscalo y repetí', 'Así hasta la parada 5, que es volver al stand. Si terminás rápido, ganás un bono.')),
      el('p', { class: 'nota-tiempo' }, 'Ahora vas a practicar con 3 preguntas. Acá no corre el tiempo ni suma puntos: el reloj arranca recién al escanear el QR de la parada 1.'),
      el('button', { class: 'btn btn-amarillo', type: 'button', onclick: () => preguntar(0, 0) }, 'Empezar la práctica')));
}

function finTutorial() {
  pintar(
    el('section', { class: 'bloque azul' },
      el('p', { class: 'etiqueta' }, 'Tutorial terminado'),
      el('h1', {}, '¡Ya sabés jugar!'),
      el('p', {}, 'Ahora escaneá el QR de la Parada 1. Desde ese momento corre el tiempo.')),
    el('div', { class: 'texto' },
      el('h2', {}, 'Recordá'),
      el('ul', { class: 'reglas' },
        el('li', {}, 'Cada respuesta correcta suma 100 puntos.'),
        el('li', {}, `Cada pista tacha una opción incorrecta y resta ${PUNTOS_PISTA} puntos.`),
        el('li', {}, 'Si terminás rápido, ganás un bono de hasta 300 puntos.'),
        el('li', {}, 'Después de cada parada aparece una pista para encontrar el próximo QR.')),
      el('button', { class: 'btn btn-borde', type: 'button', onclick: () => preguntar(0, 0) }, 'Practicar otra vez')));
}

function inicioJuego() {
  const empezar = apodo => {
    partida = { id: crypto.randomUUID?.() || String(Date.now()) + Math.random(), apodo, inicio: Date.now(), fin: null,
      siguiente: 1, aciertos: 0, pistas: 0, respuestas: {}, tachadas: {}, enviada: false };
    guardar();
    arrancarReloj();
    preguntar(1, 0);
  };
  const [form, input] = formularioApodo('Empezar (arranca el tiempo)', empezar);
  pintar(
    el('section', { class: 'bloque verde' },
      el('p', { class: 'etiqueta' }, 'Parada 1 de 5'),
      el('h1', {}, '¡A jugar!'),
      el('p', {}, 'El tiempo empieza a correr cuando tocás el botón. Si todavía no hiciste el tutorial, podés escanear primero el QR «Tutorial».')),
    form);
  if (!input.value) input.focus();
}

function preguntar(n, i) {
  const practica = n === 0;
  const p = parada(n), q = p.preguntas[i];
  const clave = `${n}-${i}`;
  let tachadas = practica ? [] : (partida.tachadas[clave] ||= []);
  const lista = el('div', { class: 'opciones' });
  const despues = el('div', { class: 'despues' });
  const incorrectas = q.opciones.map((_, k) => k).filter(k => k !== q.correcta);

  const botonPista = el('button', { class: 'btn btn-pista', type: 'button', onclick: pedirPista }, '');
  function pintarPista() {
    const quedan = incorrectas.filter(k => !tachadas.includes(k)).length;
    botonPista.hidden = quedan === 0;
    botonPista.textContent = practica ? 'Pedir pista (en práctica es gratis)' : `Pedir pista (−${PUNTOS_PISTA} puntos)`;
    [...lista.children].forEach((b, k) => {
      if (tachadas.includes(k)) { b.disabled = true; b.classList.add('tachada'); b.setAttribute('aria-label', `${q.opciones[k]} (descartada)`); }
    });
  }
  function pedirPista() {
    const disponibles = incorrectas.filter(k => !tachadas.includes(k));
    if (!disponibles.length) return;
    tachadas.push(disponibles[Math.floor(Math.random() * disponibles.length)]);
    if (!practica) { partida.pistas++; guardar(); actualizarBarra(); }
    pintarPista();
  }

  q.opciones.forEach((texto, k) => {
    lista.append(el('button', { class: 'opcion', type: 'button', onclick: () => responder(k) }, texto));
  });

  function responder(k) {
    const bien = k === q.correcta;
    if (!practica) {
      partida.respuestas[clave] = bien;
      if (bien) partida.aciertos++;
      guardar(); actualizarBarra();
    }
    botonPista.hidden = true;
    [...lista.children].forEach((b, j) => {
      b.disabled = true;
      if (j === q.correcta) b.classList.add('bien');
      else if (j === k) b.classList.add('mal');
    });
    const ultima = i === p.preguntas.length - 1;
    const textoSeguir = !ultima ? 'Siguiente pregunta' : practica ? 'Terminar la práctica' : n === 5 ? 'Ver mi resultado' : 'Ver la pista';
    despues.replaceChildren(
      el('p', { class: bien ? 'res bien' : 'res mal', role: 'status' }, bien ? (practica ? '¡Correcto!' : '¡Correcto! +100') : 'Esta vez no.'),
      el('p', {}, q.dato),
      el('button', { class: 'btn btn-azul', type: 'button', onclick: () => !ultima ? preguntar(n, i + 1) : practica ? finTutorial() : completar(n) }, textoSeguir));
    despues.querySelector('button').focus();
  }

  pintar(
    el('section', { class: `bloque ${p.color}` },
      el('p', { class: 'etiqueta' }, practica ? `Tutorial · Pregunta ${i + 1} de 3` : `Parada ${n} de 5 · Pregunta ${i + 1} de 3`),
      el('h1', { class: 'pregunta' }, q.texto)),
    el('div', { class: 'texto' }, lista, botonPista, despues));
  pintarPista();
}

// Si recarga en medio de una parada, retoma la primera pregunta sin responder.
function retomarParada(n) {
  const p = parada(n);
  const i = p.preguntas.findIndex((_, k) => !(`${n}-${k}` in partida.respuestas));
  if (i === -1) completar(n); else preguntar(n, i);
}

function completar(n) {
  if (partida.siguiente === n) {
    partida.siguiente = n + 1;
    if (n === 5) partida.fin = Date.now();
    guardar();
  }
  if (n === 5) return final();
  mostrarPista(n);
}

function mostrarPista(n, aviso) {
  const p = parada(n);
  pintar(
    aviso ? el('p', { class: 'aviso' }, aviso) : null,
    el('section', { class: `bloque ${parada(n + 1).color}` },
      el('p', { class: 'etiqueta' }, `Pista hacia la parada ${n + 1} de 5`),
      el('h1', { class: 'pista' }, p.pista)),
    el('div', { class: 'texto' },
      el('p', {}, 'Cuando encuentres el QR, escanealo con la cámara del celular. Esta pista queda guardada: si cerrás la página, volvé a abrirla y aparece de nuevo.')));
}

async function enviar() {
  if (!partida.fin || partida.enviada) return true;
  try {
    await rpc('registrar_puntos', { p_id: partida.id, p_apodo: partida.apodo, p_aciertos: partida.aciertos, p_pistas: partida.pistas, p_segundos: segundos() });
    partida.enviada = true; guardar();
    return true;
  } catch { return false; }
}

async function final() {
  clearInterval(reloj);
  const estado = el('p', { role: 'status' }, 'Enviando tus puntos al ranking…');
  const reintentar = el('button', { class: 'btn btn-azul', type: 'button', hidden: '', onclick: async () => {
    reintentar.hidden = true; estado.textContent = 'Enviando…';
    mostrarEnvio(await enviar());
  } }, 'Reintentar envío');
  const nueva = el('button', { class: 'btn btn-borde', type: 'button', onclick: () => {
    if (!partida.enviada && !confirm('Tus puntos todavía no llegaron al ranking. ¿Empezar igual otra partida?')) return;
    almacen?.removeItem(CLAVE); partida = null; portada('Para jugar de nuevo, escaneá el QR de la parada 1.');
  } }, 'Jugar otra vez');
  function mostrarEnvio(ok) {
    estado.textContent = ok ? 'Tus puntos ya están en el ranking.' : 'No se pudo enviar. Revisá la conexión y tocá «Reintentar envío».';
    reintentar.hidden = ok;
  }
  const detalle = `${partida.aciertos} de ${TOTAL_PREGUNTAS} respuestas correctas, ${partida.pistas} ${partida.pistas === 1 ? 'pista' : 'pistas'}, en ${formato(segundos())}.`;
  pintar(
    el('section', { class: 'bloque amarillo' },
      el('p', { class: 'etiqueta' }, `¡Terminaste, ${partida.apodo}!`),
      el('h1', {}, `${puntos()} puntos`),
      el('p', {}, detalle)),
    el('div', { class: 'texto' }, estado, reintentar,
      el('a', { class: 'btn btn-azul', href: './ranking.html' }, 'Ver el ranking'), nueva));
  mostrarEnvio(await enviar());
}

function arrancarReloj() {
  clearInterval(reloj);
  reloj = setInterval(actualizarBarra, 1000);
}

// ---------- Inicio ----------
function iniciar() {
  const n = leerQR();
  if (partida && !partida.fin) arrancarReloj();

  if (!partida) {
    if (n === 0) return inicioTutorial();
    if (n === 1) return inicioJuego();
    if (n) return portada('Este QR es de otra parada. La búsqueda empieza en el stand de Deporte y Recreación del salón 6: escaneá el QR «Tutorial» y después el de la parada 1.');
    return portada();
  }
  if (partida.fin) return final();

  const toca = partida.siguiente;
  if (n === 0) {
    if (toca === 1) return retomarParada(1);
    return mostrarPista(toca - 1, 'Ya estás jugando: el tiempo está corriendo. Seguí con tu parada.');
  }
  if (n === null) return toca === 1 || Object.keys(partida.respuestas).some(k => k.startsWith(`${toca}-`)) ? retomarParada(toca) : mostrarPista(toca - 1);
  if (n === toca) return retomarParada(n);
  if (n < toca) return mostrarPista(toca - 1, `Ya pasaste por la parada ${n}. Seguí la pista hacia la parada ${toca}.`);
  return mostrarPista(toca - 1, `Ese QR es de la parada ${n}, pero todavía te falta la parada ${toca}. Seguí esta pista.`);
}

iniciar();
