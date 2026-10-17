import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer } from 'expo-audio';
import { colors } from '../theme';
import { KEYS, load, save, todayKey } from '../storage';

export default function TasbehScreen() {
  const [s, setS] = useState({ total: 0, today: 0, date: todayKey() });
  const ready = useRef(false);
  const scale = useRef(new Animated.Value(1)).current;
  const player = useAudioPlayer(require('../../assets/chime.wav'));

  useEffect(() => {
    load(KEYS.tasbeh, null).then((d) => {
      if (d) setS(d.date === todayKey() ? d : { ...d, today: 0, date: todayKey() });
      ready.current = true;
    });
  }, []);

  const press = useCallback(() => {
    if (!ready.current) return;
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.94, duration: 60, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

    setS((prev) => {
      const today = todayKey();
      const next = {
        total: prev.total + 1,
        today: (prev.date === today ? prev.today : 0) + 1,
        date: today,
      };
      save(KEYS.tasbeh, next);
      if (next.total % 100 === 0) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        try { player.seekTo(0); player.play(); } catch {}
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      return next;
    });
  }, [player, scale]);

  const cycle = s.total % 100;

  return (
    <View style={st.wrap}>
      <View style={st.row}>
        <View style={st.card}><Text style={st.label}>Bugun</Text><Text style={st.num}>{s.today}</Text></View>
        <View style={st.card}><Text style={st.label}>Jami</Text><Text style={st.num}>{s.total}</Text></View>
      </View>

      <View style={st.center}>
        <Text style={st.arabic}>سُبْحَانَ ٱللَّٰهِ</Text>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Pressable onPress={press} style={st.outer}>
            <View style={st.inner}>
              <Text style={st.big}>{cycle}</Text>
              <Text style={st.small}>/ 100</Text>
            </View>
          </Pressable>
        </Animated.View>
        <Text style={st.hint}>Bosing — har 100 tada tovush chalinadi</Text>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  row: { flexDirection: 'row', gap: 12 },
  card: { flex: 1, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 20, padding: 16, alignItems: 'center' },
  label: { color: colors.muted, fontSize: 13, letterSpacing: 1 },
  num: { color: colors.gold, fontSize: 34, fontWeight: '700', marginTop: 4 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  arabic: { color: colors.text, fontSize: 30, marginBottom: 28 },
  outer: { width: 260, height: 260, borderRadius: 130, borderWidth: 3, borderColor: colors.gold, backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center', elevation: 12, shadowColor: colors.gold },
  inner: { width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(8,26,61,0.85)', borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  big: { color: colors.text, fontSize: 76, fontWeight: '200' },
  small: { color: colors.muted, fontSize: 16 },
  hint: { color: colors.muted, marginTop: 28, fontSize: 13 },
});
