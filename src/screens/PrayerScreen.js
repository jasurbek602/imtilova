import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, Keyboard } from 'react-native';
import * as Location from 'expo-location';
import { colors } from '../theme';
import { buildEntries, fmt, fmtClock, DEFAULT_COORDS } from '../prayer';
import { setupNotifications, scheduleAll } from '../notifications';
import { KEYS, load, save } from '../storage';

export default function PrayerScreen() {
  const [coords, setCoords] = useState(null);
  const [place, setPlace] = useState('Joylashuv aniqlanmoqda...');
  const [now, setNow] = useState(new Date());
  const [ayah, setAyah] = useState(10);
  const [input, setInput] = useState('10');
  const [ayahReady, setAyahReady] = useState(false);

  useEffect(() => {
    (async () => {
      await setupNotifications();
      const a = await load(KEYS.ayah, 10);
      setAyah(a); setInput(String(a)); setAyahReady(true);

      let c = null;
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        try {
          const p = (await Location.getLastKnownPositionAsync()) ||
                    (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
          c = { latitude: p.coords.latitude, longitude: p.coords.longitude };
          save(KEYS.coords, c);
          setPlace(`GPS: ${c.latitude.toFixed(3)}, ${c.longitude.toFixed(3)}`);
        } catch {}
      }
      if (!c) {
        c = await load(KEYS.coords, null);
        if (c) setPlace('Oxirgi saqlangan joylashuv');
      }
      if (!c) { c = DEFAULT_COORDS; setPlace('Toshkent (standart)'); }
      setCoords(c);
    })();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (coords && ayahReady) scheduleAll(coords, ayah).catch(() => {});
  }, [coords, ayah, ayahReady]);

  const dayKey = now.toDateString();
  const entries = useMemo(() => (coords ? buildEntries(coords, now) : []), [coords, dayKey]);

  let nextName = '', nextTime = null, currentKey = null;
  if (entries.length) {
    const idx = entries.findIndex((e) => e.time > now);
    if (idx === -1) { nextName = 'Bomdod (ertaga)'; nextTime = entries[4].nextTime; currentKey = 'isha'; }
    else { nextName = entries[idx].name; nextTime = entries[idx].time; currentKey = idx > 0 ? entries[idx - 1].key : null; }
  }

  const saveAyah = () => {
    const n = Math.max(1, parseInt(input, 10) || 1);
    setAyah(n); setInput(String(n)); save(KEYS.ayah, n); Keyboard.dismiss();
  };

  return (
    <ScrollView contentContainerStyle={st.wrap} keyboardShouldPersistTaps="handled">
      <Text style={st.place}>📍 {place}</Text>

      <View style={st.hero}>
        <Text style={st.heroLabel}>Keyingi namoz: {nextName}</Text>
        <Text style={st.heroTime}>{nextTime ? fmtClock(nextTime - now) : '--:--:--'}</Text>
        <Text style={st.heroSub}>{nextTime ? `${fmt(nextTime)} da kiradi` : ''}</Text>
      </View>

      {entries.map((e) => (
        <View key={e.key} style={[st.item, currentKey === e.key && st.active]}>
          <Text style={[st.name, currentKey === e.key && { color: colors.gold }]}>{e.name}</Text>
          <Text style={st.time}>{fmt(e.time)}</Text>
        </View>
      ))}

      <View style={st.plan}>
        <Text style={st.planTitle}>📖 Kunlik Qur'on rejasi</Text>
        <Text style={st.planSub}>Kuniga necha oyat o'qimoqchisiz? (08:00 va 22:00 da eslatma keladi)</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          <TextInput value={input} onChangeText={setInput} keyboardType="number-pad" style={st.input} maxLength={4} />
          <Pressable onPress={saveAyah} style={st.btn}><Text style={st.btnText}>Saqlash</Text></Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  wrap: { padding: 20, paddingBottom: 40 },
  place: { color: colors.muted, textAlign: 'center', marginBottom: 12 },
  hero: { backgroundColor: colors.goldSoft, borderColor: colors.gold, borderWidth: 1, borderRadius: 24, padding: 20, alignItems: 'center', marginBottom: 16 },
  heroLabel: { color: colors.text, fontSize: 16 },
  heroTime: { color: colors.gold, fontSize: 46, fontWeight: '300', marginVertical: 6 },
  heroSub: { color: colors.muted },
  item: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: 'transparent' },
  active: { borderColor: colors.gold },
  name: { color: colors.text, fontSize: 17 },
  time: { color: colors.text, fontSize: 17, fontWeight: '600' },
  plan: { backgroundColor: colors.card, borderRadius: 20, padding: 16, marginTop: 14, borderWidth: 1, borderColor: colors.border },
  planTitle: { color: colors.gold, fontSize: 16, fontWeight: '700' },
  planSub: { color: colors.muted, marginTop: 4, fontSize: 13 },
  input: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', color: colors.text, borderRadius: 12, paddingHorizontal: 14, fontSize: 18, borderWidth: 1, borderColor: colors.border },
  btn: { backgroundColor: colors.gold, borderRadius: 12, paddingHorizontal: 20, justifyContent: 'center' },
  btnText: { color: '#06122e', fontWeight: '700' },
});
