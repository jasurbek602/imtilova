import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { buildEntries, fmt, fmtDur } from './prayer';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false,
  }),
});

const T = Notifications.SchedulableTriggerInputTypes;

export async function setupNotifications() {
  if (Platform.OS === 'android') {
    // Namoz kanali: budilnik tovushi + faqat dastlabki 5 soniya vibratsiya
    await Notifications.setNotificationChannelAsync('prayer-alarm', {
      name: 'Namoz vaqti (budilnik)',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'alarm.wav',
      vibrationPattern: [0, 5000],
      enableVibrate: true,
      bypassDnd: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      audioAttributes: {
        usage: Notifications.AndroidAudioUsage.ALARM,
        contentType: Notifications.AndroidAudioContentType.SONIFICATION,
      },
    });
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Eslatmalar',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

const daily = (hour, minute, title, body) =>
  Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { type: T.DAILY, hour, minute, channelId: 'reminders' },
  });

export async function scheduleAll(coords, ayahCount) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  const now = new Date();

  // 1) Keyingi 7 kun namoz vaqtlari (ilova ochilganda qayta rejalashtiriladi)
  for (let day = 0; day < 7; day++) {
    for (const e of buildEntries(coords, now, day)) {
      if (e.time <= now) continue;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🕌 ${e.name} vaqti kirdi (${fmt(e.time)})`,
          body: `Keyingi: ${e.next} — ${fmt(e.nextTime)} da, ya'ni ${fmtDur(e.nextTime - e.time)} dan keyin. ` +
                `Budilnikni to'xtatish uchun bildirishnomani surib tashlang.`,
          sound: 'alarm.wav',
          sticky: true,
          autoDismiss: false,
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: { type: T.DATE, date: e.time, channelId: 'prayer-alarm' },
      });
    }
  }

  // 2) Kunlik eslatmalar
  const q = ayahCount || 10;
  await daily(8, 0, "📖 Qur'on eslatmasi", `Bugun ${q} oyat o'qishingiz kerak. Qur'on qalblar oromi!`);
  await daily(22, 0, "📖 Qur'on eslatmasi", `Bugungi ${q} oyatni o'qidingizmi? Qur'on qalblar oromi!`);
  await daily(21, 0, '🕋 Namoz tekshiruvi',
    "Namozlarning hammasini o'qidingizmi? Agar qolib ketgan bo'lsa, to'ldirib qo'ying (qazo qiling)!");
  await daily(23, 0, '🌙 Uyqu vaqti', 'Bugun vaqtli uxlang va namozga vaqtli turing! Bu buyruq!');
}
