"""Genera qr/qr-paradas.pdf (una hoja A4 por parada) y los PNG sueltos.
Uso: python generar-qr.py [URL_DEL_SITIO]
Requiere: pip install "qrcode[pil]" reportlab"""
import sys, pathlib, qrcode
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

BASE = (sys.argv[1] if len(sys.argv) > 1 else 'https://drenaldin.github.io/CorralonJuegoAR/').rstrip('/') + '/'
PARADAS = [  # (número, código, color, dónde se pega)
    (0, 'tu0r1a', '#064795', 'Stand de Deporte y Recreación (salón 6), en la entrada: tutorial, no corre el tiempo'),
    (1, 'dr6x2k', '#1C7F45', 'Stand de Deporte y Recreación (salón 6), al lado del Tutorial: arranca el tiempo'),
    (2, 's7q9mt', '#0072B1', 'Salón 7, cerca del 7 verde pintado en la pared'),
    (3, 'nm4r8p', '#B4531A', 'Asientos de neumáticos pintados'),
    (4, 'fg3w7z', '#C8242B', 'Fogón'),
    (5, 'fn5k2h', '#0F7C86', 'Stand de Deporte y Recreación (salón 6), separado del QR 1: final'),
]
salida = pathlib.Path(__file__).resolve().parent.parent / 'qr'
salida.mkdir(exist_ok=True)
W, H = A4
c = canvas.Canvas(str(salida / 'qr-paradas.pdf'), pagesize=A4)
c.setTitle('QR de la búsqueda · Muestra Anual 2026 · UTU San Marcos')
for n, cod, color, lugar in PARADAS:
    url = f'{BASE}?p={n}&c={cod}'
    q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=20, border=2)
    q.add_data(url); q.make(fit=True)
    img = q.make_image(fill_color='black', back_color='white').convert('RGB')
    img.save(salida / f'qr-parada-{n}.png')
    c.setFillColor('#064795'); c.rect(0, H - 3.2*cm, W, 3.2*cm, stroke=0, fill=1)
    c.setFillColor('white'); c.setFont('Helvetica-Bold', 22); c.drawString(2*cm, H - 1.75*cm, 'UTU SAN MARCOS')
    c.setFont('Helvetica', 14); c.drawString(2*cm, H - 2.5*cm, 'Muestra Anual 2026 · Búsqueda del QR')
    c.setFillColor(color); c.rect(0, H - 4.0*cm, W, 0.8*cm, stroke=0, fill=1)
    c.setFillColor('#18212E'); c.setFont('Helvetica-Bold', 54); c.drawCentredString(W/2, H - 6.7*cm, 'TUTORIAL' if n == 0 else f'PARADA {n}')
    c.setFont('Helvetica', 18); c.drawCentredString(W/2, H - 7.8*cm, 'Empezá acá · práctica' if n == 0 else 'de 5')
    lado = 14*cm
    c.drawImage(ImageReader(img), (W - lado)/2, H - 8.6*cm - lado, lado, lado)
    c.setFont('Helvetica-Bold', 20); c.drawCentredString(W/2, 4.6*cm, 'Escaneá con la cámara de tu celular')
    c.setFont('Helvetica', 14); c.setFillColor('#5A6472')
    c.drawCentredString(W/2, 3.7*cm, ('Practicá con 3 preguntas. El tiempo no corre.' if n == 0 else 'Respondé 3 preguntas y seguí la pista.' if n < 5 else 'Respondé las últimas 3 preguntas y mirá tu puntaje.'))
    c.setFont('Helvetica', 8); c.drawCentredString(W/2, 1.2*cm, f'Colocar en: {lugar}')
    c.setFillColor(color); c.rect(0, 0, W, 0.6*cm, stroke=0, fill=1)
    c.showPage()
c.save()
print('Listo:', salida / 'qr-paradas.pdf', '·', BASE)
