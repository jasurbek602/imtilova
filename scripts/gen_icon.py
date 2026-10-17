# python3 scripts/gen_icon.py -> assets/icon.png, adaptive-icon.png (islomiy: yarim oy + sakkiz qirrali yulduz)
import math
from PIL import Image, ImageDraw, ImageFilter
S = 1024
GOLD = (212, 175, 55, 255)

def star8(d, cx, cy, r, color, width=0):
    # Rub el Hizb: ikki kvadrat (45° burilgan)
    for rot in (0, 45):
        pts = [(cx + r*math.cos(math.radians(rot + 90*i + 45)), cy + r*math.sin(math.radians(rot + 90*i + 45))) for i in range(4)]
        if width: d.polygon(pts, outline=color, width=width)
        else: d.polygon(pts, fill=color)

def motif(size, scale):
    """Shaffof fonda oltin motiv (scale: motivning kattaligi)."""
    im = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    c = size / 2
    R = size * scale / 2
    d.ellipse([c-R, c-R, c+R, c+R], outline=GOLD, width=int(size*0.012))       # tashqi halqa
    star8(d, c, c, R*0.93, GOLD, width=int(size*0.008))                         # geometrik naqsh
    # yarim oy: katta doira - siljigan doira
    r = R*0.62
    moon = Image.new('L', (size, size), 0)
    md = ImageDraw.Draw(moon)
    md.ellipse([c-r-R*0.06, c-r, c+r-R*0.06, c+r], fill=255)
    md.ellipse([c-r*0.78+R*0.22, c-r*0.82, c+r*1.18+R*0.22-r*0.4, c+r*0.82+0], fill=0)
    gold = Image.new('RGBA', (size, size), GOLD)
    im.paste(gold, (0, 0), moon)
    # kichik yulduz
    sx, sy, sr = c + R*0.30, c - R*0.02, R*0.17
    star8(d, sx, sy, sr, GOLD)
    return im

# 1) Asosiy ikonka: gradient fon + motiv
bg = Image.new('RGBA', (S, S))
px = bg.load()
for y in range(S):
    for x in range(S):
        t = (x + y) / (2*S)
        px[x, y] = (int(6 + 8*t), int(18 + 30*t), int(46 + 55*t), 255)
glow = Image.new('RGBA', (S, S), (0, 0, 0, 0))
ImageDraw.Draw(glow).ellipse([S*0.2, S*0.2, S*0.8, S*0.8], fill=(212, 175, 55, 45))
bg = Image.alpha_composite(bg, glow.filter(ImageFilter.GaussianBlur(80)))
bg = Image.alpha_composite(bg, motif(S, 0.78))
bg.convert('RGB').save('assets/icon.png')

# 2) Adaptive ikonka (Android): shaffof, xavfsiz zona ichida (~62%)
motif(S, 0.62).save('assets/adaptive-icon.png')
print('ok')
