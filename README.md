# Islom Yo'li (Expo)
1. npm install && npx expo install --fix
2. Dev build (Expo Go'da maxsus budilnik tovushi ishlamaydi):  npx expo run:android
3. Keyingi safar:  npx expo start --dev-client
Ovozlarni qayta yaratish: python3 scripts/gen_sounds.py

## GitHub Actions orqali APK yig'ish
1. Loyihani GitHub repoga push qiling (main branch).
2. Repo → Actions → "Build Android APK" (push qilsangiz o'zi ishga tushadi, yoki "Run workflow").
3. Tugagach (~10-15 daqiqa) run sahifasi pastidagi Artifacts → islom-yoli-apk ni yuklab, zip ichidagi .apk ni S22 ga o'rnating.
