# python3 scripts/gen_icon.py  ->  assets/icon.png va assets/adaptive-icon.png
# Oddiy ikonka: ko'k fon + o'rtada oltin yarim oy
from PIL import Image, ImageDraw

SIZE = 1024
SS = 2                      # silliq qirralar uchun 2x chizib, kichraytiramiz
BLUE = (11, 36, 87)         # #0b2457 (app.json dagi adaptiveIcon.backgroundColor bilan bir xil)
GOLD = (212, 175, 55)

def crescent_mask(size, scale):
    s = size * SS
    c = s / 2
    R = s * scale / 2                       # tashqi doira radiusi
    m = Image.new('L', (s, s), 0)
    d = ImageDraw.Draw(m)
    d.ellipse([c - R, c - R, c + R, c + R], fill=255)
    r = R * 0.80                            # kesuvchi doira (ichki bo'sh joy)
    ox, oy = R * 0.38, -R * 0.12            # siljish -> oy o'ng-yuqoriga ochiladi
    d.ellipse([c + ox - r, c + oy - r, c + ox + r, c + oy + r], fill=0)
    return m.resize((size, size), Image.LANCZOS)

def crescent_layer(size, scale):
    layer = Image.new('RGBA', (size, size), GOLD + (255,))
    layer.putalpha(crescent_mask(size, scale))
    return layer

# 1) Asosiy ikonka: ko'k fon + oy
icon = Image.new('RGBA', (SIZE, SIZE), BLUE + (255,))
icon.alpha_composite(crescent_layer(SIZE, 0.56))
icon.convert('RGB').save('assets/icon.png')

# 2) Android adaptive ikonka: shaffof fon + oy (fonni app.json beradi)
adaptive = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
adaptive.alpha_composite(crescent_layer(SIZE, 0.44))
adaptive.save('assets/adaptive-icon.png')
print('ok')
