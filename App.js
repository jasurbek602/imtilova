import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TasbehScreen from './src/screens/TasbehScreen';
import PrayerScreen from './src/screens/PrayerScreen';
import { colors } from './src/theme';

const Tab = createBottomTabNavigator();
const navTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: 'transparent' } };

function Screen({ title, children }) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Text style={st.title}>{title}</Text>
      {children}
    </SafeAreaView>
  );
}
const Tasbeh = () => <Screen title="Tasbeh"><TasbehScreen /></Screen>;
const Namoz = () => <Screen title="Namoz vaqtlari"><PrayerScreen /></Screen>;

function Tabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: 'rgba(6,18,46,0.95)', borderTopColor: colors.border, height: 62 + insets.bottom, paddingBottom: insets.bottom + 6, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={route.name === 'Tasbeh' ? 'radio-button-on' : 'time'} size={size + 2} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Tasbeh" component={Tasbeh} />
      <Tab.Screen name="Namoz vaqtlari" component={Namoz} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <LinearGradient colors={colors.bg} style={StyleSheet.absoluteFill} />
      <NavigationContainer theme={navTheme}><Tabs /></NavigationContainer>
    </SafeAreaProvider>
  );
}

const st = StyleSheet.create({
  title: { color: colors.gold, fontSize: 24, fontWeight: '700', textAlign: 'center', marginTop: 8, marginBottom: 8, letterSpacing: 1 },
});
