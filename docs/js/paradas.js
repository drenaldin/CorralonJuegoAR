// Recorrido de la Muestra Anual 2026 · UTU San Marcos.
// "codigo" va dentro de cada QR (?p=N&c=codigo). Si se cambia, hay que volver a generar los QR.
export const PARADAS = [
  {
    numero: 1, codigo: 'dr6x2k', color: 'verde',
    lugar: 'Stand de Deporte y Recreación · Salón 6',
    pista: 'Para la próxima parada buscá el número de la suerte. Está pintado en verde, bien grande, en la pared de un salón. El QR está escondido por esa zona.',
    preguntas: [
      { texto: '¿Cuántos jugadores de cada equipo hay en una cancha de fútbol?', opciones: ['9', '10', '11', '12'], correcta: 2, dato: 'Son 11, contando al golero.' },
      { texto: '¿Qué deporte se juega con una pelota naranja y un aro?', opciones: ['Básquetbol', 'Vóleibol', 'Rugby', 'Handball'], correcta: 0, dato: 'El básquetbol se inventó en 1891 con dos canastas de duraznos.' },
      { texto: '¿Qué órgano bombea la sangre por todo el cuerpo?', opciones: ['Los pulmones', 'El estómago', 'El hígado', 'El corazón'], correcta: 3, dato: 'El corazón late unas 100.000 veces por día.' }
    ]
  },
  {
    numero: 2, codigo: 's7q9mt', color: 'celeste',
    lugar: 'Salón 7 · el número de la suerte',
    pista: 'Ahora buscá unos asientos que antes rodaban por la calle: redondos, de goma y pintados de colores, a la sombra de un árbol.',
    preguntas: [
      { texto: '¿Cuál de estos deportes es el más antiguo?', opciones: ['Vóleibol', 'Lucha', 'Básquetbol', 'Handball'], correcta: 1, dato: 'La lucha ya se practicaba en los Juegos Olímpicos de la Antigua Grecia, hace más de 2.700 años.' },
      { texto: '¿Cada cuántos años se hacen los Juegos Olímpicos de verano?', opciones: ['Cada 2 años', 'Cada 3 años', 'Cada 4 años', 'Cada 5 años'], correcta: 2, dato: 'Cada 4 años. A ese período se le llama olimpíada.' },
      { texto: '¿Qué gas tomamos del aire cuando respiramos?', opciones: ['Oxígeno', 'Helio', 'Humo', 'Vapor'], correcta: 0, dato: 'Tomamos oxígeno y largamos dióxido de carbono.' }
    ]
  },
  {
    numero: 3, codigo: 'nm4r8p', color: 'naranja',
    lugar: 'Asientos de neumáticos pintados',
    pista: 'Seguí hasta donde la gente se junta alrededor del fuego: bancos en ronda, piso de ladrillo y aparatos para hacer ejercicio cerca.',
    preguntas: [
      { texto: '¿Cuántas patas tiene una araña?', opciones: ['6', '8', '10', '4'], correcta: 1, dato: 'Tiene 8. Por eso no es un insecto: los insectos tienen 6.' },
      { texto: 'En básquetbol, ¿cuántos puntos vale un tiro desde atrás de la línea grande?', opciones: ['1', '2', '4', '3'], correcta: 3, dato: 'Vale 3 puntos. Los tiros libres valen 1.' },
      { texto: '¿Qué parte de la planta toma el agua del suelo?', opciones: ['La flor', 'Las hojas', 'La raíz', 'El fruto'], correcta: 2, dato: 'La raíz absorbe el agua y el tallo la lleva hacia arriba.' }
    ]
  },
  {
    numero: 4, codigo: 'fg3w7z', color: 'rojo',
    lugar: 'El fogón',
    pista: 'Última parada: volvé al lugar donde empezó todo. Te esperamos en el stand de Deporte y Recreación.',
    preguntas: [
      { texto: '¿Qué necesitan las plantas para fabricar su propio alimento?', opciones: ['Luz del sol', 'Sal', 'Leche', 'Fuego'], correcta: 0, dato: 'Con luz, agua y aire hacen la fotosíntesis.' },
      { texto: '¿Cuál es el hueso más largo del cuerpo humano?', opciones: ['El húmero', 'El fémur', 'Una costilla', 'La clavícula'], correcta: 1, dato: 'El fémur, en el muslo. También es el más fuerte.' },
      { texto: '¿Qué país ganó el primer Mundial de fútbol, en 1930?', opciones: ['Brasil', 'Argentina', 'Uruguay', 'Italia'], correcta: 2, dato: 'Uruguay le ganó 4 a 2 a Argentina en el Estadio Centenario.' }
    ]
  },
  {
    numero: 5, codigo: 'fn5k2h', color: 'agua',
    lugar: 'Stand de Deporte y Recreación · Salón 6',
    pista: '',
    preguntas: [
      { texto: '¿Cuál es el animal terrestre más rápido?', opciones: ['El caballo', 'El león', 'El avestruz', 'El guepardo'], correcta: 3, dato: 'El guepardo pasa los 100 km/h en carreras cortas.' },
      { texto: '¿Cuántos anillos tiene la bandera olímpica?', opciones: ['5', '4', '6', '7'], correcta: 0, dato: 'Son 5 anillos entrelazados, uno por cada continente.' },
      { texto: '¿Cuánta agua tiene, más o menos, el cuerpo de una persona adulta?', opciones: ['Casi nada', 'Un cuarto', 'Un poco más de la mitad', 'Todo es agua'], correcta: 2, dato: 'Cerca del 60 % del cuerpo es agua.' }
    ]
  }
];

// Parada 0: práctica. No suma puntos ni corre el tiempo.
export const TUTORIAL = {
  numero: 0, codigo: 'tu0r1a', color: 'azul',
  preguntas: [
    { texto: '¿En qué deporte se usa una raqueta?', opciones: ['Fútbol', 'Tenis', 'Natación', 'Atletismo'], correcta: 1, dato: 'También en pádel, bádminton y ping pong.' },
    { texto: '¿Con qué parte del cuerpo vemos?', opciones: ['Las orejas', 'La nariz', 'Los ojos', 'Las manos'], correcta: 2, dato: 'Los ojos captan la luz y el cerebro arma la imagen.' },
    { texto: 'Probá el botón «Pista»: ¿cuántas patas tiene un perro?', opciones: ['2', '6', '8', '4'], correcta: 3, dato: 'Cada pista tacha una opción incorrecta. En el juego de verdad, cada pista resta 25 puntos.' }
  ]
};

export const PUNTOS_PISTA = 25;
export const TOTAL_PREGUNTAS = PARADAS.reduce((n, p) => n + p.preguntas.length, 0);
export const calcularPuntos = (aciertos, pistas, segundos) =>
  Math.max(0, aciertos * 100 - pistas * PUNTOS_PISTA + Math.max(0, 300 - Math.floor(segundos / 10)));
