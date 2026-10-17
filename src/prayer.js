import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';

export const DEFAULT_COORDS = { latitude: 41.2995, longitude: 69.2401 }; // Toshkent

const params = CalculationMethod.MuslimWorldLeague();
params.madhab = Madhab.Hanafi;

const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, 12);
const pt = (c, d) => new PrayerTimes(new Coordinates(c.latitude, c.longitude), d, params);

export const pad = (n) => String(n).padStart(2, '0');
export const fmt = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
export const fmtDur = (ms) => {
  const m = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(m / 60);
  return h ? `${h} soat ${m % 60} daqiqa` : `${m} daqiqa`;
};
export const fmtClock = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
};

export function buildEntries(coords, date, offset = 0) {
  const base = addDays(date, offset);
  const p = pt(coords, base);
  const tomorrow = pt(coords, addDays(base, 1));
  return [
    { key: 'fajr', name: 'Bomdod', time: p.fajr, next: 'Quyosh chiqishi', nextTime: p.sunrise },
    { key: 'dhuhr', name: 'Peshin', time: p.dhuhr, next: 'Asr', nextTime: p.asr },
    { key: 'asr', name: 'Asr', time: p.asr, next: 'Shom', nextTime: p.maghrib },
    { key: 'maghrib', name: 'Shom', time: p.maghrib, next: 'Xufton', nextTime: p.isha },
    { key: 'isha', name: 'Xufton', time: p.isha, next: 'Bomdod', nextTime: tomorrow.fajr },
  ];
}
