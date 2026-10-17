import AsyncStorage from '@react-native-async-storage/async-storage';
export const KEYS = { tasbeh: 'tasbeh_v1', coords: 'coords_v1', ayah: 'ayah_v1' };
export const todayKey = () => new Date().toDateString();
export const load = async (k, fallback) => {
  try { const v = await AsyncStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
};
export const save = (k, v) => AsyncStorage.setItem(k, JSON.stringify(v)).catch(() => {});
