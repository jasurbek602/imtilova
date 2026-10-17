# python3 scripts/gen_sounds.py  -> assets/chime.wav va assets/alarm.wav yaratadi
import wave, struct, math
def write(path, samples, sr):
    with wave.open(path, 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes(b''.join(struct.pack('<h', int(max(-1, min(1, s)) * 32000)) for s in samples))
sr = 22050
chime = [(math.sin(2*math.pi*880*i/sr) + 0.5*math.sin(2*math.pi*1320*i/sr)) * math.exp(-4*i/sr) * 0.5
         for i in range(int(sr*1.3))]
write('assets/chime.wav', chime, sr)
# 60 soniyalik budilnik (bildirishnoma surib tashlansa tovush to'xtaydi)
alarm = []
for i in range(sr*60):
    t = i / sr; p = t % 1.0
    f = 784 if p < 0.25 else 988 if p < 0.5 else 784 if p < 0.75 else 0
    env = 0 if f == 0 else min(1, (p % 0.25) * 40) * 0.6
    alarm.append(math.sin(2*math.pi*f*t) * env)
write('assets/alarm.wav', alarm, sr)
