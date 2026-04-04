import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

const IndexScreen = () => {
  const { loading, isAuthenticated, isFirstLaunch } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Chưa đăng nhập → Onboarding
        if (isFirstLaunch) {
          router.replace('/Onboarding');
        } else {
          router.replace('/Login');
        }
      } else {
        // Đã đăng nhập → Main app (tabs)
        router.replace('/(tabs)');
      }
    }
  }, [loading, isAuthenticated, isFirstLaunch]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#EA580C" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default IndexScreen;
