import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function AdminLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: '#EA580C' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: 'Quản trị viên', headerShown: false }}
        />
        <Stack.Screen
          name="recipes"
          options={{ title: 'Quản lý món ăn' }}
        />
        <Stack.Screen
          name="ingredients"
          options={{ title: 'Quản lý nguyên liệu' }}
        />
        <Stack.Screen
          name="categories"
          options={{ title: 'Quản lý danh mục' }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}