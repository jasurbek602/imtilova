{
  "expo": {
    "name": "Esla",
    "slug": "esla",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "backgroundColor": "#06122e",
    "android": {
      "package": "com.esla.app",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0b2457"
      },
      "permissions": [
        "android.permission.POST_NOTIFICATIONS",
        "android.permission.VIBRATE",
        "android.permission.SCHEDULE_EXACT_ALARM",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION"
      ]
    },
    "plugins": [
      ["expo-notifications", { "color": "#D4AF37", "icon": "./assets/adaptive-icon.png", "sounds": ["./assets/alarm.wav"] }],
      ["expo-location", { "locationWhenInUsePermission": "Namoz vaqtlarini aniq hisoblash uchun joylashuv kerak." }],
      "expo-audio"
    ]
  }
}
